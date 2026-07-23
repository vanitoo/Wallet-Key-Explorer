const INPUT_CHARSET = "0123456789()[],'/*abcdefgh@:$%{}IJKLMNOPQRSTUVWXYZ&+-.;<=>?!^_|~ijklmnopqrstuvwxyzABCDEFGH`#\"\\ ";
const CHECKSUM_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GENERATOR = [0xf5dee51989n, 0xa9fdca3312n, 0x1bab10e32dn, 0x3706b1677an, 0x644d626ffdn];

export type DescriptorNetwork = "mainnet" | "testnet" | "mixed" | "unknown";
export type DescriptorBranch = "receive" | "change" | "mixed" | "custom";
export type DescriptorChecksumStatus = "missing" | "valid" | "invalid";

export type ParsedDescriptorKey = {
  fingerprint: string;
  path: string;
  origin: string;
  xpub: string;
  branch: string;
  branchType: "receive" | "change" | "custom";
  wildcard: boolean;
  prefix: string;
  network: "mainnet" | "testnet" | "unknown";
  compatibility: "recommended" | "warning" | "unknown";
};

export type ParsedDescriptor = {
  compact: string;
  body: string;
  checksum?: string;
  calculatedChecksum: string;
  checksumValid?: boolean;
  checksumStatus: DescriptorChecksumStatus;
  scriptType: "P2WSH";
  functionName: "sortedmulti";
  threshold: number;
  total: number;
  keys: ParsedDescriptorKey[];
  network: DescriptorNetwork;
  branch: DescriptorBranch;
  warnings: string[];
  score: number;
};

function polymod(c: bigint, value: number): bigint {
  const top = c >> 35n;
  let next = ((c & 0x7ffffffffn) << 5n) ^ BigInt(value);
  for (let i = 0; i < 5; i += 1) if (((top >> BigInt(i)) & 1n) !== 0n) next ^= GENERATOR[i];
  return next;
}

export function descriptorChecksum(body: string): string {
  let c = 1n;
  let cls = 0;
  let clsCount = 0;
  for (const char of body) {
    const position = INPUT_CHARSET.indexOf(char);
    if (position === -1) throw new Error(`Недопустимый символ descriptor: ${char}`);
    c = polymod(c, position & 31);
    cls = cls * 3 + (position >> 5);
    clsCount += 1;
    if (clsCount === 3) {
      c = polymod(c, cls);
      cls = 0;
      clsCount = 0;
    }
  }
  if (clsCount > 0) c = polymod(c, cls);
  for (let i = 0; i < 8; i += 1) c = polymod(c, 0);
  c ^= 1n;
  let checksum = "";
  for (let i = 0; i < 8; i += 1) checksum += CHECKSUM_CHARSET[Number((c >> BigInt(5 * (7 - i))) & 31n)];
  return checksum;
}

function splitTopLevel(value: string): string[] {
  const parts: string[] = [];
  let start = 0;
  let squareDepth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "[") squareDepth += 1;
    if (char === "]") squareDepth -= 1;
    if (squareDepth < 0) throw new Error("Нарушен баланс квадратных скобок");
    if (char === "," && squareDepth === 0) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }
  if (squareDepth !== 0) throw new Error("Нарушен баланс квадратных скобок");
  parts.push(value.slice(start));
  return parts;
}

function keyNetwork(xpub: string): "mainnet" | "testnet" | "unknown" {
  if (/^(xpub|ypub|zpub)/.test(xpub)) return "mainnet";
  if (/^(tpub|upub|vpub)/.test(xpub)) return "testnet";
  return "unknown";
}

function keyPrefix(xpub: string): string {
  return xpub.slice(0, 4).toLowerCase();
}

function keyCompatibility(prefix: string): "recommended" | "warning" | "unknown" {
  if (prefix === "xpub" || prefix === "tpub") return "recommended";
  if (["ypub", "zpub", "upub", "vpub"].includes(prefix)) return "warning";
  return "unknown";
}

