// FLOWERPUNK — pricing calculator

const FP_CALC = {
  COMPS:   [1, 3, 5, 10, "10+"],
  VISITS:  [1, 2, 3],
  SIZES:   ["S", "M", "L", "XL"],

  // base price per single arrangement, per visit, in ₽
  sizePrice: { S: 1800, M: 4200, L: 8500, XL: 16000 },
  sizeLabel: { S: "Маленькие", M: "Средние", L: "Большие", XL: "Крупные / инсталляции" },
  sizeHint:  { S: "до 25 см",  M: "30–45 см", L: "50–80 см", XL: "от 90 см" },

  // multiplier on per-visit cost: more visits → lower per-visit price
  visitsFactor: { 1: 1.00, 2: 0.94, 3: 0.88 },

  // multiplier on per-composition cost: more comps → lower per-comp price
  countFactor: { 1: 1.00, 3: 0.96, 5: 0.93, 10: 0.88, "10+": 0.82 },
};

function fpCalcWeekly({ count, visits, size }) {
  const base   = FP_CALC.sizePrice[size];
  const n      = count === "10+" ? 12 : count;
  const vf     = FP_CALC.visitsFactor[visits];
  const cf     = FP_CALC.countFactor[count];
  return Math.round(base * n * visits * vf * cf);
}

