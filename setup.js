(function () {
  var currentScript =
    document.currentScript ||
    (function () {
      return document.getElementsByTagName("script")[
        document.getElementsByTagName("script").length - 1
      ]
    })()

  var shopifyStoreName = currentScript.getAttribute("data-shopify-id")
  var shopifyAvatarImage =
    currentScript.getAttribute("data-avatar-image") ??
    "https://i.imgur.com/dfUvzRb.png"
  var shopifyColor = currentScript.getAttribute("data-color") ?? "#A1BB58"
  if (!shopifyStoreName) {
    console.error("data-shopify-id was not provided.")
    return
  }

  window.RBO = window.RBO || {}
  window.RBO.shopifyStore = shopifyStoreName
  window.RBO.shopifyAvatarImage = shopifyAvatarImage
  window.RBO.shopifyColor = shopifyColor
 console.log("windowRBO", window.RBO)
  var scriptURL = "https://cdn.jsdelivr.net/gh/ready-bot-one/widget/rbo.js"
  var scriptElement = document.createElement("script")
  scriptElement.src = scriptURL
  scriptElement.onerror = function () {
    console.error("Failed to load the script: " + scriptURL)
  }

  document.head.appendChild(scriptElement)
})();
