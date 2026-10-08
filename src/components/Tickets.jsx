export default function Tickets({ tickets, donate }) {
  return (
    <section className="section" id="tickets" aria-labelledby="tick-h">
      <div className="container">
        <span className="eyebrow">Tickets & donations</span>
        <h2 id="tick-h">Get tickets</h2>
        <p className="lead" style={{ maxWidth: 600 }}>All three ticket tiers provide the exact same access and experience. Since this is a charity fundraiser, choose a tier based on the amount you are willing to donate to the cause.</p>
        <div className="card-grid">
          {tickets.map((t, i) => (
            <article className="card" key={i} style={i === 1 ? { borderColor: "var(--yellow)", borderWidth: 4 } : undefined}>
              {i === 1 && <span className="badge yellow">Most impact</span>}
              <h3>{t.tier}</h3>
              <p style={{ fontSize: 28, fontWeight: 900 }}>{t.price}</p>
              <p>{t.perks}</p>
              <a className={`btn ${t.soldout ? "btn-ghost" : "btn-yellow"} btn-small`} href={t.url} aria-disabled={t.soldout}>
                {t.soldout ? "Sold out" : "Book"}
              </a>
            </article>
          ))}
        </div>
        <div className="card dark" id="donate" style={{ marginTop: 22 }}>
          <span className="badge teal">Donate</span>
          <h3>{donate.headline}</h3>
          <p>{donate.body}</p>
          <p><strong>UPI:</strong> {donate.upi}</p>
          <a className="btn btn-pinky" href={donate.link}>Donate now</a>
        </div>
      </div>
    </section>
  );
}
