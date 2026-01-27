const DEFAULT_CONFIG = {
  apiKey: '',
  apiProvider: 'openai',
  tone: 'professional',
  length: 'medium',
  personalContext: '',
  linkedinEnabled: true,
  xEnabled: true,
  autoInsert: false,
  includeEmojis: true
};

const ACTIONS = {
  GENERATE_REPLY: 'generateReply',
  GET_CONFIG: 'getConfig'
};

if (typeof self !== 'undefined') {
  self.DEFAULT_CONFIG = DEFAULT_CONFIG;
  self.ACTIONS = ACTIONS;
}