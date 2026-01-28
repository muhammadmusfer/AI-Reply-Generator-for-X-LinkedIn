(function() {
  const LINKEDIN_SELECTORS = {
    postContainer: [
      '.feed-shared-update-v2', 
      '.occludable-update', 
      'div[data-urn]',
      '.feed-shared-update',
      '.scaffold-layout__main article',
      '.feed-shared-update-v2__content',
      '.artdeco-card',
      'article',
      '.artdeco-modal',
      '.pe-hub-post-modal'
    ].join(','),
    postText: [
      '.feed-shared-update-v2__description', 
      '.update-components-text', 
      '.feed-shared-inline-show-more-text',
      '.feed-shared-text',
      '.feed-shared-update-v2__commentary'
    ].join(','),
    author: [
      '.update-components-actor__name', 
      '.feed-shared-actor__name', 
      '.update-components-actor__title',
      '.feed-shared-actor__title',
      '.feed-shared-actor__description'
    ].join(','),
    commentInput: [
      '.ql-editor', 
      'textarea', 
      'div[role="textbox"]', 
      'div[contenteditable="true"]'
    ].join(','),
    commentActionRow: [
      '.comments-comment-box__form-container', 
      '.comments-comment-texteditor', 
      '.share-box__actions',
      '.comments-comment-box',
      '.comments-comment-box__detour-container'
    ].join(',')
  };

  function init() {
    console.log('LinkedIn AI Reply Generator initialized');
    
    // 1. Watch for new posts being added to the DOM (MutationObserver)
    const observer = new MutationObserver((mutations) => {
      if (window._aiReplyDebounce) clearTimeout(window._aiReplyDebounce);
      window._aiReplyDebounce = setTimeout(() => {
        injectButtons();
      }, 500);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 2. Add 'focusin' listener for "Just-in-Time" injection
    // This catches when a user clicks a comment box that we might have missed
    document.addEventListener('focusin', (e) => {
      const target = e.target;
      if (target.matches && target.matches(LINKEDIN_SELECTORS.commentInput)) {
        console.log('User focused a comment input, attempting injection...', target);
        injectButtonForInput(target);
      }
    });

    // Initial injection
    setTimeout(injectButtons, 1000);
  }

  function injectButtons() {
    const inputs = document.querySelectorAll(LINKEDIN_SELECTORS.commentInput);
    // console.log(`Found ${inputs.length} potential comment inputs`);
    
    inputs.forEach(input => {
      injectButtonForInput(input);
    });
  }

  function injectButtonForInput(input) {
    // Avoid re-injecting
    if (input.dataset.aiReplyHasButton === 'true') return;

    // Try to find a good container for the button
    const container = input.closest(LINKEDIN_SELECTORS.commentActionRow) || input.parentElement;

    if (container) {
      // Double check if button already exists in this container
      if (container.querySelector('.ai-reply-gen-btn')) {
        input.dataset.aiReplyHasButton = 'true'; // Mark as done if we see a button
        return;
      }

      console.log('Injecting button for input:', input);

      const btn = UIInjector.createGenerateButton(async (button) => {
        await handleGenerateClick(button, input);
      });

      // Styling
      btn.style.marginRight = '8px';
      btn.style.marginBottom = '8px';
      
      // Ensure flex container behavior if needed
      if (getComputedStyle(container).display === 'flex') {
         btn.style.alignSelf = 'flex-start';
      }

      // Insert at the top of the container
      container.insertBefore(btn, container.firstChild);
      
      // Mark input as having a button
      input.dataset.aiReplyHasButton = 'true';
    } else {
      // console.log('Could not find container for input:', input);
    }
  }

  async function handleGenerateClick(button, input) {
    try {
      UIInjector.setButtonLoading(button, true);

      // 1. Extract post content using a more robust traversal
      let postContainer = input.closest(LINKEDIN_SELECTORS.postContainer);
      
      // Fallback: Check for modal specifically if not found
      if (!postContainer) {
          postContainer = input.closest('.artdeco-modal') || input.closest('.pe-hub-post-modal');
      }

      // Fallback 1: Manual traversal (Relaxed)
      if (!postContainer) {
        let current = input.parentElement;
        let attempts = 0;
        while (current && attempts < 15) { 
          // Check for common post class patterns
          const classList = current.className || '';
          const isPostLike = classList.includes && (
              classList.includes('feed-shared-update') || 
              classList.includes('occludable-update') ||
              classList.includes('urn:li:activity')
          );

          if (isPostLike) {
             postContainer = current;
             console.log('Found post container via class pattern match:', postContainer);
             break;
          }

          const hasAuthor = current.querySelector(LINKEDIN_SELECTORS.author);
          // If we find author, that's good enough to be a container candidate
          if (hasAuthor) {
            postContainer = current;
            console.log('Found post container via author presence:', postContainer);
            break;
          }
          current = current.parentElement;
          attempts++;
        }
      }

      // Fallback 2: Look for any <article> tag
      if (!postContainer) {
        postContainer = input.closest('article');
        if (postContainer) console.log('Found post container via <article> tag fallback');
      }

      // Fallback 3: Extended Blind Scrape
      if (!postContainer) {
         // Go up levels looking for a substantial wrapper
         let blindContainer = input.parentElement;
         let bestCandidate = null;
         
         for (let i = 0; i < 15; i++) {
            if (!blindContainer) break;
            
            // If it has a data-urn, it's likely a post
            if (blindContainer.getAttribute && blindContainer.getAttribute('data-urn')) {
                bestCandidate = blindContainer;
                break;
            }

            // Keep track of the largest text container we see that isn't the whole body
            if (blindContainer.innerText && blindContainer.innerText.length > 100 && blindContainer.tagName !== 'BODY' && blindContainer.tagName !== 'HTML') {
                bestCandidate = blindContainer;
            }

            blindContainer = blindContainer.parentElement;
         }
         
         if (bestCandidate) {
            postContainer = bestCandidate;
            console.warn('Using Blind Scrape fallback container:', postContainer);
         }
      }

      if (!postContainer) {
        // DIAGNOSTIC DUMP
        console.group('--- DEBUG: Post Container Not Found ---');
        console.log('Starting element:', input);
        let curr = input.parentElement;
        let i = 0;
        while(curr && i < 10) {
          console.log(`Parent ${i}: ${curr.tagName.toLowerCase()}.${curr.className ? curr.className.replace(/ /g, '.') : ''}`);
          console.log(`  > Text preview: ${curr.innerText ? curr.innerText.substring(0, 50) : ''}...`);
          curr = curr.parentElement;
          i++;
        }
        console.groupEnd();

        throw new Error('Could not find post container. Please check the console (F12) for the "DEBUG" logs and share them.');
      }

      // Try multiple selectors for text
      let postTextEl = postContainer.querySelector(LINKEDIN_SELECTORS.postText);
      // Try multiple selectors for author
      let authorEl = postContainer.querySelector(LINKEDIN_SELECTORS.author);

      // Initialize postContent
      const postContent = {
        text: '',
        author: authorEl ? authorEl.innerText.trim() : 'Unknown Author',
        platform: 'LinkedIn'
      };

      // Extract Text
      if (postTextEl) {
         postContent.text = postTextEl.innerText.trim();
      } else {
         // Fallback: Grab all text from container
         console.warn('Specific text selector failed. Using generic container text.');
         // cleanup the text a bit to remove the comment box text itself if possible
         let rawText = postContainer.innerText;
         // Remove "Comment" or button text if it appears at the end
         if (rawText.length > 2000) rawText = rawText.substring(0, 2000);
         postContent.text = rawText;
      }
      
      console.log('Extracted post content:', postContent);

      if (!postContent.text) {
         throw new Error('Could not extract any text from the post.');
      }

      // 2. Request reply from background script
      chrome.runtime.sendMessage({
        action: 'generateReply',
        payload: { postContent }
      }, async (response) => {
        UIInjector.setButtonLoading(button, false);

        if (response && response.success) {
          const config = await StorageManager.getConfig();
          
          if (config.autoInsert) {
            DomUtils.insertText(input, response.reply);
          } else {
            UIInjector.showPreviewModal(response.reply, (finalText) => {
              DomUtils.insertText(input, finalText);
            });
          }
        } else {
          alert('Error generating reply: ' + (response ? response.error : 'Unknown error'));
        }
      });

    } catch (error) {
      UIInjector.setButtonLoading(button, false);
      console.error(error);
      alert('Error: ' + error.message);
    }
  }

  init();
})();