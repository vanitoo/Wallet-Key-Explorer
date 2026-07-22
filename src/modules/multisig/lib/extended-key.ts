const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const VERSION_INFO: Record<number, { prefix: string; network: "mainnet" | "testnet"; kind: "public" | "private" }> = {
  0x0488b21e: { prefix: "xpub", network: "mainnet", kind: "public" },
  0x049d7cb2: { prefix: "ypub", network: "mainnet", kind: "public" },
  0x04b24746: { prefix: "zpub", network: "mainnet", kind: "public" },
  0x043587cf: { prefix: "tpub", network: "testnet", kind: "public" },
  0x044a5262: { prefix: "upub", network: "testnet", kind: "public" },
  0x045f1cf6: { prefix: "vpub", network: "testnet", kind: "public" },
  0x0488ade4: { prefix: "xprv", network: "mainnet", kind: "private" },
  0x049d7878: { prefix: "yprv", network: "mainnet", kind: "private" },
  0x04b2430c: { prefix: "zprv", network: "mainnet", kind: "private" },
  0x04358394: { prefix: "tprv", network: "testnet", kind: "private" },
  0x044a4e28: { prefix: "uprv", network: "testnet", kind: "private" },
  0x045f18bc: { prefix: "vprv", network: "testnet", kind: "private" },
};

type ValidationResult = {
  valid: boolean;
  error?: string;
  prefix?: string;
  network?: "mainnet" | "testnet";
  depth?: number;
  childNumber?: number;
  parentFingerprint?: string;
};

function decodeBase58(value: string): Uint8Array {
  if (!value) throw new Error("Extended key is empty");
  let numeric = 0n;
  for (const character of value) {
    const index = BASE58_ALPHABET.indexOf(character);
    if (index < 0) throw new Error(`Invalid Base58 character: ${character}`);
    numeric = numeric * 58n + BigInt(index);
  }

  const bytes: number[] = [];
  while (numeric > 0n) {
    bytes.push(Number(numeric & 0xffn));
    numeric >>= 8n;
  }
  bytes.reverse();

  let leadingZeroes = 0;
  while (leadingZeroes < value.length && value[leadingZeroes] === "1") leadingZeroes += 1;
  return Uint8Array.from([...new Array(leadingZeroes).fill(0), ...bytes]);
}

async function sha256(data: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

function readUint32(bytes: Uint8Array, offset: number): number {
  return (((bytes[offset] << 24) >>> 0) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3]) >>> 0;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export async function validateExtendedPublicKey(value: string): Promise<ValidationResult> {
  try {
    const decoded = decodeBase58(value.trim());
    if (decoded.length !== 82) return { valid: false, error: `Неверная длина: ${decoded.length} байт вместо 82` };

    const payload = decoded.slice(0, 78);
    const checksum = decoded.slice(78);
    const firstHash = await sha256(payload);
    const secondHash = await sha256(firstHash);
    if (!checksum.every((byte, index) => byte === secondHash[index])) {
      return { valid: false, error: "Не совпадает Base58Check checksum" };
    }

    const version = readUint32(payload, 0);
    const info = VERSION_INFO[version];
    if (!info) return { valid: false, error: `Неизвестные version bytes: 0x${version.toString(16).padStart(8, "0")}` };
    if (info.kind === "private") return { valid: false, error: `Приватный extended key ${info.prefix} вводить нельзя` };

    const depth = payload[4];
    const parentFingerprint = payload.slice(5, 9);
    const childNumber = readUint32(payload, 9);
    const chainCode = payload.slice(13, 45);
    const publicKey = payload.slice(45, 78);

    if (depth === 0 && (childNumber !== 0 || parentFingerprint.some((byte) => byte !== 0))) {
      return { valid: false, error: "Master key с depth 0 должен иметь нулевые parent fingerprint и child number" };
    }
    if (chainCode.every((byte) => byte === 0)) return { valid: false, error: "Chain code не может состоять из нулей" };
    if (publicKey.length !== 33 || (publicKey[0] !== 0x02 && publicKey[0] !== 0x03)) {
      return { valid: false, error: "Extended public key должен содержать сжатый secp256k1 public key" };
    }

    return {
      valid: true,
      prefix: info.prefix,
      network: info.network,
      depth,
      childNumber,
      parentFingerprint: toHex(parentFingerprint),
    };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : "Не удалось разобрать extended key" };
  }
}
