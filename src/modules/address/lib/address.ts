const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BECH32_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const BECH32_CONST = 1;
const BECH32M_CONST = 0x2bc830a3;

export type AddressNetwork = "mainnet" | "testnet" | "regtest";
export type AddressType = "P2PKH" | "P2SH" | "P2WPKH" | "P2WSH" | "P2TR" | "WITNESS_UNKNOWN";
export type AddressEncoding = "Base58Check" | "Bech32" | "Bech32m";

export type AddressInspection = {
  address: string;
  network: AddressNetwork;
  type: AddressType;
  encoding: AddressEncoding;
  payloadHex: string;
  scriptPubKey: string;
  witnessVersion?: number;
  witnessProgramLength?: number;
  warnings: string[];
};

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function decodeBase58(value: string): Uint8Array {
  let numeric = 0n;
  for (const character of value) {
    const index = BASE58_ALPHABET.indexOf(character);
    if (index < 0) throw new Error(`Недопустимый Base58-символ: ${character}`);
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
  return new Uint8Array(await crypto.subtle.digest("SHA-256", Uint8Array.from(data).buffer));
}

async function inspectBase58(address: string): Promise<AddressInspection> {
  const decoded = decodeBase58(address);
  if (decoded.length !== 25) throw new Error(`Неверная длина Base58Check: ${decoded.length} байт вместо 25`);
  const payload = decoded.slice(0, 21);
  const checksum = decoded.slice(21);
  const expected = await sha256(await sha256(payload));
  if (!checksum.every((byte, index) => byte === expected[index])) throw new Error("Не совпадает Base58Check checksum");

  const version = payload[0];
  const hash = payload.slice(1);
  let network: AddressNetwork;
  let type: AddressType;
  if (version === 0x00) { network = "mainnet"; type = "P2PKH"; }
  else if (version === 0x05) { network = "mainnet"; type = "P2SH"; }
  else if (version === 0x6f) { network = "testnet"; type = "P2PKH"; }
  else if (version === 0xc4) { network = "testnet"; type = "P2SH"; }
  else throw new Error(`Неизвестный version byte: 0x${version.toString(16).padStart(2, "0")}`);

  const hashHex = toHex(hash);
  return {
    address,
    network,
    type,
    encoding: "Base58Check",
    payloadHex: hashHex,
    scriptPubKey: type === "P2PKH" ? `76A914${hashHex}88AC` : `A914${hashHex}87`,
    warnings: network === "testnet" ? ["Testnet и regtest используют одинаковые Base58 version bytes"] : [],
  };
}

function bech32Polymod(values: number[]): number {
  const generators = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let checksum = 1;
  for (const value of values) {
    const top = checksum >>> 25;
    checksum = ((checksum & 0x1ffffff) << 5) ^ value;
    for (let index = 0; index < 5; index += 1) if ((top >>> index) & 1) checksum ^= generators[index];
  }
  return checksum >>> 0;
}

function expandHrp(hrp: string): number[] {
  return [...hrp].map((char) => char.charCodeAt(0) >>> 5).concat([0], [...hrp].map((char) => char.charCodeAt(0) & 31));
}

function convertBits(data: number[], fromBits: number, toBits: number, pad: boolean): number[] {
  let accumulator = 0;
  let bits = 0;
  const result: number[] = [];
  const maxValue = (1 << toBits) - 1;
  for (const value of data) {
    if (value < 0 || value >>> fromBits !== 0) throw new Error("Некорректные данные Bech32");
    accumulator = (accumulator << fromBits) | value;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      result.push((accumulator >>> bits) & maxValue);
    }
  }
  if (pad) {
    if (bits > 0) result.push((accumulator << (toBits - bits)) & maxValue);
  } else if (bits >= fromBits || ((accumulator << (toBits - bits)) & maxValue) !== 0) {
    throw new Error("Некорректное заполнение Bech32");
  }
  return result;
}

function inspectBech32(address: string): AddressInspection {
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) throw new Error("Bech32 не допускает смешанный регистр");
  const normalized = address.toLowerCase();
  const separator = normalized.lastIndexOf("1");
  if (separator < 1 || separator + 7 > normalized.length || normalized.length > 90) throw new Error("Некорректная структура Bech32");
  const hrp = normalized.slice(0, separator);
  const values = [...normalized.slice(separator + 1)].map((char) => {
    const index = BECH32_CHARSET.indexOf(char);
    if (index < 0) throw new Error(`Недопустимый Bech32-символ: ${char}`);
    return index;
  });
  const polymod = bech32Polymod([...expandHrp(hrp), ...values]);
  const encoding: AddressEncoding = polymod === BECH32_CONST ? "Bech32" : polymod === BECH32M_CONST ? "Bech32m" : (() => { throw new Error("Не совпадает Bech32 checksum"); })();
  const network: AddressNetwork = hrp === "bc" ? "mainnet" : hrp === "tb" ? "testnet" : hrp === "bcrt" ? "regtest" : (() => { throw new Error(`Неизвестный human-readable prefix: ${hrp}`); })();
  const data = values.slice(0, -6);
  if (data.length === 0) throw new Error("Отсутствует witness version");
  const witnessVersion = data[0];
  if (witnessVersion > 16) throw new Error("Witness version должен быть от 0 до 16");
  const program = Uint8Array.from(convertBits(data.slice(1), 5, 8, false));
  if (program.length < 2 || program.length > 40) throw new Error("Witness program должен содержать от 2 до 40 байт");
  if (witnessVersion === 0 && encoding !== "Bech32") throw new Error("Witness v0 должен использовать Bech32");
  if (witnessVersion !== 0 && encoding !== "Bech32m") throw new Error("Witness v1+ должен использовать Bech32m");
  if (witnessVersion === 0 && program.length !== 20 && program.length !== 32) throw new Error("Witness v0 program должен содержать 20 или 32 байта");

  const type: AddressType = witnessVersion === 0 && program.length === 20 ? "P2WPKH"
    : witnessVersion === 0 && program.length === 32 ? "P2WSH"
      : witnessVersion === 1 && program.length === 32 ? "P2TR" : "WITNESS_UNKNOWN";
  const versionOpcode = witnessVersion === 0 ? "00" : (0x50 + witnessVersion).toString(16).padStart(2, "0").toUpperCase();
  const programHex = toHex(program);
  return {
    address: normalized,
    network,
    type,
    encoding,
    payloadHex: programHex,
    scriptPubKey: `${versionOpcode}${program.length.toString(16).padStart(2, "0").toUpperCase()}${programHex}`,
    witnessVersion,
    witnessProgramLength: program.length,
    warnings: type === "WITNESS_UNKNOWN" ? ["Неизвестная witness-программа: структура корректна, назначение не определено"] : [],
  };
}

export async function inspectAddress(input: string): Promise<AddressInspection> {
  const address = input.trim();
  if (!address) throw new Error("Введите Bitcoin-адрес");
  if (address.length > 120) throw new Error("Адрес слишком длинный");
  if (/^(bc1|tb1|bcrt1)/i.test(address)) return inspectBech32(address);
  return inspectBase58(address);
}
