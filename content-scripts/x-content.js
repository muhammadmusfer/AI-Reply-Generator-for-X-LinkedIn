(function() {
  const X_SELECTORS = {
    tweetContainer: 'article[data-testid="tweet"]',
    tweetText: 'div[data-testid="tweetText"]',
    author: 'div[data-testid="User-Names"]',
    replyInput: 'div[data-testid="tweetTextarea_0"], div[role="textbox"]',
    toolbar: 'div[data-testid="toolBar"]'
  };

  function init() {
    console.log('X AI Reply Generator initialized');
    
    const observer = new MutationObserver(() => {
      injectButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    injectButtons();
  }

  function injectButtons() {
    // On X, we usually want to inject near the reply toolbar
    const toolbars = document.querySelectorAll(X_SELECTORS.toolbar);
    
    if (toolbars.length > 0) {
      console.log(`Found ${toolbars.length} toolbars on X`);
    }

    toolbars.forEach(toolbar => {
      if (toolbar.querySelector('.ai-reply-gen-btn')) return;

      // Ensure we are in a reply context (there's a textbox nearby)
      const container = toolbar.closest('div[data-testid="reply"], div[role="group"], article');
      if (!container) return;

      console.log('Injecting AI button into X toolbar');
      const btn = UIInjector.createGenerateButton(async (button) => {
        console.log('Generate button clicked on X');
        await handleGenerateClick(button, toolbar);
      });
      
      // Style it slightly differently for X to fit better
      btn.style.margin = '0 8px';
      btn.style.padding = '2px 10px';
      btn.style.fontSize = '12px';
      btn.style.borderRadius = '12px';
      btn.style.borderColor = '#1d9bf0';
      btn.style.color = '#1d9bf0';
      btn.style.backgroundColor = 'transparent';

      // Insert before the first item in toolbar
      toolbar.prepend(btn);
    });
  }

  async function handleGenerateClick(button, toolbar) {
    try {
      UIInjector.setButtonLoading(button, true);

      // 1. Extract tweet content
      // On X, the toolbar we found is usually for a reply. 
      // We need to find the tweet we are replying to.
      // If we are in a modal, it's easier. If in-line, we look up.
      let tweetContainer = toolbar.closest(X_SELECTORS.tweetContainer);
      
      // If not in a tweet container (e.g., in a "reply" compose area), 
      // look for the tweet just above it
      if (!tweetContainer) {
        const modal = toolbar.closest('div[aria-modal="true"]');
        if (modal) {
          tweetContainer = modal.querySelector(X_SELECTORS.tweetContainer);
        } else {
          // Look for the article before this compose area
          const composeArea = toolbar.closest('div[role="group"]');
          if (composeArea) {
            tweetContainer = composeArea.previousElementSibling?.closest(X_SELECTORS.tweetContainer) || 
                           composeArea.parentElement?.querySelector(X_SELECTORS.tweetContainer);
          }
        }
      }

      if (!tweetContainer) {
        throw new Error('Could not find tweet content. Make sure you are replying to a tweet.');
      }

      const tweetTextEl = tweetContainer.querySelector(X_SELECTORS.tweetText);
      const authorEl = tweetContainer.querySelector(X_SELECTORS.author);

      const postContent = {
        text: tweetTextEl ? tweetTextEl.innerText.trim() : '',
        author: authorEl ? authorEl.innerText.split('\n')[0] : 'Unknown',
        platform: 'X/Twitter'
      };

      if (!postContent.text) {
        throw new Error('Could not extract tweet text');
      }

      if (!chrome?.runtime?.sendMessage) {
        throw new Error('Extension context invalidated. Please refresh the page.');
      }

      // 2. Request reply
      chrome.runtime.sendMessage({
        action: 'generateReply',
        payload: { postContent }
      }, async (response) => {
        UIInjector.setButtonLoading(button, false);

        if (response && response.success) {
          const config = await StorageManager.getConfig();
          // Find the input field relative to the toolbar
          const composeArea = toolbar.closest('div[role="group"]') || toolbar.parentElement.parentElement;
          const targetInput = composeArea.querySelector(X_SELECTORS.replyInput);

          const typeResponse = async (text) => {
             if (targetInput.tagName === 'TEXTAREA' || targetInput.tagName === 'INPUT') {
                targetInput.select();
             } else if (targetInput.isContentEditable) {
                targetInput.focus();
                document.execCommand('selectAll', false, null);
             }
             await DomUtils.simulateTyping(targetInput, text);
          };

          if (config.autoInsert) {
            await typeResponse(response.reply);
          } else {
            UIInjector.showPreviewModal(response.reply, async (finalText) => {
               await typeResponse(finalText);
            });
          }
        } else {
          alert('Error: ' + (response ? response.error : 'Unknown error'));
        }
      });

    } catch (error) {
      UIInjector.setButtonLoading(button, false);
      if (error.message.includes('Extension context invalidated') || 
          error.message.includes('Cannot read properties of undefined') ||
          error.message.includes('null is not an object')) {
        alert('Extension updated. Please refresh the page to continue.');
      } else {
        alert('Error: ' + error.message);
      }
    }
  }

  init();
})();
