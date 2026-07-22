"use client";

import { useMemo, useState } from "react";
import { formatDescriptor, parseDescriptor } from "../lib/descriptor";

export function DescriptorExplorer() {
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState<"compact" | "formatted" | "">("");

  const result = useMemo(() => {
    try {
      return { parsed: value.trim() ? parseDescriptor(value) : null, error: "" };
    } catch (error) {
      return { parsed: null, error: error instanceof Error ? error.message : "Не удалось разобрать descriptor" };
    }
  }, [value]);

  const formatted = result.parsed ? formatDescriptor(result.parsed) : "";

  async function copy(text: string, kind: "compact" | "formatted"): Promise<void> {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
  }

  return (
    <section className="workspace multisig-workspace">
      <div className="panel input-panel">
        <div className="section-title"><span>01</span><div><h2>Descriptor import</h2><p>Вставьте публичный Bitcoin descriptor для локальной проверки</p></div></div>
        <label>Wallet descriptor<textarea value={value} onChange={(event) => { setValue(event.target.value); setCopied(""); }} placeholder="wsh(sortedmulti(2,[F23AABCD/48'/0'/0'/2']xpub.../0/*,...))#checksum" spellCheck={false} rows={8} /></label>
        {result.error && <div className="status error">{result.error}</div>}

        {result.parsed && (
          <>
            <div className="section-title settings-title"><span>02</span><div><h2>Разбор descriptor</h2><p>Структура, сеть, порог, ключи и совместимость</p></div></div>
            <div className="algorithm-metrics">
              <div><span>Script</span><strong>{result.parsed.scriptType}</strong></div>
              <div><span>Policy</span><strong>{result.parsed.threshold} из {result.parsed.total}</strong></div>
              <div><span>Network</span><strong>{result.parsed.network}</strong></div>
              <div><span>Health</span><strong>{result.parsed.score}/100</strong></div>
            </div>

            <div className={result.parsed.checksumValid === false ? "status error" : "status"}>
              <strong>Checksum: {result.parsed.checksumValid === undefined ? "отсутствует" : result.parsed.checksumValid ? "корректен" : "ошибка"}</strong>
              <p>Рассчитанный checksum: <code>{result.parsed.calculatedChecksum}</code></p>
            </div>

            {result.parsed.warnings.length > 0
              ? <div className="status"><strong>Health Check</strong><ul>{result.parsed.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>
              : <div className="status"><strong>Health Check пройден.</strong><p>Явных проблем совместимости не обнаружено.</p></div>}

            <div className="signer-list">
              {result.parsed.keys.map((key, index) => (
                <article className="signer-card" key={`${key.fingerprint}-${index}`}>
                  <div className="signer-heading"><strong>Signer {index + 1}</strong><span>{key.fingerprint}</span></div>
                  <small>Key type: {key.prefix || "unknown"} · {key.compatibility === "recommended" ? "рекомендован для P2WSH" : key.compatibility === "warning" ? "требует проверки совместимости" : "неизвестный тип"}</small>
                  <small>Origin path: {key.path}</small>
                  <small>Branch: {key.branch}</small>
                  <pre>{key.xpub}</pre>
                </article>
              ))}
            </div>

            <div className="section-title settings-title"><span>03</span><div><h2>Normalized output</h2><p>Checksum добавляется или исправляется автоматически</p></div></div>
            <div className="descriptor-output"><pre>{result.parsed.compact}</pre><div className="generation-actions"><button onClick={() => copy(result.parsed!.compact, "compact")}>{copied === "compact" ? "Скопировано" : "Copy compact"}</button></div></div>
            <div className="descriptor-output"><pre>{formatted}</pre><div className="generation-actions"><button onClick={() => copy(formatted, "formatted")}>{copied === "formatted" ? "Скопировано" : "Copy formatted"}</button></div></div>
          </>
        )}
      </div>

      <aside className="panel algorithm-panel">
        <div className="algorithm-symbol">#</div><h3>Descriptor Engine</h3>
        <ul className="check-list"><li>Работает полностью локально</li><li>Проверяет Bitcoin Core checksum</li><li>Проверяет BIP-48 P2WSH paths</li><li>Находит смешанные сети, branches и SLIP-132 риски</li></ul>
        <div className="multisig-warning"><strong>Важно</strong><p>Предупреждение о совместимости не всегда означает невалидный кошелёк. Сверяйте descriptor с координатором, который его экспортировал.</p></div>
      </aside>
    </section>
  );
}
