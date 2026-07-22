const INPUT_CHARSET = "0123456789()[],'/*abcdefgh@:$%{}IJKLMNOPQRSTUVWXYZ&+-.;<=>?!^_|~ijklmnopqrstuvwxyzABCDEFGH`#\"\\ ";
const CHECKSUM_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GENERATOR = [0xf5dee51989n, 0xa9fdca3312n, 0x1bab10e32dn, 0x3706b1677an, 0x644d626ffdn];

export type ParsedDescriptorKey = {
  fingerprint: string;
  path: string;
  xpub: string;
  branch: string;
};

export type ParsedDescriptor = {
  compact: string;
  body: string;
  checksum?: string;
  calculatedChecksum: string;
  checksumValid?: boolean;
  scriptType: "P2WSH";
  functionName: "sortedmulti";
  threshold: number;
  total: number;
  keys: ParsedDescriptorKey[];
  network: "mainnet" | "testnet" | "mixed" | "unknown";
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
    if (char === "," && squareDepth === 0) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(value.slice(start));
  return parts;
}

function keyNetwork(xpub: string): "mainnet" | "testnet" | "unknown" {
  if (/^(xpub|ypub|zpub)/.test(xpub)) return "mainnet";
  if (/^(tpub|upub|vpub)/.test(xpub)) return "testnet";
  return "unknown";
}

export function parseDescriptor(input: string): ParsedDescriptor {
  const compact = input.replace(/\s+/g, "").trim();
  if (!compact) throw new Error("Вставьте descriptor");
  const hashIndex = compact.lastIndexOf("#");
  const body = hashIndex === -1 ? compact : compact.slice(0, hashIndex);
  const checksum = hashIndex === -1 ? undefined : compact.slice(hashIndex + 1);
  if (checksum !== undefined && !/^[a-z0-9]{8}$/.test(checksum)) throw new Error("Checksum должен содержать 8 символов");

  const match = body.match(/^wsh\(sortedmulti\((\d+),(.+)\)\)$/);
  if (!match) throw new Error("Пока поддерживается формат wsh(sortedmulti(...))");
  const threshold = Number(match[1]);
  const rawKeys = splitTopLevel(match[2]);
  const keys = rawKeys.map((raw, index) => {
    const keyMatch = raw.match(/^\[([0-9a-fA-F]{8})\/([^\]]+)\]([^/]+)(\/.*)$/);
    if (!keyMatch) throw new Error(`Ключ ${index + 1}: ожидается [FINGERPRINT/path]xpub/branch/*`);
    return { fingerprint: keyMatch[1].toUpperCase(), path: keyMatch[2], xpub: keyMatch[3], branch: keyMatch[4] };
  });
  if (threshold < 1 || threshold > keys.length) throw new Error("Порог подписей должен быть от 1 до количества ключей");

  const calculatedChecksum = descriptorChecksum(body);
  const networks = new Set(keys.map((key) => keyNetwork(key.xpub)).filter((network) => network !== "unknown"));
  const network = networks.size > 1 ? "mixed" : networks.size === 1 ? [...networks][0] : "unknown";
  const warnings: string[] = [];
  const duplicateKeys = new Set(keys.map((key) => key.xpub)).size !== keys.length;
  const duplicateFingerprints = new Set(keys.map((key) => key.fingerprint)).size !== keys.length;
  if (!checksum) warnings.push("Checksum отсутствует");
  if (checksum && checksum !== calculatedChecksum) warnings.push("Checksum не совпадает");
  if (duplicateKeys) warnings.push("Обнаружены одинаковые extended public keys");
  if (duplicateFingerprints) warnings.push("Обнаружены совпадающие fingerprints");
  if (network === "mixed") warnings.push("В descriptor смешаны mainnet и testnet ключи");
  if (threshold === 1 && keys.length > 1) warnings.push("Схема 1-of-N почти не даёт преимуществ multisig");
  if (threshold === keys.length) warnings.push("Для расходования нужны все ключи");

  let score = 100;
  if (!checksum) score -= 10;
  if (checksum && checksum !== calculatedChecksum) score -= 35;
  if (duplicateKeys) score -= 50;
  if (duplicateFingerprints) score -= 10;
  if (network === "mixed") score -= 40;
  if (threshold === 1 && keys.length > 1) score -= 15;

  return {
    compact: `${body}#${calculatedChecksum}`,
    body,
    checksum,
    calculatedChecksum,
    checksumValid: checksum === undefined ? undefined : checksum === calculatedChecksum,
    scriptType: "P2WSH",
    functionName: "sortedmulti",
    threshold,
    total: keys.length,
    keys,
    network,
    warnings,
    score: Math.max(0, score),
  };
}

export function formatDescriptor(parsed: ParsedDescriptor): string {
  const keyLines = parsed.keys.map((key) => `    [${key.fingerprint}/${key.path}]${key.xpub}${key.branch}`).join(",\n");
  return `wsh(\n  sortedmulti(\n    ${parsed.threshold},\n${keyLines}\n  )\n)#${parsed.calculatedChecksum}`;
}
