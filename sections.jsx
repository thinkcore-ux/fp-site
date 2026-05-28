// FLOWERPUNK — page sections

function Hero({ c }) {
  return (
    <section id="hero" className="fp-container fp-hero fp-section fp-section--hero">
      <div className="fp-hero-bg" aria-hidden="true">
        <video
          className="fp-hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="https://images.pexels.com/videos/3805783/pexels-photo-3805783.jpeg?auto=compress&cs=tinysrgb&h=720&fit=crop&w=1280"
        >
          <source
            src="https://videos.pexels.com/video-files/3805783/3805783-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="fp-hero-scrim"></div>
        <div className="fp-hero-grain"></div>
      </div>
      <div className="fp-hero-text">
        <h1 className="display fp-hero-title-a">{c.hero_title_a}</h1>
        <div className="display fp-hero-title-b">{c.hero_title_b}</div>
        <p className="fp-hero-lede">{c.hero_lede}</p>
        <div className="fp-hero-ctas">
          <a href="#contact" className="fp-cta fp-cta--accent">{c.cta} →</a>
          <a href="#tiers" className="fp-cta fp-cta--ghost">{c.cta_secondary}</a>
        </div>
      </div>
    </section>
  );
}

function Why({ c }) {
  return (
    <section id="why" className="fp-container fp-why fp-section fp-section--tight-top">
      <SectionHead eyebrow={c.why_title} small />
      <div className="fp-care-bento fp-why-bento">
        {c.why_points.map((p, i) => (
          <article key={i} className={"fp-care-bento-cell fp-care-bento-cell-" + (i + 1)}>
            <div className="mono fp-care-bento-num">{p.k}</div>
            <h4 className="display fp-care-bento-title">{p.t}</h4>
            <p className="fp-care-bento-desc">{p.d}</p>
          </article>
        ))}
      </div>
      <div className="mono fp-why-foot">
        * Исследования о влиянии растений на ресторанный опыт. Подробности — по запросу.
      </div>
    </section>
  );
}

function InsideTail({ c }) {
  return (
    <section id="inside" className="fp-container fp-inside fp-section">
      <div className="fp-inside-summary">
        <div className="display fp-inside-summary-text">{c.inside_summary}</div>
      </div>
      <div className="fp-trydrive">
        <div className="fp-trydrive-inner">
          <div className="mono fp-trydrive-eyebrow">{c.try_eyebrow}</div>
          <h3 className="display fp-trydrive-title">{c.try_title}</h3>
          <p className="fp-trydrive-body">{c.try_body}</p>
          <a href="#contact" className="fp-cta fp-cta--accent fp-trydrive-cta">
            <span>{c.try_cta}</span><span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQ({ c }) {
  // FAQ data is now grouped: [{ group, items: [{q,a}] }]
  // Use a stable open key "groupIdx-itemIdx" — only one open at a time.
  // Default to the first item of the first group open.
  const [openKey, setOpenKey] = React.useState("0-0");
  // running counter so each item still gets a sequential /NN number
  let counter = 0;
  return (
    <section id="faq" className="fp-container fp-section">
      <SectionHead eyebrow={c.faq_eyebrow} title={c.faq_title} />
      <div className="fp-faq">
        {c.faq.map((group, gi) => (
          <div key={gi} className="fp-faq-group">
            <h3 className="display fp-faq-group-title">{group.group}</h3>
            <div className="fp-faq-group-items">
              {group.items.map((f, ii) => {
                const key = `${gi}-${ii}`;
                const isOpen = openKey === key;
                counter += 1;
                return (
                  <div key={ii} className={"fp-faq-item" + (isOpen ? " open" : "")}>
                    <div className="fp-faq-q" onClick={() => setOpenKey(isOpen ? null : key)}>
                      <div className="q-num">/{String(counter).padStart(2, "0")}</div>
                      <div className="q-text">{f.q}</div>
                      <div className="q-tog"></div>
                    </div>
                    <div className="fp-faq-a">{f.a}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>);
}

function Contact({ c }) {
  return (
    <section id="contact" className="fp-container fp-section">
      <SectionHead eyebrow={c.contact_eyebrow} />
      <div className="fp-contact-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: 64 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ marginTop: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 8 }}>Студия</div>
              <div style={{ fontSize: 16 }}>Санкт-Петербург, наб. реки Мойки, 36</div>
              <div style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 4 }}>Пн–Пт 09:00–20:00</div>
            </div>
            <div>
              <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 8 }}>Связь</div>
              <div style={{ fontSize: 16 }}>hello@flowerpunk.studio</div>
              <div style={{ fontSize: 16 }}>+7 (495) 000-00-00</div>
              <div style={{ fontSize: 16 }}>tg: @flowerpunk_b2b</div>
              <div style={{ fontSize: 16 }}>ig: @flowerpunk.studio</div>
            </div>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <label className="fp-input-label">Контактное лицо</label>
            <input className="fp-input" placeholder="Анна Иванова" />
          </div>
          <div>
            <label className="fp-input-label">Телефон или telegram</label>
            <input className="fp-input" placeholder="+7 ___ ___ __ __" />
          </div>
          <div>
            <label className="fp-input-label">Email</label>
            <input className="fp-input" placeholder="you@bistro.ru" />
          </div>
          <div>
            <label className="fp-input-label">Комментарий</label>
            <input className="fp-input" placeholder="Коротко о задаче — необязательно" />
          </div>
          <button type="submit" className="fp-cta fp-cta--accent" style={{ marginTop: 16, justifyContent: "space-between", padding: "18px 18px" }}>
            <span>Поговорим о цветах</span>
            <span>→</span>
          </button>
          <div className="mono-sm" style={{ color: "var(--ink-3)" }}>
            Перезвоним в течение 1 рабочего дня. Бесплатный визит флориста — без обязательств.
          </div>
        </form>
      </div>
    </section>);
}

function Footer({ c }) {
  return (
    <footer className="fp-foot fp-foot--slim">
      <div className="fp-container">
        <div className="fp-foot-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <img src="logo.svg" alt="FLOWERPUNK" style={{ height: 32, width: "auto" }} />
            <div className="fp-foot-mono">© 2021—2026 FLOWERPUNK STUDIO · ОГРН 1234567890123</div>
          </div>
          <div className="fp-foot-mono">Сделано в Петербурге</div>
        </div>
      </div>
    </footer>);
}

Object.assign(window, { Hero, Why, InsideTail, FAQ, Contact, Footer });
