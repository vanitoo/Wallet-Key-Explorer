"use client";

import { useEffect, useMemo, useState } from "react";
import { validateExtendedPublicKey } from "../lib/extended-key";

type Network = "mainnet" | "testnet";
type Signer = { name: string; fingerprint: string; derivation: string; xpub: string };
type KeyStatus = { pending: boolean; error: string; prefix?: string; network?: Network; depth?: number };

function defaultDerivation(network: Network): string {
  return network === "mainnet" ? "48'/0'/0'/2'" : "48'/1'/0'/2'";
}

function emptySigner(index: number, network: Network): Signer {
  return { name: `Signer ${String.fromCharCode(65 + index)}`, fingerprint: "", derivation: defaultDerivation(network), xpub: "" };
}

function normalizeFingerprint(value: string): string {
  return value.replace(/[^0-9a-f]/gi, "").slice(0, 8).toUpperCase();
}

function normalizePath(value: string): string {
  return value.trim().replace(/^m\//i, "").replace(/h/gi, "'");
}

function validatePath(value: string): string {
  const path = normalizePath(value);
  if (!path) return "Укажите путь деривации";
  if (path.includes("*")) return "Wildcard внутри origin path запрещён";
  if (!/^\d+'?(\/\d+'?)*$/.test(path)) return "Путь должен выглядеть как 48'/0'/0'/2'";
  for (const part of path.split("/")) {
    const index = Number(part.replace("'", ""));
    if (!Number.isSafeInteger(index) || index < 0 || index >= 0x80000000) return "Индекс пути должен быть от 0 до 2147483647";
  }
  return "";
}

