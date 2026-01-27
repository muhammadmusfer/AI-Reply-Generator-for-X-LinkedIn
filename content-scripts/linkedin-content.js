(function() {
  const LINKEDIN_SELECTORS = {
    postContainer: '.feed-shared-update-v2, .up-feed-item',
    postText: '.feed-shared-update-v2__description, .update-components-text',
    author: '.update-components-actor__name, .feed-shared-actor__name',
    commentInput: '.ql-editor, textarea',
    commentActionRow: '.comments-comment-box__form-container, .comments-comment-texteditor'
  };

  function init() {
    console.log('LinkedIn AI Reply Generator initialized');
    
    // Watch for new posts being added to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          injectButtons();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial injection
    injectButtons();
  }

  function injectButtons() {
    // Find all comment boxes that don't have our button yet
    const commentBoxes = document.querySelectorAll(LINKEDIN_SELECTORS.commentActionRow);
    
    commentBoxes.forEach(box => {
      if (box.querySelector('.ai-reply-gen-btn')) return;

      const btn = UIInjector.createGenerateButton(async (button) => {
        await handleGenerateClick(button, box);
      });
      
      // Inject at the top of the comment box or near it
      box.prepend(btn);
    });
  }

  async function handleGenerateClick(button, commentBox) {
    try {
      UIInjector.setButtonLoading(button, true);

      // 1. Extract post content
      const postContainer = commentBox.closest(LINKEDIN_SELECTORS.postContainer);
      if (!postContainer) {
        throw new Error('Could not find post container');
      }

      const postTextEl = postContainer.querySelector(LINKEDIN_SELECTORS.postText);
      const authorEl = postContainer.querySelector(LINKEDIN_SELECTORS.author);

      const postContent = {
        text: postTextEl ? postTextEl.innerText.trim() : '',
        author: authorEl ? authorEl.innerText.trim() : 'Unknown',
        platform: 'LinkedIn'
      };

      if (!postContent.text) {
        throw new Error('Could not extract post text');
      }

      // 2. Request reply from background script
      chrome.runtime.sendMessage({
        action: 'generateReply',
        payload: { postContent }
      }, async (response) => {
        UIInjector.setButtonLoading(button, false);

        if (response && response.success) {
          const config = await StorageManager.getConfig();
          const targetInput = commentBox.querySelector(LINKEDIN_SELECTORS.commentInput);

          if (config.autoInsert) {
            DomUtils.insertText(targetInput, response.reply);
          } else {
            UIInjector.showPreviewModal(response.reply, (finalText) => {
              DomUtils.insertText(targetInput, finalText);
            });
          }
        } else {
          alert('Error generating reply: ' + (response ? response.error : 'Unknown error'));
        }
      });

    } catch (error) {
      UIInjector.setButtonLoading(button, false);
      alert('Error: ' + error.message);
    }
  }

  init();
})();
