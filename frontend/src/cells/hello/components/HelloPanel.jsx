export function HelloPanel({ hello, error }) {
  return (
    <article className="panel">
      <p className="section-label">Hello API</p>
      <h2>Backend greeting</h2>
      {error ? <p className="error">{error}</p> : null}
      {!hello && !error ? <p>Loading greeting...</p> : null}
      {hello ? (
        <>
          <p className="hero-copy">{hello.message}</p>
          <p className="muted">
            This payload is served from <code>/api/hello</code> and rendered on
            the landing page.
          </p>
        </>
      ) : null}
    </article>
  );
}