function normalizedPath(path: string): string {
  return path.replace(/h/gi, "'");
}

function validateOriginPath(path: string, keyIndex: number): string {
  const normalized = normalizedPath(path);
  if (!/^\d+'?(\/\d+'?)*$/.test(normalized)) {
    throw new Error(`Ключ ${keyIndex}: некорректный origin path`);
  }
  for (const part of normalized.split("/")) {
    const index = Number(part.replace("'", ""));
    if (!Number.isSafeInteger(index) || index < 0 || index >= 0x80000000) {
      throw new Error(`Ключ ${keyIndex}: индекс origin path вне диапазона`);
    }
  }
  return normalized;
}

function classifyBranch(branch: string): "receive" | "change" | "custom" {
  if (branch === "/0/*") return "receive";
  if (branch === "/1/*") return "change";
  return "custom";
}

function isBip48P2wsh(path: string, network: "mainnet" | "testnet" | "unknown"): boolean {
  const coin = network === "mainnet" ? "0" : network === "testnet" ? "1" : "[01]";
  return new RegExp(`^48'/${coin}'/\\d+'/2'$`).test(path);
}

export function parseDescriptor(input: string): ParsedDescriptor {
  const compact = input.replace(/\s+/g, "").trim();
  if (!compact) throw new Error("Вставьте descriptor");
  if ((compact.match(/#/g) ?? []).length > 1) throw new Error("Descriptor содержит несколько разделителей checksum");

  const hashIndex = compact.lastIndexOf("#");
  const body = hashIndex === -1 ? compact : compact.slice(0, hashIndex);
  const checksum = hashIndex === -1 ? undefined : compact.slice(hashIndex + 1);
  if (checksum !== undefined && !/^[a-z0-9]{8}$/.test(checksum)) throw new Error("Checksum должен содержать 8 символов");

  const match = body.match(/^wsh\(sortedmulti\((\d+),(.+)\)\)$/);
  if (!match) throw new Error("Пока поддерживается формат wsh(sortedmulti(...))");
  const threshold = Number(match[1]);
  const rawKeys = splitTopLevel(match[2]);
  if (rawKeys.length < 2) throw new Error("Multisig descriptor должен содержать минимум два ключа");

  const keys = rawKeys.map((raw, index): ParsedDescriptorKey => {
    const keyNumber = index + 1;
    const keyMatch = raw.match(/^\[([0-9a-fA-F]{8})\/([^\]]+)\]([^/]+)(\/.*)$/);
    if (!keyMatch) throw new Error(`Ключ ${keyNumber}: ожидается [FINGERPRINT/path]xpub/branch/*`);
    const xpub = keyMatch[3];
    const prefix = keyPrefix(xpub);
    if (["xprv", "yprv", "zprv", "tprv", "uprv", "vprv"].includes(prefix)) {
      throw new Error(`Ключ ${keyNumber}: private extended keys запрещены`);
    }
    const path = validateOriginPath(keyMatch[2], keyNumber);
    const branch = keyMatch[4];
    if (!/^\/\d+(\/\d+)*\/\*$/.test(branch)) throw new Error(`Ключ ${keyNumber}: branch должен заканчиваться wildcard /*`);
    const network = keyNetwork(xpub);
    return {
      fingerprint: keyMatch[1].toUpperCase(),
      path,
      origin: `[${keyMatch[1].toUpperCase()}/${path}]`,
      xpub,
      branch,
      branchType: classifyBranch(branch),
      wildcard: branch.endsWith("/*"),
      prefix,
      network,
      compatibility: keyCompatibility(prefix),
    };
  });

  if (threshold < 1 || threshold > keys.length) throw new Error("Порог подписей должен быть от 1 до количества ключей");

  const calculatedChecksum = descriptorChecksum(body);
  const checksumStatus: DescriptorChecksumStatus = checksum === undefined ? "missing" : checksum === calculatedChecksum ? "valid" : "invalid";
  const networks = new Set(keys.map((key) => key.network).filter((network) => network !== "unknown"));
  const network: DescriptorNetwork = networks.size > 1 ? "mixed" : networks.size === 1 ? [...networks][0] : "unknown";
  const branchTypes = new Set(keys.map((key) => key.branchType));
  const branch: DescriptorBranch = branchTypes.has("custom") ? "custom" : branchTypes.size > 1 ? "mixed" : [...branchTypes][0];
  const warnings: string[] = [];
  const duplicateKeys = new Set(keys.map((key) => `${key.xpub}${key.branch}`)).size !== keys.length;
  const duplicateFingerprints = new Set(keys.map((key) => key.fingerprint)).size !== keys.length;
  const pathSet = new Set(keys.map((key) => key.path));
  const incompatiblePrefixes = [...new Set(keys.filter((key) => key.compatibility === "warning").map((key) => key.prefix))];
  const unknownPrefixes = [...new Set(keys.filter((key) => key.compatibility === "unknown").map((key) => key.prefix))];
  const nonStandardPaths = keys.filter((key) => !isBip48P2wsh(key.path, key.network)).length;

  if (checksumStatus === "missing") warnings.push("Checksum отсутствует");
  if (checksumStatus === "invalid") warnings.push("Checksum не совпадает");
  if (duplicateKeys) warnings.push("Обнаружены одинаковые extended public keys и branches");
  if (duplicateFingerprints) warnings.push("Обнаружены совпадающие fingerprints");
  if (network === "mixed") warnings.push("В descriptor смешаны mainnet и testnet ключи");
  if (network === "unknown") warnings.push("Сеть descriptor не определена");
  if (threshold === 1 && keys.length > 1) warnings.push("Схема 1-of-N почти не даёт преимуществ multisig");
  if (threshold === keys.length) warnings.push("Для расходования нужны все ключи");
  if (incompatiblePrefixes.length > 0) warnings.push(`Для P2WSH multisig предпочтительны xpub/tpub; обнаружены ${incompatiblePrefixes.join(", ")}`);
  if (unknownPrefixes.length > 0) warnings.push(`Неизвестные extended key prefixes: ${unknownPrefixes.join(", ")}`);
  if (nonStandardPaths > 0) warnings.push(`${nonStandardPaths} ключ(а) используют путь, отличный от BIP-48 P2WSH .../2'`);
  if (pathSet.size > 1) warnings.push("У подписантов различаются account derivation paths");
  if (branch === "mixed") warnings.push("В одном descriptor смешаны receive и change branches");
  if (branch === "custom") warnings.push("Обнаружена нестандартная ветка вместо /0/* или /1/*");

  let score = 100;
  if (checksumStatus === "missing") score -= 10;
  if (checksumStatus === "invalid") score -= 35;
  if (duplicateKeys) score -= 50;
  if (duplicateFingerprints) score -= 10;
  if (network === "mixed") score -= 40;
  if (network === "unknown") score -= 15;
  if (threshold === 1 && keys.length > 1) score -= 15;
  if (incompatiblePrefixes.length > 0) score -= 15;
  if (unknownPrefixes.length > 0) score -= 20;
  if (nonStandardPaths > 0) score -= 15;
  if (pathSet.size > 1) score -= 10;
  if (branch === "mixed" || branch === "custom") score -= 20;

  return {
    compact: `${body}#${calculatedChecksum}`,
    body,
    checksum,
    calculatedChecksum,
    checksumValid: checksum === undefined ? undefined : checksum === calculatedChecksum,
    checksumStatus,
    scriptType: "P2WSH",
    functionName: "sortedmulti",
    threshold,
    total: keys.length,
    keys,
    network,
    branch,
    warnings,
    score: Math.max(0, score),
  };
}

export function formatDescriptor(parsed: ParsedDescriptor): string {
  const keyLines = parsed.keys.map((key) => `    ${key.origin}${key.xpub}${key.branch}`).join(",\n");
  return `wsh(\n  sortedmulti(\n    ${parsed.threshold},\n${keyLines}\n  )\n)#${parsed.calculatedChecksum}`;
}
