// FLOWERPUNK — shared components

// Striped placeholder image with corner labels
function Placeholder({ tag, id, label, dark, ratio, src, style, children }) {
  const cls = "fp-ph" + (dark ? " fp-ph--dark" : "") + (src ? "" : " fp-ph--no-bg");
  return (
    <div className={cls} style={{ aspectRatio: ratio || undefined, ...style }}>
      {src ? <div className="fp-ph-bg" style={{ backgroundImage: `url("${src}")` }}></div> : null}
      <div className="fp-ph-row" style={{ position: "relative", zIndex: 1 }}>
        <span className="fp-ph-tag" style={src ? { color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.6)" } : null}>{tag}</span>
        <span className="fp-ph-id" style={src ? { color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.6)" } : null}>{id}</span>
      </div>
      {children ? <div style={{ alignSelf: "center", textAlign: "center", position: "relative", zIndex: 1 }}>{children}</div> : null}
      <div className="fp-ph-row" style={{ position: "relative", zIndex: 1 }}>
        <span className="fp-ph-tag" style={src ? { color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.6)", opacity: 0.95 } : { opacity: 0.7 }}>{label}</span>
        <span className="fp-ph-id" style={src ? { color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.6)", opacity: 0.95 } : { opacity: 0.7 }}>◊</span>
      </div>
    </div>
  );
}

// A single big numbered/labeled stat
function Spec({ k, v }) {
  return (
    <div className="fp-spec">
      <div className="fp-spec-k">{k}</div>
      <div className="fp-spec-v">{v}</div>
    </div>
  );
}

// Section header — eyebrow becomes the visually dominant title.
// `small` makes secondary sections (Why, Inside) render at a medium size.
// `kicker` is an optional supporting paragraph below the title.
function SectionHead({ eyebrow, kicker, small }) {
  return (
    <div className={"fp-section-head" + (small ? " fp-section-head--small" : "")}>
      <h2 className={"display " + (small ? "fp-section-title-sm" : "fp-section-title")}>{eyebrow}</h2>
      {kicker ? <p className="fp-section-kicker">{kicker}</p> : null}
    </div>
  );
}

// Marquee ticker
function Ticker({ items }) {
  const seq = items.concat(items);
  return (
    <div className="fp-ticker">
      <div className="fp-ticker-track">
        <span>
          {seq.map((it, i) => (
            <React.Fragment key={i}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
                <i className="fp-ticker-dot"></i>
                {it}
              </span>
            </React.Fragment>
          ))}
        </span>
      </div>
    </div>
  );
}

// Cross-fading image carousel for the Care section
function CareCarousel({ images, interval = 3500, height = 520 }) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => {
      setIdx(i => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images, interval]);
  if (!images || !images.length) return null;
  return (
    <div className="fp-care-carousel" style={{ position: "relative", height, overflow: "hidden", background: "var(--ink)" }}>
      {images.map((src, i) => (
        <div
          key={i}
          aria-hidden={i !== idx}
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: i === idx ? 1 : 0,
            transition: "opacity 1.1s ease-in-out",
          }}
        />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,.32) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 68%, rgba(0,0,0,.42) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: 16, bottom: 16,
        display: "flex", gap: 6,
      }}>
        {images.map((_, i) => (
          <span key={i} style={{
            width: 18, height: 2,
            background: i === idx ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.35)",
            transition: "background .3s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Placeholder, Spec, SectionHead, Ticker, CareCarousel });