function fpFmtRub(n) {
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

function pluralize(n, forms) {
  // ru plural: forms = [one, few, many]
  if (typeof n !== "number") return forms[2];
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

function Calculator({ c }) {
  const [count, setCount]     = React.useState(5);
  const [visits, setVisits]   = React.useState(1);
  const [size, setSize]       = React.useState("M");
  const [vases, setVases]     = React.useState(false);
  const [custom, setCustom]   = React.useState(false);
  const [open, setOpen]       = React.useState(false);

  const weekly  = React.useMemo(() => fpCalcWeekly({ count, visits, size }), [count, visits, size]);
  const numComps = count === "10+" ? 12 : count;
  const vasesCost = vases ? numComps * 999 : 0;
  const monthly = Math.round(weekly * 4.33) + vasesCost;
  const half    = Math.round(monthly * 6 * 0.9);
  const year    = Math.round(monthly * 12 * 0.75);
  const prefix  = count === "10+" ? "от " : "";

  return (
    <section id="tiers" className="fp-container fp-section">
      <SectionHead eyebrow={c.tiers_eyebrow} title={c.tiers_title} />

      <div className="fp-calc-mode" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={!custom}
          className={"fp-calc-mode-btn" + (!custom ? " is-active" : "")}
          onClick={() => setCustom(false)}>
          По параметрам
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={custom}
          className={"fp-calc-mode-btn" + (custom ? " is-active" : "")}
          onClick={() => setCustom(true)}>
          Индивидуальный расчёт
        </button>
      </div>

      <div className="fp-calc" data-mode={custom ? "custom" : "auto"}>

        <div className="fp-calc-body">
          {/* LEFT — controls */}
          <div className="fp-calc-controls">
            <StopSlider
              label="Композиций в зале"
              hint="штук"
              stops={FP_CALC.COMPS}
              value={count}
              onChange={setCount}
              disabled={custom}
              format={(v) => String(v)}
            />
            <StopSlider
              label="Визитов флориста в неделю"
              hint={visits === 1 ? "раз" : "раза"}
              stops={FP_CALC.VISITS}
              value={visits}
              onChange={setVisits}
              disabled={custom}
              format={(v) => String(v)}
            />
            <StopSlider
              label="Размер композиций"
              hint={FP_CALC.sizeHint[size]}
              stops={FP_CALC.SIZES}
              value={size}
              onChange={setSize}
              disabled={custom}
              format={(v) => v}
            />

            <label className={"fp-vase-toggle" + (custom ? " is-disabled" : "") + (vases ? " is-on" : "")}>
              <input
                type="checkbox"
                checked={vases}
                disabled={custom}
                onChange={(e) => setVases(e.target.checked)}
              />
              <span className="fp-vase-box" aria-hidden="true">
                <span className="fp-vase-tick">✓</span>
              </span>
              <span className="fp-vase-copy">
                <span className="fp-vase-title">Нужны вазы в аренду</span>
                <span className="fp-vase-hint mono">+999 ₽ / месяц за вазу · 1 ваза = 1 композиция</span>
              </span>
            </label>
          </div>

          {/* RIGHT — readout */}
          <aside className="fp-calc-readout">
            {custom ? (
              <div className="fp-calc-custom">
                <div className="mono fp-calc-readout-eyebrow">Индивидуальная смета</div>
                <h3 className="display fp-calc-custom-h">
                  Нужен&nbsp;другой<br />формат?
                </h3>
                <p className="fp-calc-custom-lede">
                  Опишите задачу — гастроужин на 200 персон, открытие, нестандартный зал, экзотические сорта.
                  Шеф-флорист соберёт концепцию и смету в течение 2 рабочих дней.
                </p>
                <ul className="fp-calc-custom-list">
                  <li><span className="mono">◇</span> Бесплатный визит флориста</li>
                  <li><span className="mono">◇</span> Концепция от шеф-флориста</li>
                  <li><span className="mono">◇</span> Прозрачная постатейная смета</li>
                </ul>
                <button type="button" className="fp-cta fp-cta--accent fp-calc-cta" onClick={() => setOpen(true)}>
                  <span>Запросить расчёт</span><span>→</span>
                </button>
              </div>
            ) : (
              <>
                <div className="mono fp-calc-readout-eyebrow">Расчёт обслуживания</div>
                <div className="fp-calc-price-main">
                  <div className="mono fp-calc-price-k">В месяц</div>
                  <div className="fp-calc-price-v">{prefix}{fpFmtRub(monthly)}</div>
                </div>
                <div className="fp-calc-price-grid">
                  <div className="fp-calc-price-cell">
                    <div className="mono fp-calc-price-k">В неделю</div>
                    <div className="fp-calc-price-v-sm">{prefix}{fpFmtRub(weekly)}</div>
                  </div>
                  <div className="fp-calc-price-cell">
                    <div className="mono fp-calc-price-k">
                      6 месяцев <span className="fp-calc-price-disc">−10%</span>
                    </div>
                    <div className="fp-calc-price-v-sm">{prefix}{fpFmtRub(half)}</div>
                  </div>
                  <div className="fp-calc-price-cell">
                    <div className="mono fp-calc-price-k">
                      Год <span className="fp-calc-price-disc">−25%</span>
                    </div>
                    <div className="fp-calc-price-v-sm">{prefix}{fpFmtRub(year)}</div>
                  </div>
                </div>
                <div className="fp-calc-summary mono-sm">
                  {count} {count === "10+" ? "композиций" : pluralize(count, ["композиция", "композиции", "композиций"])} · {FP_CALC.sizeLabel[size].toLowerCase()} · {visits} {pluralize(visits, ["визит", "визита", "визитов"])} в неделю{vases ? " · вазы в аренду ×" + numComps : ""}
                </div>
                <button type="button" className="fp-cta fp-cta--accent fp-calc-cta" onClick={() => setOpen(true)}>
                  <span>Оставить заявку</span><span>→</span>
                </button>
                <div className="mono-sm fp-calc-foot">
                  Цены ориентировочные. Точная смета — после визита флориста.
                </div>
              </>
            )}
          </aside>
        </div>
      </div>

      <SectionHead eyebrow={c.inside_eyebrow} small />
      <ol className="fp-inside-list">
        {c.inside_steps.map((s, i) => (
          <li key={i} className="fp-inside-row">
            <div className="display fp-inside-row-num">{s.n}</div>
            <div className="fp-inside-row-body">
              <h3 className="display fp-inside-row-title">{s.t}</h3>
              <p className="fp-inside-row-desc">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      {open && (
        <RequestModal
          onClose={() => setOpen(false)}
          custom={custom}
          summary={{ count, visits, size, vases, weekly, monthly, half, year, prefix }}
        />
      )}
    </section>
  );
}

/* ---------- stop slider ---------- */

function StopSlider({ num, label, hint, stops, value, onChange, disabled, format }) {
  const trackRef = React.useRef(null);
  const idx = stops.indexOf(value);
  const pct = stops.length > 1 ? (idx / (stops.length - 1)) * 100 : 0;

  const setFromX = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const i = Math.round(p * (stops.length - 1));
    if (stops[i] !== value) onChange(stops[i]);
  };

  const onPointerDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    trackRef.current.setPointerCapture(e.pointerId);
    setFromX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (disabled) return;
    if (e.buttons & 1) setFromX(e.clientX);
  };
  const onKey = (e) => {
    if (disabled) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown")  { e.preventDefault(); if (idx > 0) onChange(stops[idx-1]); }
    if (e.key === "ArrowRight"|| e.key === "ArrowUp")    { e.preventDefault(); if (idx < stops.length-1) onChange(stops[idx+1]); }
  };

  return (
    <div className={"fp-slider" + (disabled ? " is-disabled" : "")}>
      <div className="fp-slider-head">
        <span className="fp-slider-label">{label}</span>
        <span className="fp-slider-value">
          {format(value)} <span className="fp-slider-hint">{hint}</span>
        </span>
      </div>
      <div
        ref={trackRef}
        className="fp-slider-track"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={0}
        aria-valuemax={stops.length - 1}
        aria-valuenow={idx}
        aria-valuetext={String(value)}
        aria-disabled={disabled}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKey}
      >
        <div className="fp-slider-rail"></div>
        <div className="fp-slider-fill" style={{ width: pct + "%" }}></div>
        {stops.map((s, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            className={"fp-slider-stop" + (i <= idx ? " is-past" : "") + (i === idx ? " is-active" : "")}
            style={{ left: (i / (stops.length - 1)) * 100 + "%" }}
            onClick={(e) => { e.stopPropagation(); if (!disabled) onChange(s); }}
            aria-label={String(s)}
          />
        ))}
        <div className="fp-slider-handle" style={{ left: pct + "%" }}>
          <div className="fp-slider-handle-dot"></div>
        </div>
      </div>
      <div className="fp-slider-ticks">
        {stops.map((s, i) => (
          <span
            key={i}
            className={"fp-slider-tick" + (i === idx ? " is-active" : "")}
            style={{ left: (i / (stops.length - 1)) * 100 + "%" }}
          >{format(s)}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- request modal ---------- */

function RequestModal({ onClose, custom, summary }) {
  const [contact, setContact] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const kind = /@/.test(contact) ? "email" : /[\d+]/.test(contact) ? "phone" : "auto";
  const valid = contact.trim().length >= 5;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitted(true);
  };

  return (
    <div className="fp-modal-backdrop" onClick={onClose}>
      <div className="fp-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="fp-modal-close" onClick={onClose} aria-label="Закрыть">×</button>

        {submitted ? (
          <div className="fp-modal-body fp-modal-thanks">
            <div className="mono fp-modal-eyebrow">Заявка отправлена</div>
            <h3 className="display fp-modal-title">Спасибо.<br />Свяжемся в течение&nbsp;1 рабочего дня.</h3>
            <p className="fp-modal-lede">
              Флорист напишет на <b>{contact}</b> и согласует бесплатный визит.
            </p>
            <button type="button" className="fp-cta" onClick={onClose}>Закрыть</button>
          </div>
        ) : (
          <div className="fp-modal-body">
            <div className="mono fp-modal-eyebrow">{custom ? "Индивидуальный расчёт" : "Заявка на подписку"}</div>
            <h3 className="display fp-modal-title">
              {custom ? <>Опишем<br />под вас.</> : <>Один шаг<br />до сметы.</>}
            </h3>

            {/* summary */}
            <div className="fp-modal-summary">
              {custom ? (
                <div className="fp-modal-summary-custom">
                  <div className="mono fp-modal-summary-k">Формат</div>
                  <div className="fp-modal-summary-v">Индивидуальная концепция и смета</div>
                </div>
              ) : (
                <>
                  <div className="fp-modal-chips">
                    <span className="fp-chip">{summary.count} {summary.count === "10+" ? "композиций" : pluralize(summary.count, ["композиция", "композиции", "композиций"])}</span>
                    <span className="fp-chip">{summary.visits} {pluralize(summary.visits, ["визит", "визита", "визитов"])} в неделю</span>
                    <span className="fp-chip">{FP_CALC.sizeLabel[summary.size]}</span>
                    {summary.vases ? <span className="fp-chip fp-chip--accent">+вазы в аренду</span> : null}
                  </div>
                  <div className="fp-modal-price-row">
                    <div>
                      <div className="mono fp-modal-summary-k">В месяц</div>
                      <div className="fp-modal-price">{summary.prefix}{fpFmtRub(summary.monthly)}</div>
                    </div>
                    <div className="fp-modal-price-aux">
                      <div className="mono-sm">Год · −25%</div>
                      <div className="fp-modal-price-aux-v">{summary.prefix}{fpFmtRub(summary.year)}</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <form onSubmit={submit} className="fp-modal-form">
              <label className="fp-input-label" htmlFor="fp-contact">Телефон или email</label>
              <input
                id="fp-contact"
                className="fp-input"
                placeholder="+7 ___ ___ __ __  ·  you@bistro.ru"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                autoFocus
              />
              <div className="mono-sm fp-modal-kind">
                {kind === "email" && "→ напишем на email"}
                {kind === "phone" && "→ позвоним или напишем в telegram"}
                {kind === "auto"  && "достаточно одного — телефон или email"}
              </div>
              <button
                type="submit"
                disabled={!valid}
                className="fp-cta fp-cta--accent fp-modal-submit"
              >
                <span>{custom ? "Запросить расчёт" : "Оставить заявку"}</span><span>→</span>
              </button>
              <div className="mono-sm fp-modal-foot">
                Отправляя, вы соглашаетесь с обработкой персональных данных. Без спама.
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Calculator });
