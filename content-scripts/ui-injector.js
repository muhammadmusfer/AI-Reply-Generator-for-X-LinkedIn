const UIInjector = {
  createGenerateButton(onClick) {
    const btn = document.createElement('button');
    btn.className = 'ai-reply-gen-btn';
    btn.innerHTML = '<span class="ai-icon">✨</span> Generate Reply';
    btn.type = 'button';
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(btn);
    };
    return btn;
  },

  setButtonLoading(btn, isLoading) {
    if (isLoading) {
      btn.disabled = true;
      btn.classList.add('loading');
      btn._originalText = btn.innerHTML;
      btn.innerHTML = '<span class="ai-spinner"></span> Generating...';
    } else {
      btn.disabled = false;
      btn.classList.remove('loading');
      btn.innerHTML = btn._originalText || '<span class="ai-icon">✨</span> Generate Reply';
    }
  },

  showPreviewModal(replyText, onInsert, onEdit) {
    // Remove existing modal if any
    const existing = document.getElementById('ai-reply-modal-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'ai-reply-modal-container';
    
    container.innerHTML = `
      <div class="ai-modal-overlay"></div>
      <div class="ai-modal-content">
        <div class="ai-modal-header">
          <h3>Generated Reply</h3>
          <button class="ai-close-btn">&times;</button>
        </div>
        <div class="ai-modal-body">
          <textarea id="ai-reply-preview-text">${replyText}</textarea>
        </div>
        <div class="ai-modal-footer">
          <button class="ai-btn-secondary ai-edit-btn">Cancel</button>
          <button class="ai-btn-primary ai-insert-btn">Insert Reply</button>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    const modal = container.querySelector('.ai-modal-content');
    const textarea = container.querySelector('#ai-reply-preview-text');
    const insertBtn = container.querySelector('.ai-insert-btn');
    const closeBtn = container.querySelector('.ai-close-btn');
    const cancelBtn = container.querySelector('.ai-edit-btn');

    const closeModal = () => container.remove();

    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    
    insertBtn.onclick = () => {
      onInsert(textarea.value);
      closeModal();
    };

    // Close on overlay click
    container.querySelector('.ai-modal-overlay').onclick = closeModal;
  }
};

window.UIInjector = UIInjector;
