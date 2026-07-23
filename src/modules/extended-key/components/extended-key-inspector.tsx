"use client";

import { useMemo, useState } from "react";
import { inspectExtendedKey, type ExtendedKeyInspection } from "../../common/lib/extended-key";

const DEMO_XPUB = "xpub6EB6pKQpw8rkV9vSyJuYzV6vakw6hpMNM8QAnAkcKdmgZaw6anqKTEMdUyCxLDqd6s7wVcAw6z8pbHfjWuwFpSauwPpHtTik1edkbujfpcJ";

function formatJson(result: ExtendedKeyInspection): string {
  return JSON.stringify(result, null, 2);
}

export function ExtendedKeyInspector() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ExtendedKeyInspection | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicResult = result?.valid && result.kind === "public";
  const report = useMemo(() => (result ? formatJson(result) : ""), [result]);

  async function inspect(): Promise<void> {
    setBusy(true);
    setCopied(false);
    setResult(await inspectExtendedKey(value));
    setBusy(false);
  }

  async function copyReport(): Promise<void> {
    if (!report) return;
    await navigator.clipboard.writeText(report);
    setCopied(true);
  }

  function loadDemo(): void {
    setValue(DEMO_XPUB);
    setResult(null);
    setCopied(false);
  }

  return (
    <section className="workspace inspector-workspace">
      <div className="panel input-panel">
        <div className="section-title"><span>01</span><div><h2>Extended Key Inspector</h2><p>Разбор Base58Check, BIP-32 и SLIP-132 полей без деривации дочерних ключей</p></div></div>

        <label className="inspector-input-label">
          Extended key
          <textarea
            value={value}
            onChange={(event) => { setValue(event.target.value.trim()); setResult(null); setCopied(false); }}
            placeholder="xpub... / ypub... / zpub... / tpub... / upub... / vpub..."
            spellCheck={false}
          />
        </label>

        <div className="generation-actions">
          <button type="button" onClick={inspect} disabled={!value || busy}>{busy ? "Проверяем…" : "Разобрать ключ"}</button>
          <button type="button" onClick={loadDemo}>Загрузить Demo xpub</button>
          <button type="button" onClick={() => { setValue(""); setResult(null); setCopied(false); }}>Очистить</button>
        </div>

        <div className="status error">
          <strong>Только публичные данные.</strong>
          <p>Private extended keys распознаются только для немедленного отказа. Не вставляйте xprv, yprv, zprv, tprv, uprv или vprv.</p>
        </div>

        {result && !result.valid && <div className="status error"><strong>Ключ отклонён.</strong><p>{result.error}</p></div>}

        {result?.valid && (
          <>
            {result.kind === "private" && <div className="status error"><strong>Обнаружен private extended key.</strong><p>{result.warning}</p></div>}
            {publicResult && <div className="status"><strong>Публичный extended key корректен.</strong><p>Base58Check checksum, длина payload и compressed public key прошли проверку.</p></div>}

            <div className="section-title settings-title"><span>02</span><div><h2>Декодированные поля</h2><p>Структура 78-байтового BIP-32 payload</p></div></div>
            <div className="inspection-grid">
              <div><span>Prefix</span><strong>{result.prefix}</strong></div>
              <div><span>Network</span><strong>{result.network}</strong></div>
              <div><span>Kind</span><strong>{result.kind}</strong></div>
              <div><span>Version bytes</span><strong>{result.versionHex}</strong></div>
              <div><span>Depth</span><strong>{result.depth}</strong></div>
              <div><span>Child number</span><strong>{result.childNumber}</strong><small>{result.childNumberHex}{result.hardened ? " · hardened" : ""}</small></div>
              <div><span>Parent fingerprint</span><strong>{result.parentFingerprint}</strong></div>
            </div>

            <div className="binary-field"><span>Chain code</span><code>{result.chainCode}</code></div>
            <div className="binary-field"><span>{result.kind === "public" ? "Compressed public key" : "Private key payload"}</span><code>{result.keyData}</code></div>

            <div className="section-title settings-title"><span>03</span><div><h2>Интерпретация</h2><p>Prefix metadata не заменяет output descriptor</p></div></div>
            <div className="status"><strong>{result.slip132Meaning}</strong><p>Для точного определения script policy используйте descriptor. Один extended key не описывает полную политику расходов.</p></div>

            <div className="descriptor-output">
              <strong>JSON report</strong>
              <pre>{report}</pre>
              <div className="generation-actions"><button type="button" onClick={copyReport}>{copied ? "Скопировано" : "Копировать JSON"}</button></div>
            </div>
          </>
        )}
      </div>

      <aside className="panel algorithm-panel">
        <div className="algorithm-symbol">⌘</div>
        <h3>BIP-32 payload</h3>
        <ul className="check-list">
          <li>4 bytes version</li>
          <li>1 byte depth</li>
          <li>4 bytes parent fingerprint</li>
          <li>4 bytes child number</li>
          <li>32 bytes chain code</li>
          <li>33 bytes key data</li>
          <li>4 bytes Base58Check checksum</li>
        </ul>
        <div className="multisig-warning"><strong>Важно</strong><p>xpub и SLIP-132 prefixes являются публичными, но могут раскрывать структуру аккаунта и будущие адреса. Не публикуйте их без необходимости.</p></div>
      </aside>
    </section>
  );
}
