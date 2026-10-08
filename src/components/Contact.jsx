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
            <p style={{ marginTop: 8, fontWeight: 700, color: 'var(--on-surface)' }}>
              <a href={`tel:${contact.phone?.replace(/\s+/g, '')}`}>
                {contact.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
