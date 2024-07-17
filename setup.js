(function () {
  var currentScript =
    document.currentScript ||
    (function () {
      return document.getElementsByTagName("script")[
        document.getElementsByTagName("script").length - 1
      ]
    })()

  var shopifyStoreName = currentScript.getAttribute("data-shopify-id")
  // var shopifyAvatarImage =
  //   currentScript.getAttribute("data-avatar-image") === ""
  //     ? "https://i.imgur.com/dfUvzRb.png"
  //     : currentScript.getAttribute("data-avatar-image")
  // var shopifyColor =
  //   currentScript.getAttribute("data-color") === ""
  //     ? "#000000"
  //     : currentScript.getAttribute("data-color")

  if (!shopifyStoreName) {
    console.error("data-shopify-id was not provided.")
    return
  }

  window.RBO = window.RBO || {}
  window.RBO.shopifyStore = shopifyStoreName
  // window.RBO.shopifyAvatarImage = shopifyAvatarImage
  // window.RBO.shopifyColor = shopifyColor

  // console.log("windowRBO", window.RBO)
  // console.log("data-color", currentScript.getAttribute("data-color"))
  // console.log("data-image", currentScript.getAttribute("data-avatar-image"))

  var scriptURL = "https://cdn.jsdelivr.net/gh/ready-bot-one/widget/rbo.js"
  var scriptElement = document.createElement("script")
  scriptElement.src = scriptURL
  scriptElement.onerror = function () {
    console.error("Failed to load the script: " + scriptURL)
  }

  document.head.appendChild(scriptElement)
})();
