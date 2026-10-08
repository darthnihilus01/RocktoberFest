import { useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../lib/content.jsx";
import { isSupabaseConfigured } from "../lib/supabase.js";

const TABS = ["hero", "cause", "lineup", "schedule", "tickets", "donate", "venue", "faq", "sponsors", "contact"];

export default function Admin() {
  const { content, save, reset } = useContent();
  const [tab, setTab] = useState("hero");
  const [draft, setDraft] = useState(content);
  const [msg, setMsg] = useState("");
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("raft-admin") === "1");
  const [pw, setPw] = useState("");

  function set(path, value) {
    const next = structuredClone(draft);
    const keys = path.split(".");
    let o = next;
    for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
    o[keys[keys.length - 1]] = value;
    setDraft(next);
  }

  async function publish() {
    await save(draft);
    setMsg("Published! Public site updated instantly.");
    setTimeout(() => setMsg(""), 2500);
  }

  if (!authed) {
    return (
      <div className="admin-wrap">
        <div className="container" style={{ maxWidth: 480 }}>
          <Link to="/">← Back to site</Link>
          <h1>Admin login</h1>
          <p>Demo gate (no Supabase Auth yet). Password is <code>raft2026</code>. Replace with Supabase Auth when you share the admin email.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pw === "raft2026") {
                sessionStorage.setItem("raft-admin", "1");
                setAuthed(true);
              } else alert("Wrong password");
            }}
          >
            <label className="field">Password
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
            </label>
            <button className="btn btn-yellow" type="submit">Unlock</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="container">
        <Link to="/">← Back to site</Link>
        <h1>Live admin</h1>
        <p>
          Edits publish instantly to the homepage. Storage: localStorage now
          {isSupabaseConfigured ? " + Supabase sync on" : " (add VITE_SUPABASE_URL / KEY to sync across devices — see .env.example)"}.
        </p>
        {msg && <div className="admin-card" role="status">{msg}</div>}
        <div className="admin-grid">
          <div className="admin-tabs" role="tablist">
            {TABS.map((t) => (
              <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <div>
            {tab === "hero" && (
              <div className="admin-card">
                <div className="field"><label>Collab line</label><input value={draft.hero.collab} onChange={(e) => set("hero.collab", e.target.value)} /></div>
                <div className="row-2">
                  <div className="field"><label>Date</label><input value={draft.hero.dateLabel} onChange={(e) => set("hero.dateLabel", e.target.value)} /></div>
                  <div className="field"><label>Time</label><input value={draft.hero.timeLabel} onChange={(e) => set("hero.timeLabel", e.target.value)} /></div>
                </div>
                <div className="field"><label>Venue</label><input value={draft.hero.venueLabel} onChange={(e) => set("hero.venueLabel", e.target.value)} /></div>
                <div className="field"><label>Tagline</label><textarea value={draft.hero.tagline} onChange={(e) => set("hero.tagline", e.target.value)} /></div>
              </div>
            )}
            {tab === "cause" && (
              <div className="admin-card">
                <div className="field"><label>Heading</label><input value={draft.cause.heading} onChange={(e) => set("cause.heading", e.target.value)} /></div>
                <div className="field"><label>Body</label><textarea value={draft.cause.body} onChange={(e) => set("cause.body", e.target.value)} /></div>
                <div className="row-2">
                  <div className="field"><label>Goal ₹</label><input type="number" value={draft.cause.goal} onChange={(e) => set("cause.goal", Number(e.target.value))} /></div>
                  <div className="field"><label>Raised ₹</label><input type="number" value={draft.cause.raised} onChange={(e) => set("cause.raised", Number(e.target.value))} /></div>
                </div>
              </div>
            )}
            {tab === "lineup" && (
              <div className="admin-card">
                {draft.lineup.map((b, i) => (
                  <div key={i} style={{ borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 12 }}>
                    <strong>Band {i + 1}</strong>
                    <div className="field"><label>Name</label><input value={b.name} onChange={(e) => { const n = structuredClone(draft); n.lineup[i].name = e.target.value; setDraft(n); }} /></div>
                    <div className="row-2">
                      <div className="field"><label>Time</label><input value={b.time} onChange={(e) => { const n = structuredClone(draft); n.lineup[i].time = e.target.value; setDraft(n); }} /></div>
                      <div className="field"><label>Image URL</label><input value={b.image} onChange={(e) => { const n = structuredClone(draft); n.lineup[i].image = e.target.value; setDraft(n); }} /></div>
                    </div>
                    <div className="field"><label>Blurb</label><input value={b.blurb} onChange={(e) => { const n = structuredClone(draft); n.lineup[i].blurb = e.target.value; setDraft(n); }} /></div>
                    <button className="btn btn-ghost btn-small" style={{ color: "#333", borderColor: "#333" }} onClick={() => { const n = structuredClone(draft); n.lineup.splice(i, 1); setDraft(n); }}>Remove</button>
                  </div>
                ))}
                <button className="btn btn-ghost btn-small" style={{ color: "#333", borderColor: "#333" }} onClick={() => setDraft({ ...draft, lineup: [...draft.lineup, { name: "New band", time: "TBA", blurb: "", image: "" }] })}>+ Add band</button>
              </div>
            )}
            {tab === "schedule" && (
              <div className="admin-card">
                {draft.schedule.map((s, i) => (
                  <div key={i} style={{ borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 12 }}>
                    <div className="row-2">
                      <div className="field"><label>Time</label><input value={s.time} onChange={(e) => { const n = structuredClone(draft); n.schedule[i].time = e.target.value; setDraft(n); }} /></div>
                      <div className="field"><label>Title</label><input value={s.title} onChange={(e) => { const n = structuredClone(draft); n.schedule[i].title = e.target.value; setDraft(n); }} /></div>
                    </div>
                    <div className="field"><label>Desc</label><input value={s.desc} onChange={(e) => { const n = structuredClone(draft); n.schedule[i].desc = e.target.value; setDraft(n); }} /></div>
                  </div>
                ))}
                <button className="btn btn-ghost btn-small" style={{ color: "#333", borderColor: "#333" }} onClick={() => setDraft({ ...draft, schedule: [...draft.schedule, { time: "TBA", title: "", desc: "" }] })}>+ Add slot</button>
              </div>
            )}
            {tab === "tickets" && (
              <div className="admin-card">
                {draft.tickets.map((t, i) => (
                  <div key={i} style={{ borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 12 }}>
                    <div className="row-2">
                      <div className="field"><label>Tier</label><input value={t.tier} onChange={(e) => { const n = structuredClone(draft); n.tickets[i].tier = e.target.value; setDraft(n); }} /></div>
                      <div className="field"><label>Price</label><input value={t.price} onChange={(e) => { const n = structuredClone(draft); n.tickets[i].price = e.target.value; setDraft(n); }} /></div>
                    </div>
                    <div className="field"><label>Perks</label><input value={t.perks} onChange={(e) => { const n = structuredClone(draft); n.tickets[i].perks = e.target.value; setDraft(n); }} /></div>
                    <div className="field"><label>Checkout URL</label><input value={t.url} onChange={(e) => { const n = structuredClone(draft); n.tickets[i].url = e.target.value; setDraft(n); }} /></div>
                  </div>
                ))}
              </div>
            )}
            {tab === "donate" && (
              <div className="admin-card">
                <div className="field"><label>Headline</label><input value={draft.donate.headline} onChange={(e) => set("donate.headline", e.target.value)} /></div>
                <div className="field"><label>Body</label><textarea value={draft.donate.body} onChange={(e) => set("donate.body", e.target.value)} /></div>
                <div className="row-2">
                  <div className="field"><label>Donate link</label><input value={draft.donate.link} onChange={(e) => set("donate.link", e.target.value)} /></div>
                  <div className="field"><label>UPI</label><input value={draft.donate.upi} onChange={(e) => set("donate.upi", e.target.value)} /></div>
                </div>
              </div>
            )}
            {tab === "venue" && (
              <div className="admin-card">
                <div className="field"><label>Name</label><input value={draft.venue.name} onChange={(e) => set("venue.name", e.target.value)} /></div>
                <div className="field"><label>Address</label><input value={draft.venue.address} onChange={(e) => set("venue.address", e.target.value)} /></div>
                <div className="field"><label>Transport</label><textarea value={draft.venue.transport} onChange={(e) => set("venue.transport", e.target.value)} /></div>
                <div className="field"><label>Accessibility</label><textarea value={draft.venue.accessibility} onChange={(e) => set("venue.accessibility", e.target.value)} /></div>
              </div>
            )}
            {tab === "faq" && (
              <div className="admin-card">
                {draft.faq.map((f, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div className="field"><label>Q</label><input value={f.q} onChange={(e) => { const n = structuredClone(draft); n.faq[i].q = e.target.value; setDraft(n); }} /></div>
                    <div className="field"><label>A</label><textarea value={f.a} onChange={(e) => { const n = structuredClone(draft); n.faq[i].a = e.target.value; setDraft(n); }} /></div>
                  </div>
                ))}
                <button className="btn btn-ghost btn-small" style={{ color: "#333", borderColor: "#333" }} onClick={() => setDraft({ ...draft, faq: [...draft.faq, { q: "", a: "" }] })}>+ Add FAQ</button>
              </div>
            )}
            {tab === "sponsors" && (
              <div className="admin-card">
                <div className="field"><label>One per line</label><textarea value={draft.sponsors.join("\n")} onChange={(e) => setDraft({ ...draft, sponsors: e.target.value.split("\n") })} /></div>
              </div>
            )}
            {tab === "contact" && (
              <div className="admin-card">
                <div className="field"><label>Email</label><input value={draft.contact.email} onChange={(e) => set("contact.email", e.target.value)} /></div>
                <div className="field"><label>Instagram</label><input value={draft.contact.instagram} onChange={(e) => set("contact.instagram", e.target.value)} /></div>
                <div className="field"><label>Phone</label><input value={draft.contact.phone} onChange={(e) => set("contact.phone", e.target.value)} /></div>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button className="btn btn-yellow" onClick={publish}>Publish live</button>
              <button className="btn btn-ghost btn-small" style={{ color: "#333", borderColor: "#333" }} onClick={() => { setDraft(structuredClone(content)); }}>Discard</button>
              <button className="btn btn-ghost btn-small" style={{ color: "#a00", borderColor: "#a00" }} onClick={() => { reset(); setDraft(structuredClone(content)); }}>Reset to poster defaults</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
