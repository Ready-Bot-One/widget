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

  /** Parse any of:                                                     *
   *   • "#EA5353"              (hex)                                   *
   *   • "rgb(234,83,83)"       (CSS rgb)                               *
   *   • "rgba(234,83,83,0.7)"  (CSS rgba)                              *
   *   • "166 25 32"            (bare numbers)                          *
   *   • "166 25 32 / 0.7"      (bare numbers + alpha)                  */
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

    /* 2. rgb()/rgba() ------------------------------------------------ */
    const rgbMatch = str.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i)
    if (rgbMatch) return { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] }

    /* 3. "166 25 32"  or  "166 25 32 / 0.7" ------------------------- */
    const nums = str.split(/[ \/]/).filter(Boolean).map(Number)
    if (nums.length >= 3 && nums.slice(0, 3).every((n) => Number.isFinite(n))) {
      const [r, g, b] = nums
      return { r, g, b } // alpha (index 3) is ignored
    }

    throw new Error("Unsupported colour format: " + str)
  }

  /* Lightness tweak via HSL – positive offset darkens, negative lightens */
  function adjustLum({ r, g, b }, offset) {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    l = Math.max(0, Math.min(1, l + offset))

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return { r: r * 255, g: g * 255, b: b * 255 }
  }

  /* Build the 10‑step material‑style palette (50 … 900) */
  function createPalette(base) {
    const baseRgb = parseColour(base)
    const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    const palette = Object.create(null)

    levels.forEach((lv, i) => {
      const offset = (i - 4) * 0.12 // –0.48 … +0.60
      palette[lv] = rgbHex(adjustLum(baseRgb, offset))
    })

    return palette
  }

  /* ------------------------------------------------------------------
   * 2.  Load bundle, then initialise the widget
   * ------------------------------------------------------------------ */
  var vf = d.createElement(t),
    first = d.getElementsByTagName(t)[0]

  vf.onload = function () {
    const baseColour = window.RBO?.shopifyColor || "#EA5353"
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
