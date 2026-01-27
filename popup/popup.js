document.addEventListener('DOMContentLoaded', async () => {
  const apiProvider = document.getElementById('apiProvider');
  const apiKey = document.getElementById('apiKey');
  const togglePassword = document.getElementById('togglePassword');
  const tone = document.getElementById('tone');
  const includeEmojis = document.getElementById('includeEmojis');
  const autoInsert = document.getElementById('autoInsert');
  const personalContext = document.getElementById('personalContext');
  const charCount = document.getElementById('charCount');
  const saveBtn = document.getElementById('saveBtn');
  const statusMessage = document.getElementById('statusMessage');

  // Load current config
  const config = await StorageManager.getConfig();
  
  apiProvider.value = config.apiProvider;
  apiKey.value = config.apiKey;
  tone.value = config.tone;
  includeEmojis.checked = config.includeEmojis;
  autoInsert.checked = config.autoInsert;
  personalContext.value = config.personalContext;
  
  const lengthRadios = document.getElementsByName('length');
  lengthRadios.forEach(radio => {
    if (radio.value === config.length) {
      radio.checked = true;
    }
  });

  updateCharCount();

  // Toggle password visibility
  togglePassword.addEventListener('click', () => {
    const type = apiKey.getAttribute('type') === 'password' ? 'text' : 'password';
    apiKey.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
  });

  // Character count for context
  personalContext.addEventListener('input', updateCharCount);

  function updateCharCount() {
    const count = personalContext.value.length;
    charCount.textContent = `${count}/500`;
    if (count > 500) {
      charCount.style.color = 'red';
    } else {
      charCount.style.color = '#888';
    }
  }

  // Save config
  saveBtn.addEventListener('click', async () => {
    const selectedLength = Array.from(lengthRadios).find(r => r.checked)?.value || 'medium';
    
    const newConfig = {
      apiProvider: apiProvider.value,
      apiKey: apiKey.value,
      tone: tone.value,
      length: selectedLength,
      includeEmojis: includeEmojis.checked,
      autoInsert: autoInsert.checked,
      personalContext: personalContext.value.substring(0, 500),
      linkedinEnabled: true, // Defaulting to true for now
      xEnabled: true
    };

    await StorageManager.saveConfig(newConfig);
    
    showStatus('Settings saved successfully!', 'success');
  });

  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = '';
    }, 3000);
  }
});
