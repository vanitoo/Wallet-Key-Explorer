"use client";

import { useState } from "react";
import { DescriptorExplorer } from "../modules/descriptor/components/descriptor-explorer";
import { MultisigBuilder } from "../modules/multisig/components/multisig-builder";

type ActiveTab = "multisig" | "descriptor";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("multisig");
  const [descriptorToInspect, setDescriptorToInspect] = useState("");
  const [importedFromBuilder, setImportedFromBuilder] = useState(false);

  function inspectDescriptor(descriptor: string): void {
    setDescriptorToInspect(descriptor);
    setImportedFromBuilder(true);
    setActiveTab("descriptor");
  }

  function updateDescriptor(value: string): void {
    setDescriptorToInspect(value);
    setImportedFromBuilder(false);
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <span className="eyebrow">LOCAL · OFFLINE · PUBLIC DATA ONLY</span>
          <h1>Wallet Key Explorer</h1>
          <p>Инструменты для анализа публичных криптографических объектов Bitcoin: extended keys, descriptors, multisig policies, scripts и PSBT.</p>
        </div>
        <div className="offline-pill"><span /> Сеть не используется</div>
      </section>

      <div className="tabs main-tabs">
        <button className={activeTab === "multisig" ? "active" : ""} onClick={() => setActiveTab("multisig")}>Multisig Builder</button>
        <button className={activeTab === "descriptor" ? "active" : ""} onClick={() => setActiveTab("descriptor")}>Descriptor Explorer</button>
      </div>

      <div hidden={activeTab !== "multisig"}>
        <MultisigBuilder onInspectDescriptor={inspectDescriptor} />
      </div>
      <div hidden={activeTab !== "descriptor"}>
        <DescriptorExplorer
          value={descriptorToInspect}
          onValueChange={updateDescriptor}
          importedFromBuilder={importedFromBuilder}
        />
      </div>

      <footer className="app-footer"><span>Wallet Key Explorer</span><span>v0.3.0 · Public Bitcoin Object Analysis · MIT</span></footer>
    </main>
  );
}
