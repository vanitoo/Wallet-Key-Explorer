import assert from "node:assert/strict";
import test from "node:test";
import { descriptorChecksum, formatDescriptor, parseDescriptor } from "../src/modules/descriptor/lib/descriptor";

const XPUB_A = "xpub6EB6pKQpw8rkV9vSyJuYzV6vakw6hpMNM8QAnAkcKdmgZaw6anqKTEMdUyCxLDqd6s7wVcAw6z8pbHfjWuwFpSauwPpHtTik1edkbujfpcJ";
const XPUB_B = "xpub6F13r8guZsX5ghqgUQrqDwFi8FgMPsqxnnBouVSUdLfSUhsPHjj2fMN4bQ3GeyEqPH58WwgCNVRxMmYbMVHztjtoDVtiy9rLY94itdDowQj";

function descriptor(branchA = "/0/*", branchB = "/0/*"): string {
  return `wsh(sortedmulti(2,[A1B2C3D4/48'/0'/0'/2']${XPUB_A}${branchA},[B2C3D4E5/48'/0'/0'/2']${XPUB_B}${branchB}))`;
}

test("descriptorChecksum is deterministic", () => {
  const body = descriptor();
  assert.equal(descriptorChecksum(body), descriptorChecksum(body));
  assert.match(descriptorChecksum(body), /^[a-z0-9]{8}$/);
});

test("parseDescriptor identifies a healthy receive policy", () => {
  const body = descriptor();
  const parsed = parseDescriptor(`${body}#${descriptorChecksum(body)}`);

  assert.equal(parsed.checksumStatus, "valid");
  assert.equal(parsed.network, "mainnet");
  assert.equal(parsed.branch, "receive");
  assert.equal(parsed.threshold, 2);
  assert.equal(parsed.total, 2);
  assert.equal(parsed.keys[0].origin, "[A1B2C3D4/48'/0'/0'/2']");
  assert.equal(parsed.keys[0].wildcard, true);
});

test("parseDescriptor normalizes a missing checksum", () => {
  const parsed = parseDescriptor(descriptor());
  assert.equal(parsed.checksumStatus, "missing");
  assert.equal(parsed.compact, `${parsed.body}#${parsed.calculatedChecksum}`);
  assert.match(formatDescriptor(parsed), new RegExp(`#${parsed.calculatedChecksum}$`));
});

test("parseDescriptor reports mixed receive and change branches", () => {
  const parsed = parseDescriptor(descriptor("/0/*", "/1/*"));
  assert.equal(parsed.branch, "mixed");
  assert.ok(parsed.warnings.some((warning) => /смешаны receive и change/i.test(warning)));
});

test("parseDescriptor rejects private extended keys", () => {
  const privateKey = XPUB_A.replace(/^xpub/, "xprv");
  const body = `wsh(sortedmulti(1,[A1B2C3D4/48'/0'/0'/2']${privateKey}/0/*,[B2C3D4E5/48'/0'/0'/2']${XPUB_B}/0/*))`;
  assert.throws(() => parseDescriptor(body), /private extended keys/i);
});

test("parseDescriptor rejects branches without wildcard", () => {
  assert.throws(() => parseDescriptor(descriptor("/0/1", "/0/*")), /wildcard/i);
});
