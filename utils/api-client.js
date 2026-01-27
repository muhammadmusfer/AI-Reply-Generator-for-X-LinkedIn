const ApiClient = {
  async generateReply(postContent, userConfig) {
    const prompt = PromptBuilder.buildPrompt(postContent, userConfig);
    
    if (userConfig.apiProvider === 'openai') {
      return this.callOpenAI(prompt, userConfig.apiKey);
    } else if (userConfig.apiProvider === 'claude') {
      return this.callClaude(prompt, userConfig.apiKey);
    } else {
      throw new Error('Unsupported API provider');
    }
  },

  async callOpenAI(prompt, apiKey) {
    if (!apiKey) throw new Error('OpenAI API Key is missing');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Good balance of speed and cost
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates social media replies.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to call OpenAI API');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  },

  async callClaude(prompt, apiKey) {
    if (!apiKey) throw new Error('Anthropic API Key is missing');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true' // In background worker this is usually fine
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to call Claude API');
    }

    const data = await response.json();
    return data.content[0].text.trim();
  }
};

if (typeof self !== 'undefined') {
  self.ApiClient = ApiClient;
}
