"use client";

import { useState } from "react";
import { inspectAddress, type AddressInspection } from "../lib/address";

const DEMOS = [
  { label: "P2PKH", value: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT" },
  { label: "P2SH", value: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy" },
  { label: "P2WPKH", value: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4" },
];

export function AddressInspector() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<AddressInspection | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function analyze(nextValue = value): Promise<void> {
    setCopied(false);
    try {
      const inspection = await inspectAddress(nextValue);
      setResult(inspection);
      setError("");
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "Не удалось разобрать адрес");
    }
  }

  function loadDemo(address: string): void {
    setValue(address);
    void analyze(address);
  }

  async function copyScript(): Promise<void> {
    if (!result) return;
    await navigator.clipboard.writeText(result.scriptPubKey);
    setCopied(true);
  }

  return (
    <section className="workspace multisig-workspace">
      <div className="panel input-panel">
        <div className="section-title"><span>01</span><div><h2>Address import</h2><p>Введите публичный Bitcoin-адрес для локального анализа</p></div></div>
        <label>Bitcoin address<input value={value} onChange={(event) => { setValue(event.target.value); setResult(null); setError(""); }} placeholder="1... / 3... / bc1... / tb1... / bcrt1..." spellCheck={false} /></label>
        <div className="generation-actions">
          <button type="button" onClick={() => void analyze()}>Проверить адрес</button>
          {DEMOS.map((demo) => <button type="button" key={demo.label} onClick={() => loadDemo(demo.value)}>Demo {demo.label}</button>)}
        </div>
        {error && <div className="status error">{error}</div>}

        {result && <>
          <div className="section-title settings-title"><span>02</span><div><h2>Результат</h2><p>Сеть, формат, тип и полезная нагрузка</p></div></div>
          <div className="algorithm-metrics">
            <div><span>Type</span><strong>{result.type}</strong></div>
            <div><span>Network</span><strong>{result.network}</strong></div>
            <div><span>Encoding</span><strong>{result.encoding}</strong></div>
            <div><span>Witness</span><strong>{result.witnessVersion === undefined ? "—" : `v${result.witnessVersion}`}</strong></div>
          </div>

          {result.warnings.length > 0 && <div className="status"><strong>Предупреждения</strong><ul>{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}

          <div className="descriptor-output"><strong>Payload / witness program</strong><pre>{result.payloadHex}</pre></div>
          {result.witnessProgramLength !== undefined && <div className="status"><strong>Witness program</strong><p>{result.witnessProgramLength} байт</p></div>}

          <div className="section-title settings-title"><span>03</span><div><h2>scriptPubKey</h2><p>Стандартный locking script, соответствующий введённому адресу</p></div></div>
          <div className="descriptor-output"><pre>{result.scriptPubKey}</pre><div className="generation-actions"><button type="button" onClick={() => void copyScript()}>{copied ? "Скопировано" : "Копировать scriptPubKey"}</button></div></div>
        </>}
      </div>

      <aside className="panel algorithm-panel">
        <div className="algorithm-symbol">₿</div><h3>Address Engine</h3>
        <ul className="check-list"><li>Base58Check, Bech32 и Bech32m</li><li>Mainnet, Testnet и Regtest</li><li>P2PKH, P2SH, P2WPKH, P2WSH и P2TR</li><li>Checksum, witness version и program</li><li>Построение scriptPubKey</li></ul>
        <div className="multisig-warning"><strong>Граница инструмента</strong><p>Inspector не проверяет баланс, историю транзакций или принадлежность адреса. Сеть не используется.</p></div>
      </aside>
    </section>
  );
}
