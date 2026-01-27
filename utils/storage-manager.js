const StorageManager = {
  async getConfig() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('userConfig', (result) => {
        const defaultConfig = typeof self !== 'undefined' && self.DEFAULT_CONFIG ? self.DEFAULT_CONFIG : {};
        resolve(result.userConfig || defaultConfig);
      });
    });
  },

  async saveConfig(config) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ userConfig: config }, () => {
        resolve();
      });
    });
  }
};

// Make it available globally
if (typeof self !== 'undefined') {
  self.StorageManager = StorageManager;
}
