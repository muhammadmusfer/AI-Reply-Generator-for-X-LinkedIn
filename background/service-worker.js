// Import utilities
importScripts('../utils/constants.js', '../utils/storage-manager.js', '../utils/prompt-builder.js', '../utils/api-client.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateReply') {
    handleGenerateReply(request.payload)
      .then(reply => sendResponse({ success: true, reply }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
});

async function handleGenerateReply(payload) {
  const { postContent } = payload;
  const userConfig = await StorageManager.getConfig();
  
  if (!userConfig.apiKey) {
    throw new Error('API Key is not configured. Please open the extension settings to add your API key.');
  }

  return await ApiClient.generateReply(postContent, userConfig);
}
