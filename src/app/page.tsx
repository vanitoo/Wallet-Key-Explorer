import { MultisigBuilder } from "../modules/multisig/components/multisig-builder";

export default function Home() {
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
        <button className="active">Multisig Builder</button>
        <button disabled>Wallet Explorer</button>
        <button disabled>Descriptor Explorer</button>
      </div>

      <MultisigBuilder />

      <footer className="app-footer"><span>Wallet Key Explorer</span><span>v0.1.0 · MIT License</span></footer>
    </main>
  );
}