export function MultisigBuilder() {
  const [network, setNetwork] = useState<Network>("mainnet");
  const [total, setTotal] = useState(3);
  const [threshold, setThreshold] = useState(2);
  const [signers, setSigners] = useState<Signer[]>(() => Array.from({ length: 3 }, (_, index) => emptySigner(index, "mainnet")));
  const [keyStatuses, setKeyStatuses] = useState<KeyStatus[]>(() => Array.from({ length: 3 }, () => ({ pending: false, error: "Укажите extended public key" })));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setKeyStatuses(signers.map((signer) => ({ pending: Boolean(signer.xpub.trim()), error: signer.xpub.trim() ? "" : "Укажите extended public key" })));
    void Promise.all(signers.map(async (signer): Promise<KeyStatus> => {
      if (!signer.xpub.trim()) return { pending: false, error: "Укажите extended public key" };
      const result = await validateExtendedPublicKey(signer.xpub);
      if (!result.valid) return { pending: false, error: result.error ?? "Некорректный extended public key" };
      if (result.network !== network) return { pending: false, error: `Ключ ${result.prefix} относится к ${result.network}, а выбрана сеть ${network}` };
      return { pending: false, error: "", prefix: result.prefix, network: result.network, depth: result.depth };
    })).then((results) => { if (!cancelled) setKeyStatuses(results); });
    return () => { cancelled = true; };
  }, [signers, network]);

  function changeNetwork(nextNetwork: Network): void {
    const previousDefault = defaultDerivation(network);
    const nextDefault = defaultDerivation(nextNetwork);
    setNetwork(nextNetwork);
    setSigners((current) => current.map((signer) => ({ ...signer, derivation: normalizePath(signer.derivation) === normalizePath(previousDefault) ? nextDefault : signer.derivation })));
    setCopied(false);
  }

  function changeTotal(nextTotal: number): void {
    setTotal(nextTotal);
    setThreshold((current) => Math.min(current, nextTotal));
    setSigners((current) => Array.from({ length: nextTotal }, (_, index) => current[index] ?? emptySigner(index, network)));
    setCopied(false);
  }

  function updateSigner(index: number, patch: Partial<Signer>): void {
    setSigners((current) => current.map((signer, signerIndex) => signerIndex === index ? { ...signer, ...patch } : signer));
    setCopied(false);
  }

  const signerErrors = useMemo(() => signers.map((signer, index) => {
    if (!/^[0-9A-F]{8}$/.test(normalizeFingerprint(signer.fingerprint))) return "Fingerprint должен содержать 8 hex-символов";
    const pathError = validatePath(signer.derivation);
    if (pathError) return pathError;
    if (keyStatuses[index]?.pending) return "Проверяем Base58Check и структуру ключа…";
    return keyStatuses[index]?.error ?? "";
  }), [signers, keyStatuses]);

  const duplicateXpubs = useMemo(() => {
    const values = signers.map((signer) => signer.xpub.trim()).filter(Boolean);
    return new Set(values).size !== values.length;
  }, [signers]);

  const duplicateFingerprints = useMemo(() => {
    const values = signers.map((signer) => normalizeFingerprint(signer.fingerprint)).filter((value) => value.length === 8);
    return new Set(values).size !== values.length;
  }, [signers]);

  const descriptor = useMemo(() => {
    if (signerErrors.some(Boolean) || duplicateXpubs) return "";
    const keys = signers.map((signer) => `[${normalizeFingerprint(signer.fingerprint)}/${normalizePath(signer.derivation)}]${signer.xpub.trim()}/0/*`);
    return `wsh(sortedmulti(${threshold},${keys.join(",")}))`;
  }, [duplicateXpubs, signerErrors, signers, threshold]);

  async function copyDescriptor(): Promise<void> {
    if (!descriptor) return;
    await navigator.clipboard.writeText(descriptor);
    setCopied(true);
  }

  return (
    <section className="workspace multisig-workspace">
      <div className="panel input-panel">
        <div className="section-title"><span>01</span><div><h2>Политика кошелька</h2><p>Bitcoin P2WSH multisig с descriptor формата sortedmulti</p></div></div>
        <div className="multisig-policy-grid">
          <label>Сеть<select value={network} onChange={(event) => changeNetwork(event.target.value as Network)}><option value="mainnet">Bitcoin Mainnet</option><option value="testnet">Bitcoin Testnet</option></select></label>
          <label>Всего подписантов<select value={total} onChange={(event) => changeTotal(Number(event.target.value))}>{[2, 3, 4, 5].map((count) => <option key={count} value={count}>{count}</option>)}</select></label>
          <label>Нужно подписей<select value={threshold} onChange={(event) => setThreshold(Number(event.target.value))}>{Array.from({ length: total }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} из {total}</option>)}</select></label>
        </div>

        <div className="section-title settings-title"><span>02</span><div><h2>Публичные ключи подписантов</h2><p>Seed-фразы и приватные ключи сюда вводить нельзя</p></div></div>
        {duplicateXpubs && <div className="status error">У двух или более подписантов одинаковый extended public key. Descriptor заблокирован.</div>}
        {duplicateFingerprints && <div className="status">У подписантов совпадают fingerprint. Это предупреждение, а не доказательство дубликата ключа.</div>}

        <div className="signer-list">
          {signers.map((signer, index) => (
            <article className="signer-card" key={index}>
              <div className="signer-heading"><strong>{signer.name || `Signer ${index + 1}`}</strong><span>{index + 1} / {total}</span></div>
              <label>Название<input value={signer.name} onChange={(event) => updateSigner(index, { name: event.target.value })} /></label>
              <div className="signer-meta-grid">
                <label>Master fingerprint<input value={signer.fingerprint} onChange={(event) => updateSigner(index, { fingerprint: normalizeFingerprint(event.target.value) })} placeholder="A1B2C3D4" /></label>
                <label>Путь деривации<input value={signer.derivation} onChange={(event) => updateSigner(index, { derivation: event.target.value })} placeholder={defaultDerivation(network)} /></label>
              </div>
              <label>Extended public key<textarea value={signer.xpub} onChange={(event) => updateSigner(index, { xpub: event.target.value.trim() })} placeholder={network === "mainnet" ? "xpub... / zpub..." : "tpub... / vpub..."} spellCheck={false} /></label>
              {!signerErrors[index] && keyStatuses[index]?.prefix && <small>{keyStatuses[index].prefix} · depth {keyStatuses[index].depth} · checksum корректен</small>}
              {signerErrors[index] && <small className="field-error">{signerErrors[index]}</small>}
            </article>
          ))}
        </div>

        <div className="section-title settings-title"><span>03</span><div><h2>Wallet descriptor</h2><p>Сохраните его вместе с fingerprints, путями и xpub всех участников</p></div></div>
        <div className="descriptor-output"><pre>{descriptor || "Заполните корректные публичные данные всех подписантов"}</pre><div className="generation-actions"><button disabled={!descriptor} onClick={copyDescriptor}>{copied ? "Скопировано" : "Копировать descriptor"}</button></div></div>
      </div>

      <aside className="panel algorithm-panel">
        <div className="algorithm-symbol">⌘</div><h3>{threshold} из {total}</h3>
        <ul className="check-list"><li>Base58Check checksum проверяется</li><li>Сеть определяется из version bytes</li><li>Приватные extended keys блокируются</li><li>Origin path нормализуется</li></ul>
        <div className="algorithm-metrics"><div><span>Порог</span><strong>{threshold}</strong></div><div><span>Ключей</span><strong>{total}</strong></div></div>
        <div className="multisig-warning"><strong>Важно</strong><p>Fingerprint нельзя криптографически связать с account xpub без master public key. Корректный формат не доказывает происхождение ключа.</p></div>
        <div className="flow-diagram"><span>{total} независимых ключа</span><b>↓</b><span>{threshold} подписей</span><b>↓</b><span>P2WSH multisig</span></div>
      </aside>
    </section>
  );
}
