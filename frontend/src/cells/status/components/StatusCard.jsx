export function StatusCard({ status, error }) {
  return (
    <article className="panel accent">
      <h2>Status Cell</h2>
      {error ? <p className="error">{error}</p> : null}
      {!status && !error ? <p>Loading backend state...</p> : null}
      {status ? (
        <dl className="status-list">
          <div>
            <dt>Cell</dt>
            <dd>{status.cell}</dd>
          </div>
          <div>
            <dt>State</dt>
            <dd>{status.state}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>{status.service}</dd>
          </div>
          <div>
            <dt>Timestamp</dt>
            <dd>{new Date(status.timestamp).toLocaleString()}</dd>
          </div>
        </dl>
      ) : null}
      {status ? <p>{status.message}</p> : null}
    </article>
  );
}

