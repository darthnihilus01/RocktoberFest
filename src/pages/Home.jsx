import { useState } from "react";

export default function Home() {
  const [activeNav, setActiveNav] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("9845502808@ptaxis");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const navItems = [
    { label: "Home", href: "#top", id: "home" },
    { label: "Tickets", href: "#ticket-tiers", id: "tickets" },
    { label: "Contact Us", href: "#contact", id: "contact" },
  ];

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container min-h-screen">
      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary-container/95 backdrop-blur-md shadow-[0_4px_16px_rgba(16,14,9,0.55)]">
        <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <a href="#top" className="bg-surface-container-lowest px-space-sm py-space-xs shadow-sm flex items-center">
              <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">GOONJ</span>
              <span className="font-label-sm text-label-sm text-tertiary px-space-xs font-bold">×</span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">TKC</span>
            </a>
          </div>

          <nav className="hidden xl:flex items-center gap-space-sm">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveNav(item.id)}
                  className={`font-label-md uppercase px-space-sm py-space-xs transition-colors ${isActive
                    ? "bg-surface-container-highest text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center">
            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-on-surface p-1"
              aria-label="Toggle Navigation"
            >
              <span className="material-symbols-outlined text-title-lg">menu</span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-surface-container-highest border-t border-outline-variant px-margin py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileMenuOpen(false);
                }}
                className="font-label-md uppercase py-2 text-on-surface hover:text-secondary"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="w-full pt-20 bg-surface min-h-screen" id="top">
        <div className="flex flex-col w-full relative selection:bg-secondary selection:text-on-secondary overflow-hidden">
          {/* VINTAGE RISO DOTS & AMBIENT GRAPHIC NOISE ACCENT */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#c6c0ff_1px,transparent_1px)] [background-size:12px_12px] z-0"></div>

          {/* ─── SECTION 1: HERO ─── */}
          <section className="relative w-full px-margin-mobile md:px-margin py-space-lg md:py-space-xl">
            <div className="max-w-7xl mx-auto">
              {/* MAIN HERO GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start lg:pt-12">
                {/* LEFT HERO EDITORIAL */}
                <div className="lg:col-span-7 flex flex-col gap-space-md z-10">
                  {/* PRESENTERS ROW */}
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                      GOONJ × THE KNOWLEDGE CORPS
                    </span>
                    <span className="text-outline text-xs">•</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-bold">
                      PRESENTS
                    </span>
                  </div>

                  {/* HERO TITLE */}
                  <div>
                    <h1 className="font-headline-xl text-headline-xl uppercase tracking-tight text-on-surface leading-none">
                      ROCKTOBER'<br />
                      <span className="text-secondary">FEST</span>
                    </h1>
                    <p className="font-title-md text-title-md text-tertiary uppercase font-bold tracking-wider mt-3">
                      Featuring Student Bands Live
                    </p>
                  </div>

                  {/* VALUE PROPOSITION */}
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                    A student-run benefit concert raising funds to support education for underprivileged children across Bangalore. 100% of proceeds go directly to charity.
                  </p>

                  {/* DATE & VENUE PILL */}
                  <div className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 bg-surface-container-high px-space-md py-space-sm w-fit border border-outline-variant/30">
                    <div className="flex items-center gap-2 text-secondary font-label-md text-label-md uppercase font-bold">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                      THE RAFT, KORAMANGALA
                    </div>
                    <span className="hidden sm:inline text-outline">•</span>
                    <div className="flex items-center gap-2 text-primary font-label-md text-label-md uppercase font-bold">
                      <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                      FRI, 23 OCT 2026 // 5:30 PM
                    </div>
                  </div>

                  {/* HERO ACTION BUTTONS */}
                  <div className="flex flex-wrap items-center gap-space-sm pt-1">
                    <a
                      href="#ticket-tiers"
                      className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-title-md text-sm uppercase px-space-md py-2.5 hover:bg-secondary-fixed transition-colors font-bold shadow-[3px_3px_0px_#100e09]"
                    >
                      <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                      GET TICKETS (₹349+)
                    </a>
                    <a
                      href="#direct-upi"
                      className="inline-flex items-center gap-2 bg-surface-container border border-outline-variant/40 text-on-surface hover:text-secondary font-title-md text-sm uppercase px-space-md py-2.5 transition-colors font-bold shadow-[3px_3px_0px_#100e09]"
                    >
                      <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                      DONATE VIA UPI
                    </a>
                  </div>
                </div>

                {/* RIGHT POSTER: CLEAN, CRISP ARTWORK DISPLAY */}
                <div className="lg:col-span-5 flex justify-center -mt-6 lg:-mt-12">
                  <div className="w-full max-w-md bg-surface-container p-2.5 shadow-2xl rounded-sm -rotate-2">
                    <img
                      alt="Goonj x The Knowledge Corps Fundraiser Concert Poster"
                      className="w-full h-auto object-cover rounded-sm shadow-inner"
                      src="/image.jpeg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── SECTION 5: TICKETS & UPI DIRECT DONATION ─── */}
          <section className="relative w-full px-margin-mobile md:px-margin py-space-xl" id="ticket-tiers">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
              {/* HEADER */}
              <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-space-xs">
                <div className="bg-tertiary text-on-tertiary px-space-sm py-1 font-label-sm text-label-sm uppercase font-bold shadow-sm">
                  ★ TICKETS OUT NOW ★
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">
                  TICKET <span className="text-secondary">PRICING</span>
                </h2>
                <p className="font-title-md text-title-md text-secondary font-bold uppercase tracking-wider">
                  Since it's for charity, all three tiers offer the same experience. The difference is just how much you are willing to donate.
                </p>

              </div>

              {/* 3 TICKET CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg items-stretch">
                {/* TIER 1: ₹349 */}
                <div className="relative bg-surface-container p-space-lg shadow-[5px_5px_0px_#100e09] flex flex-col justify-between">
                  <div className="flex flex-col gap-space-md">

                    <div className="bg-surface-container-lowest p-space-md flex items-baseline gap-space-xs shadow-inner">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold leading-none">₹349</span>
                      <span className="font-label-sm text-label-sm text-outline uppercase font-mono">/ STANDING TICKET</span>
                    </div>

                  </div>

                </div>

                {/* TIER 2: ₹449 (FEATURED) */}
                <div className="relative bg-surface-container-high p-space-lg shadow-[8px_8px_0px_#7e0022] flex flex-col justify-between -translate-y-2">
                  <div className="flex flex-col gap-space-md pt-2">

                    <div className="bg-surface-container-lowest p-space-md flex items-baseline gap-space-xs shadow-inner">
                      <span className="font-headline-lg text-headline-lg text-tertiary font-extrabold leading-none">₹449</span>
                      <span className="font-label-sm text-label-sm text-outline uppercase font-mono">/ STANDING TICKET</span>
                    </div>

                  </div>

                </div>

                {/* TIER 3: ₹549 */}
                <div className="relative bg-surface-container p-space-lg shadow-[5px_5px_0px_#003734] flex flex-col justify-between">
                  <div className="flex flex-col gap-space-md">

                    <div className="bg-surface-container-lowest p-space-md flex items-baseline gap-space-xs shadow-inner">
                      <span className="font-headline-lg text-headline-lg text-primary font-extrabold leading-none">₹549</span>
                      <span className="font-label-sm text-label-sm text-outline uppercase font-mono">/ STANDING TICKET</span>
                    </div>

                  </div>

                </div>
              </div>

              {/* SINGLE PAYMENT BUTTON */}
              <div className="flex justify-center mt-space-md">
                <a href="#direct-upi" className="inline-flex items-center justify-center gap-space-xs bg-secondary text-on-secondary font-title-md text-title-md uppercase px-space-xl py-4 hover:bg-secondary-fixed transition-colors font-bold shadow-[6px_6px_0px_#100e09] text-xl">
                  GET IT NOW
                </a>
              </div>

              {/* DIRECT UPI REMOTE DONATION CARD */}
              <div className="bg-surface-container-low p-space-lg shadow-[6px_6px_0px_#382f84] relative" id="direct-upi">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
                  <div className="md:col-span-8 flex flex-col gap-space-sm">

                    <h3 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">
                      Want to donate or make an additional contribution?
                    </h3>

                    <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                      <div className="bg-surface-container-lowest px-space-md py-space-xs flex items-center gap-space-sm shadow-[2px_2px_0px_#5dd9d0]">
                        <span className="font-label-sm text-label-sm text-outline uppercase font-mono">UPI ID:</span>
                        <span className="font-label-md text-label-md text-secondary select-all font-mono font-bold">
                          9845502808@ptaxis
                        </span>
                        <button
                          className="material-symbols-outlined text-on-surface text-body-md hover:text-secondary transition-colors"
                          onClick={handleCopyUpi}
                          title="Copy UPI ID"
                        >
                          {copied ? "check" : "content_copy"}
                        </button>
                      </div>
                      {copied && (
                        <span className="text-secondary font-label-sm text-label-sm uppercase font-bold">
                          ✓ UPI ID Copied!
                        </span>
                      )}

                    </div>
                  </div>

                  {/* QR DISPLAY */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center">
                    <div className="bg-surface-container-lowest p-space-md shadow-[4px_4px_0px_#ffb2b6] flex flex-col items-center gap-space-xs">
                      {/* Real Scannable High-Contrast QR Code */}
                      <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 flex items-center justify-center border border-outline-variant/30 shadow-md">
                        <img
                          src="/qr.png"
                          alt="UPI QR Code - Scan to pay via Google Pay, PhonePe, Paytm, or BHIM"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-label-sm text-label-sm uppercase text-secondary font-mono font-bold mt-2 tracking-wider">
                        SCAN VIA ANY UPI APP
                      </span>
                      <span className="font-label-md text-label-md text-tertiary font-bold tracking-wider">
                        ₹100 TO ₹50,000
                      </span>
                      <span className="text-[11px] font-mono text-outline uppercase tracking-wider">
                        GPay • PhonePe • Paytm • BHIM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── SECTION: CONTACT US ─── */}
          <section className="relative w-full px-margin-mobile md:px-margin py-space-xl bg-surface-container-low" id="contact">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">
                    CONTACT <span className="text-secondary">US</span>
                  </h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Have questions about the event or your donation? Let us know.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-sm">
                <div className="bg-surface-container p-space-md flex flex-col gap-space-xs shadow-[3px_3px_0px_#100e09]">
                  <span className="font-title-md text-title-md text-on-surface uppercase font-bold">Phone</span>
                  <a href="tel:+917975043076" className="text-secondary font-label-md font-bold uppercase hover:text-on-surface">+91 79 7504 3076</a>
                </div>
                <div className="bg-surface-container p-space-md flex flex-col gap-space-xs shadow-[3px_3px_0px_#100e09]">
                  <span className="font-title-md text-title-md text-on-surface uppercase font-bold">Instagram</span>
                  <a
                    href="https://instagram.com/rock.tober.fest"
                    target="_blank"
                    rel="noreferrer"
                    className="text-tertiary font-label-md font-bold uppercase hover:text-on-surface"
                  >
                    @rock.tober.fest
                  </a>
                </div>

              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="w-full bg-surface-container-lowest text-on-surface-variant mt-space-xl border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-margin py-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-space-sm">
            <span className="font-title-md text-title-md text-primary uppercase font-bold">GOONJ × TKC</span>
            <span className="hidden sm:inline text-outline">•</span>
            <span className="font-label-sm text-label-sm uppercase bg-surface-container-high px-space-sm py-1 text-secondary">
              100% Proceeds to Education
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-outline uppercase">
            The Knowledge Corps
          </span>
        </div>
      </footer>
    </div>
  );
}
