(function () {
    var currentScript = document.currentScript || (function () {
        return document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1];
    })();

    var shopifyStoreName = currentScript.getAttribute('data-shopify-id');
    if (!shopifyStoreName) {
        console.error('data-shopify-id was not provided.');
        return;
    }

    window.RBO = window.RBO || {};
    window.RBO.shopifyStore = shopifyStoreName;

    var scriptURL = "https://cdn.jsdelivr.net/gh/ready-bot-one/widget/rbo.js";
    var scriptElement = document.createElement('script');
    scriptElement.src = scriptURL;
    scriptElement.onerror = function () {
        console.error('Failed to load the script: ' + scriptURL);
    };

    document.head.appendChild(scriptElement);
})();
