import { HelloPanel } from "../../cells/hello/components/HelloPanel";
import { StatusCard } from "../../cells/status/components/StatusCard";

export function AdminPage({ hello, helloError, status, statusError, onNavigate }) {
  return (
    <main className="shell">
      <header className="topbar">
        <button className="topbar-link" type="button" onClick={() => onNavigate("/")}>
          Recipe search
        </button>
        <span className="topbar-link active">Admin</span>
      </header>

      <section className="hero hero-grid">
        <div>
          <p className="eyebrow">Admin Route</p>
          <h1>Project controls, diagnostics, and placeholder content.</h1>
          <p className="lede">
            This route holds the non-core UI so the main page can stay focused
            on recipe search and saved collections.
          </p>
        </div>
        <HelloPanel hello={hello} error={helloError} />
      </section>

      <section className="grid" id="api">
        <StatusCard status={status} error={statusError} />
        <article className="panel">
          <h2>How this is organized</h2>
          <p>
            The gateway exposes one surface, while each feature cell owns its
            frontend slice and backend capability.
          </p>
          <ul>
            <li>UI lives under <code>frontend/src/cells</code>.</li>
            <li>API cells live under <code>backend/cells</code>.</li>
            <li>Docker keeps edge, client, and API concerns isolated.</li>
          </ul>
        </article>
      </section>

      <section className="landing-grid" id="overview">
        <article className="panel">
          <p className="section-label">Landing Page</p>
          <h2>Skeleton sections ready to extend</h2>
          <p>
            This project still has room for additional workflows, but the
            placeholder content now lives off the main recipe path.
          </p>
        </article>
        <article className="panel accent">
          <p className="section-label">Next Cells</p>
          <h2>Keep admin-only content out of the main recipe flow</h2>
          <p>
            Use this route for operational UI, diagnostics, or future internal
            tools without cluttering the primary recipe experience.
          </p>
        </article>
      </section>
    </main>
  );
}
