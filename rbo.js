;(function (d, t) {
  /* ──────────────────────────────────────────────── *
   *  1.  Colour utilities
   * ──────────────────────────────────────────────── */

  const toHex = (n) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0")

  const rgbHex = (rgb) =>
    `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase()

  /** Parse any of:
   *   • "#EA5353"              (hex)
   *   • "rgb(234,83,83)"       (CSS rgb)
   *   • "rgba(234,83,83,0.7)"  (CSS rgba)
   *   • "166 25 32"            (bare numbers)
   *   • "166 25 32 / 0.7"      (bare numbers + alpha)
   */
  function parseColour(str) {
    str = str.trim()

    /* 1. #rrggbb ---------------------------------------------------- */
    if (/^#?[0-9a-f]{6}$/i.test(str)) {
      const h = str.replace("#", "")

      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
      }
    }

    /* 2. rgb()/rgba() ---------------------------------------------- */
    const rgbMatch = str.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i)
    if (rgbMatch) return { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] }

    /* 3. "166 25 32"  or  "166 25 32 / 0.7" ------------------------ */
    const nums = str.split(/[ \/]/).filter(Boolean).map(Number)
    if (nums.length >= 3 && nums.slice(0, 3).every((n) => Number.isFinite(n))) {
      const [r, g, b] = nums
      return { r, g, b } // alpha (index 3) is ignored
    }

    throw new Error("Unsupported colour format: " + str)
  }

  /* --------------------------------------------------------------- *
   * Helpers for building the material‑style 10‑step palette
   * --------------------------------------------------------------- */

  /* Linear‑blend two RGB colours by t (0–1) */
  const blend = (c1, c2, t) => ({
    r: c1.r + (c2.r - c1.r) * t,
    g: c1.g + (c2.g - c1.g) * t,
    b: c1.b + (c2.b - c1.b) * t,
  })

  /* Build the 10‑step material‑style palette (50 … 900) */
  function createPalette(base) {
    const baseRgb = parseColour(base)
    const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

    /*                50    100    200    300    400   500   600   700   800   900  */
    const mixing = [
      0.899, 0.797, 0.589, 0.385, 0.18, 0.0, 0.215, 0.408, 0.605, 0.799,
    ]

    const palette = Object.create(null)
    const white = { r: 255, g: 255, b: 255 }
    const black = { r: 0, g: 0, b: 0 }

    levels.forEach((lv, i) => {
      const t = mixing[i]
      const rgb =
        lv < 500
          ? blend(baseRgb, white, t)
          : lv > 500
          ? blend(baseRgb, black, t)
          : baseRgb // 500 – the original colour

      palette[lv] = rgbHex(rgb)
    })

    return palette
  }

  /* ------------------------------------------------------------------
   * 2.  Load bundle, then initialise the widget
   * ------------------------------------------------------------------ */
  var vf = d.createElement(t),
    first = d.getElementsByTagName(t)[0]

  vf.onload = function () {
    const baseColour = window.RBO?.shopifyColor || "#A0C144"
    const palette = createPalette(baseColour)

    window.RBO.shopifyPalette = palette

    window.voiceflow.chat.load({
      verify: { projectID: "65d930a9e996d1330850cd32" },
      url: "https://proxy.readybotone.io",
      versionID: "production",
      renderMode: "widget",
      assistant: {
        persistence: "memory",
        header: {
          hideImage: false,
          imageUrl: window.RBO.shopifyAvatarImage,
        },
        banner: {
          hide: false,
          imageUrl: window.RBO.shopifyAvatarImage,
        },
        avatar: {
          hide: false,
          imageUrl: window.RBO.shopifyAvatarImage,
        },
        stylesheet: "https://cdn.jsdelivr.net/gh/ready-bot-one/widget/rbo.css",
        color: baseColour,
        palette: palette,
      },

      launch: {
        event: {
          type: "launch",
          payload: {
            shopify_store: window.RBO.shopifyStore,
          },
        },
      },
    })
  }

  vf.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"
  vf.type = "text/javascript"
  first.parentNode.insertBefore(vf, first)
})(document, "script")
