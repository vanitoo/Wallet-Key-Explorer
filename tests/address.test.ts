import assert from "node:assert/strict";
import test from "node:test";
import { inspectAddress } from "../src/modules/address/lib/address";

test("inspects a mainnet P2PKH address", async () => {
  const result = await inspectAddress("1BoatSLRHtKNngkdXEeobR76b53LETtpyT");
  assert.equal(result.network, "mainnet");
  assert.equal(result.type, "P2PKH");
  assert.equal(result.encoding, "Base58Check");
  assert.match(result.scriptPubKey, /^76A914[0-9A-F]{40}88AC$/);
});

test("inspects a mainnet P2SH address", async () => {
  const result = await inspectAddress("3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy");
  assert.equal(result.type, "P2SH");
  assert.match(result.scriptPubKey, /^A914[0-9A-F]{40}87$/);
});

test("inspects a Bech32 P2WPKH address", async () => {
  const result = await inspectAddress("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
  assert.equal(result.network, "mainnet");
  assert.equal(result.type, "P2WPKH");
  assert.equal(result.encoding, "Bech32");
  assert.equal(result.witnessVersion, 0);
  assert.equal(result.witnessProgramLength, 20);
  assert.match(result.scriptPubKey, /^0014[0-9A-F]{40}$/);
});

test("rejects a damaged checksum", async () => {
  await assert.rejects(() => inspectAddress("1BoatSLRHtKNngkdXEeobR76b53LETtpyU"), /checksum/i);
});

test("rejects mixed-case Bech32", async () => {
  await assert.rejects(() => inspectAddress("bc1Qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4"), /смешанный регистр/i);
});
