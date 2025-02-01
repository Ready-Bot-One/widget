;;(function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        window.voiceflow.chat.load({
          verify: { projectID: 'XXX' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          assistant: {
            persistence: 'memory',
            color: `${window.RBO.shopifyColor}`,
            image: `${window.RBO.shopifyAvatarImage}`,
            avatar: `${window.RBO.shopifyAvatarImage}`,
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
        });
      }
      v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; 
      v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
    })(document, 'script');




  
