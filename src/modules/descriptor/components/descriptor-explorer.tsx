"use client";

import { useMemo, useState } from "react";
import { formatDescriptor, parseDescriptor } from "../lib/descriptor";

const DEMO_DESCRIPTOR = "wsh(sortedmulti(2,[A1B2C3D4/48'/0'/0'/2']xpub6EB6pKQpw8rkV9vSyJuYzV6vakw6hpMNM8QAnAkcKdmgZaw6anqKTEMdUyCxLDqd6s7wVcAw6z8pbHfjWuwFpSauwPpHtTik1edkbujfpcJ/0/*,[B2C3D4E5/48'/0'/0'/2']xpub6F13r8guZsX5ghqgUQrqDwFi8FgMPsqxnnBouVSUdLfSUhsPHjj2fMN4bQ3GeyEqPH58WwgCNVRxMmYbMVHztjtoDVtiy9rLY94itdDowQj/0/*,[C3D4E5F6/48'/0'/0'/2']xpub6ENRsBZcqTQrNpY2h5LPAEjFxiuUp9noypWrmMhgFXpdBpnbQUMWRGwGuadCbKT85bzYwC731xs76cUuQKDLExtYoRo3mGCNJYF3XKK4zFL/0/*))";

type DescriptorExplorerProps = {
  value: string;
  onValueChange: (value: string) => void;
  importedFromBuilder?: boolean;
};

export function DescriptorExplorer({ value, onValueChange, importedFromBuilder = false }: DescriptorExplorerProps) {
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

  function loadDemo(): void {
    onValueChange(DEMO_DESCRIPTOR);
    setCopied("");
  }

  return (
    <section className="workspace multisig-workspace">
      <div className="panel input-panel">
        <div className="section-title"><span>01</span><div><h2>Descriptor Inspector v2</h2><p>Строгий локальный разбор публичного Bitcoin descriptor</p></div></div>
        <div className="generation-actions"><button type="button" onClick={loadDemo}>Загрузить demo descriptor</button><button type="button" onClick={() => onValueChange("")}>Очистить</button></div>
        {importedFromBuilder && value && <div className="status"><strong>Descriptor получен из Multisig Builder.</strong><p>Можно сразу проверять структуру, checksum и совместимость.</p></div>}
        <label>Public descriptor<textarea value={value} onChange={(event) => { onValueChange(event.target.value); setCopied(""); }} placeholder="wsh(sortedmulti(2,[F23AABCD/48'/0'/0'/2']xpub.../0/*,...))#checksum" spellCheck={false} rows={8} /></label>
        {result.error && <div className="status error">{result.error}</div>}

        {result.parsed && (
          <>
            <div className="section-title settings-title"><span>02</span><div><h2>Структурный разбор</h2><p>Policy, сеть, ветка, origins и extended public keys</p></div></div>
            <div className="algorithm-metrics">
              <div><span>Script</span><strong>{result.parsed.scriptType}</strong></div>
              <div><span>Policy</span><strong>{result.parsed.threshold} из {result.parsed.total}</strong></div>
              <div><span>Network</span><strong>{result.parsed.network}</strong></div>
              <div><span>Branch</span><strong>{result.parsed.branch}</strong></div>
              <div><span>Health</span><strong>{result.parsed.score}/100</strong></div>
            </div>

            <div className={result.parsed.checksumStatus === "invalid" ? "status error" : "status"}>
              <strong>Checksum: {result.parsed.checksumStatus === "missing" ? "отсутствует" : result.parsed.checksumStatus === "valid" ? "корректен" : "ошибка"}</strong>
              <p>Рассчитанный checksum: <code>{result.parsed.calculatedChecksum}</code></p>
            </div>

            {result.parsed.warnings.length > 0
              ? <div className="status"><strong>Health Check</strong><ul>{result.parsed.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>
              : <div className="status"><strong>Health Check пройден.</strong><p>Явных структурных проблем и рисков совместимости не обнаружено.</p></div>}

            <div className="signer-list">
              {result.parsed.keys.map((key, index) => (
                <article className="signer-card" key={`${key.fingerprint}-${index}`}>
                  <div className="signer-heading"><strong>Signer {index + 1}</strong><span>{key.fingerprint}</span></div>
                  <small>Key type: {key.prefix || "unknown"} · {key.compatibility === "recommended" ? "рекомендован для P2WSH" : key.compatibility === "warning" ? "требует проверки совместимости" : "неизвестный тип"}</small>
                  <small>Network: {key.network}</small>
                  <small>Origin: {key.origin}</small>
                  <small>Branch: {key.branch} · {key.branchType} · wildcard {key.wildcard ? "есть" : "нет"}</small>
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
        <div className="algorithm-symbol">#</div><h3>Descriptor Engine v2</h3>
        <ul className="check-list"><li>Работает полностью локально</li><li>Проверяет Bitcoin Core checksum</li><li>Запрещает private extended keys</li><li>Проверяет origins и wildcard branches</li><li>Находит смешанные сети, branches и SLIP-132 риски</li></ul>
        <div className="multisig-warning"><strong>Граница версии</strong><p>Сейчас строго поддерживается публичный формат wsh(sortedmulti(...)). Другие descriptor-функции будут добавляться отдельными этапами.</p></div>
      </aside>
    </section>
  );
}
