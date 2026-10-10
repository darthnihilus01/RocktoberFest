export default function Contact({ contact }) {
  if (!contact) return null;
  return (
    <section className="section section-light" id="contact" aria-labelledby="contact-h">
      <div className="container">
        <span className="eyebrow purple">Reach Out</span>
        <h2 id="contact-h">Contact Us</h2>
        <p className="lead">Have questions about the event or your donation? Let us know.</p>
        <div className="card-grid" style={{ marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {contact.email && (
            <div className="card">
              <h3>Email</h3>
              <p style={{ marginTop: 8 }}>
                <a href={`mailto:${contact.email}`} style={{ color: 'var(--yellow)', fontWeight: 700 }}>
                  {contact.email}
                </a>
              </p>
            </div>
          )}
          <div className="card">
            <h3>Instagram</h3>
            <p style={{ marginTop: 8 }}>
              <a href={`https://instagram.com/${contact.instagram?.replace('@', '')}`} style={{ color: 'var(--teal)', fontWeight: 700 }} target="_blank" rel="noreferrer">
                {contact.instagram}
              </a>
            </p>
          </div>
          <div className="card">
            <h3>Phone</h3>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {contact.phone?.split(',').map((p) => {
                const trimmed = p.trim();
                return (
                  <a key={trimmed} href={`tel:${trimmed.replace(/\s+/g, '')}`} style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                    {trimmed}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
