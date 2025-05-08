;(function (d, t) {
  /* ------------------------------------------------------------------
   * 1. Colour‑utility helpers
   * ------------------------------------------------------------------ */
  const toHex = (n) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0")
  const rgbToHex = ({ r, g, b }) =>
    `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()

  // Parse '#rrggbb' or 'rgb() / rgba()' → { r, g, b }
  function parseColour(str) {
    str = str.trim()
    if (/^#?[0-9a-f]{6}$/i.test(str)) {
      const h = str.replace("#", "")
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
      }
    }
    const m = str.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i)
    if (m) return { r: +m[1], g: +m[2], b: +m[3] }

    throw new Error("Unsupported colour format: " + str)
  }

  // Lightness tweak via HSL
  function adjustLum({ r, g, b }, offset) {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h = 0
    let s = 0
    let l = (max + min) / 2

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
    l = Math.min(1, Math.max(0, l + offset))
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    if (s === 0) r = g = b = l
    else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }
    return {
      r: r * 255,
      g: g * 255,
      b: b * 255,
    }
  }

  // Build 50‑→ 900 palette
  function createPalette(base) {
    const baseRgb = parseColour(base)
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    const palette = {}
    steps.forEach((lv, i) => {
      const offset = (i - 4) * 0.12 // –0.48 … +0.60
      palette[lv] = rgbToHex(adjustLum(baseRgb, offset))
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
