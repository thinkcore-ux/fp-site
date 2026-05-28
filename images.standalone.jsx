// FLOWERPUNK — image library (standalone build, resolved via window.__resources)

const R = window.__resources || {};
const FP_IMG = {
  hero: R.imgHero,
  strip: [R.imgStrip0, R.imgStrip1, R.imgStrip2, R.imgStrip3],
  catalog: [R.imgCat0, R.imgCat1, R.imgCat2, R.imgCat3, R.imgCat4, R.imgCat5, R.imgCat6, R.imgCat7],
  portfolio: [R.imgPort0, R.imgPort1, R.imgPort2, R.imgPort3, R.imgPort4, R.imgPort5],
  care: R.imgCare,
};

window.FP_IMG = FP_IMG;
