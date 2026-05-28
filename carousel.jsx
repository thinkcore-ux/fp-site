// FLOWERPUNK — animated horizontal carousel
function Carousel({ items }) {
  // duplicate for seamless loop
  const all = items.concat(items);
  return (
    <div className="fp-carousel">
      <div className="fp-carousel-track">
        {all.map((it, i) => (
          <div
            key={i}
            className="fp-carousel-item"
            data-label={it.label}
            style={{ backgroundImage: `url("${it.src}")` }}
          />
        ))}
      </div>
    </div>
  );
}
window.Carousel = Carousel;
