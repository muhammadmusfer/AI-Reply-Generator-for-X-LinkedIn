const DomUtils = {
  // Wait for an element to appear in the DOM
  waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for element: ${selector}`));
      }, timeout);
    });
  },

  // Insert text into a contenteditable or textarea
  insertText(element, text, shouldAppend = false) {
    if (!element) return;

    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      const start = element.selectionStart;
      const end = element.selectionEnd;
      const val = element.value;
      
      if (shouldAppend) {
        element.value = val + (val ? '\n\n' : '') + text;
      } else {
        element.value = val.substring(0, start) + text + val.substring(end);
      }
      
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (element.isContentEditable) {
      element.focus();
      
      if (!shouldAppend) {
        // Instead of clearing innerHTML which breaks React/Draft.js state,
        // we select all text and let insertText replace it.
        document.execCommand('selectAll', false, null);
      } else {
        // Move caret to end
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        // Add spacing if there is already content
        if (element.innerText.trim().length > 0) {
          text = '\n\n' + text;
        }
      }

      // Use execCommand for better compatibility with platform's internal state
      // though it's deprecated, it's often the only way to trigger the platform's 
      // internal "text changed" events correctly.
      document.execCommand('insertText', false, text);
      
      // Dispatch input event to ensure listeners catch the change
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

window.DomUtils = DomUtils;
