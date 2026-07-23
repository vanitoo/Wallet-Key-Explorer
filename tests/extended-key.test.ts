import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { inspectExtendedKey, validateExtendedPublicKey } from "../src/modules/common/lib/extended-key";

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const DEMO_XPUB = "xpub6EB6pKQpw8rkV9vSyJuYzV6vakw6hpMNM8QAnAkcKdmgZaw6anqKTEMdUyCxLDqd6s7wVcAw6z8pbHfjWuwFpSauwPpHtTik1edkbujfpcJ";

function decodeBase58(value: string): Buffer {
  let numeric = 0n;
  for (const character of value) {
    const index = BASE58_ALPHABET.indexOf(character);
    assert.notEqual(index, -1, `Unexpected Base58 character: ${character}`);
    numeric = numeric * 58n + BigInt(index);
  }

  const bytes: number[] = [];
  while (numeric > 0n) {
    bytes.push(Number(numeric & 0xffn));
    numeric >>= 8n;
  }
  bytes.reverse();

  const leadingZeroes = value.length - value.replace(/^1+/, "").length;
  return Buffer.from([...new Array(leadingZeroes).fill(0), ...bytes]);
}

function encodeBase58(bytes: Uint8Array): string {
  let numeric = 0n;
  for (const byte of bytes) numeric = numeric * 256n + BigInt(byte);

  let encoded = "";
  while (numeric > 0n) {
    const remainder = Number(numeric % 58n);
    numeric /= 58n;
    encoded = BASE58_ALPHABET[remainder] + encoded;
  }

  let leadingZeroes = 0;
  while (leadingZeroes < bytes.length && bytes[leadingZeroes] === 0) leadingZeroes += 1;
  return "1".repeat(leadingZeroes) + encoded;
}

function withVersion(version: number): string {
  const decoded = decodeBase58(DEMO_XPUB);
  const payload = Buffer.from(decoded.subarray(0, 78));
  payload.writeUInt32BE(version, 0);
  const firstHash = createHash("sha256").update(payload).digest();
  const checksum = createHash("sha256").update(firstHash).digest().subarray(0, 4);
  return encodeBase58(Buffer.concat([payload, checksum]));
}

test("inspectExtendedKey decodes a valid mainnet xpub", async () => {
  const result = await inspectExtendedKey(DEMO_XPUB);

  assert.equal(result.valid, true);
  assert.equal(result.kind, "public");
  assert.equal(result.prefix, "xpub");
  assert.equal(result.network, "mainnet");
  assert.equal(result.versionHex, "0x0488B21E");
  assert.equal(result.depth, 4);
  assert.equal(result.parentFingerprint, "5740AFD5");
  assert.equal(result.childNumber, 0x80000002);
  assert.equal(result.hardened, true);
  assert.equal(result.chainCode, "5148B3010394D5143F97D6EA9CE52CF193C77B24C19AAA47E74196DF8DCF37BC");
  assert.equal(result.keyData, "039D1ABAEC9F5715A15C7628244170951E0F85E87F68CA5393D3F9FC3FA23A69C8");
});

test("validateExtendedPublicKey returns a valid public inspection", async () => {
  const result = await validateExtendedPublicKey(DEMO_XPUB);

  assert.equal(result.valid, true);
  assert.equal(result.kind, "public");
  assert.equal(result.prefix, "xpub");
  assert.equal(result.network, "mainnet");
  assert.equal(result.depth, 4);
  assert.equal(result.childNumber, 0x80000002);
  assert.equal(result.parentFingerprint, "5740AFD5");
});

test("codec rejects a damaged Base58Check checksum", async () => {
  const lastCharacter = DEMO_XPUB.at(-1);
  const damaged = `${DEMO_XPUB.slice(0, -1)}${lastCharacter === "1" ? "2" : "1"}`;
  const result = await inspectExtendedKey(damaged);

  assert.equal(result.valid, false);
  assert.match(result.error ?? "", /checksum/i);
});

test("codec rejects unknown version bytes", async () => {
  const result = await inspectExtendedKey(withVersion(0x01020304));

  assert.equal(result.valid, false);
  assert.match(result.error ?? "", /version bytes/i);
});

test("codec recognizes and rejects private extended keys", async () => {
  const privateExtendedKey = withVersion(0x0488ade4);
  const result = await inspectExtendedKey(privateExtendedKey);

  assert.equal(result.valid, false);
  assert.equal(result.kind, "private");
  assert.equal(result.prefix, "xprv");
  assert.match(result.error ?? "", /приватный extended key/i);
});

test("codec rejects malformed Base58 input", async () => {
  const result = await inspectExtendedKey("xpub0OIl");

  assert.equal(result.valid, false);
  assert.match(result.error ?? "", /Base58/i);
});
