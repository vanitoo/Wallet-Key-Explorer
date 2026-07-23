"use client";

import { useState } from "react";
import { AddressInspector } from "../modules/address/components/address-inspector";
import { DescriptorExplorer } from "../modules/descriptor/components/descriptor-explorer";
import { ExtendedKeyInspector } from "../modules/extended-key/components/extended-key-inspector";
import { MultisigBuilder } from "../modules/multisig/components/multisig-builder";

type ActiveTab = "extended-key" | "multisig" | "descriptor" | "address";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("extended-key");
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
          <span className="eyebrow">LOCAL · OFFLINE · PUBLIC OBJECTS ONLY</span>
          <h1>Wallet Key Explorer</h1>
          <p>Набор инструментов для анализа публичных объектов Bitcoin: extended keys, descriptors, multisig policies, addresses, scripts и PSBT.</p>
        </div>
        <div className="offline-pill"><span /> Сеть не используется</div>
      </section>

      <div className="tabs main-tabs">
        <button className={activeTab === "extended-key" ? "active" : ""} onClick={() => setActiveTab("extended-key")}>Extended Key Inspector</button>
        <button className={activeTab === "multisig" ? "active" : ""} onClick={() => setActiveTab("multisig")}>Multisig Policy Builder</button>
        <button className={activeTab === "descriptor" ? "active" : ""} onClick={() => setActiveTab("descriptor")}>Descriptor Inspector</button>
        <button className={activeTab === "address" ? "active" : ""} onClick={() => setActiveTab("address")}>Address Inspector</button>
      </div>

      <div hidden={activeTab !== "extended-key"}><ExtendedKeyInspector /></div>
      <div hidden={activeTab !== "multisig"}><MultisigBuilder onInspectDescriptor={inspectDescriptor} /></div>
      <div hidden={activeTab !== "descriptor"}>
        <DescriptorExplorer value={descriptorToInspect} onValueChange={updateDescriptor} importedFromBuilder={importedFromBuilder} />
      </div>
      <div hidden={activeTab !== "address"}><AddressInspector /></div>

      <footer className="app-footer"><span>Wallet Key Explorer</span><span>v0.6.0 · Public Bitcoin Object Analysis · MIT</span></footer>
    </main>
  );
}
