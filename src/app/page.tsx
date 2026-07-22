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
          <span className="eyebrow">LOCAL · OFFLINE · OPEN SOURCE</span>
          <h1>Wallet Key Explorer</h1>
          <p>Офлайн-инструменты для анализа публичных ключей, descriptor и multisig-конфигураций Bitcoin.</p>
        </div>
        <div className="offline-pill"><span /> Сеть не используется</div>
      </section>

      <div className="tabs main-tabs">
        <button className={activeTab === "multisig" ? "active" : ""} onClick={() => setActiveTab("multisig")}>Multisig Builder</button>
        <button disabled>Wallet Explorer</button>
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

      <footer className="app-footer"><span>Wallet Key Explorer</span><span>v0.3.0 · MIT License</span></footer>
    </main>
  );
}
