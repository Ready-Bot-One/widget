;(function (d, t) {
  var v = d.createElement(t),
    s = d.getElementsByTagName(t)[0]
  v.onload = function () {
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
        color: `${window.RBO.shopifyColor}`,
        banner: {
          hide: false,
          imageUrl: `${window.RBO.shopifyAvatarImage}`,
        },
        avatar: {
          hide: false,
          imageUrl: `${window.RBO.shopifyAvatarImage}`,
        },
        stylesheet: "https://cdn.jsdelivr.net/gh/ready-bot-one/widget/rbo.css",
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
  v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"
  v.type = "text/javascript"
  s.parentNode.insertBefore(v, s)
})(document, "script")
