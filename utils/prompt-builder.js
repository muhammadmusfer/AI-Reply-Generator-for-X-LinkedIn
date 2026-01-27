const PromptBuilder = {
  buildPrompt(postContent, userConfig) {
    const toneInstructions = {
      professional: "Use business-appropriate language, focus on insights and expertise. Be respectful and constructive.",
      casual: "Use conversational language, like talking to a friend. Be relaxed and friendly.",
      enthusiastic: "Show genuine excitement and positive energy. Use high-energy words.",
      thoughtful: "Provide nuanced perspective and ask thought-provoking questions. Show deep engagement.",
      supportive: "Offer encouragement and constructive feedback. Be kind and validating."
    };

    const lengthInstructions = {
      concise: "Keep it to 1-2 short sentences.",
      medium: "Keep it to 2-4 sentences.",
      detailed: "Provide a detailed response of 4-6 sentences."
    };

    return `You are generating a ${userConfig.tone} reply to a social media post on ${postContent.platform}.

POST CONTENT:
"${postContent.text}"

AUTHOR: ${postContent.author}
PLATFORM: ${postContent.platform}

USER CONTEXT (About the person replying):
${userConfig.personalContext || "A professional user interested in meaningful engagement."}

INSTRUCTIONS:
- Tone: ${userConfig.tone}. ${toneInstructions[userConfig.tone] || ""}
- Length: ${userConfig.length}. ${lengthInstructions[userConfig.length] || ""}
- ${userConfig.includeEmojis ? 'Include 1-2 relevant emojis' : 'Do NOT use any emojis'}
- Be authentic and add value to the conversation.
- Don't be overly promotional or salesy.
- Match the formality level of the original post while maintaining the selected tone.
- If it's a question, provide a helpful answer.
- If it's an opinion, engage thoughtfully.
${postContent.platform === 'LinkedIn' ? '- Keep it professional and suitable for a professional networking environment.' : ''}

OUTPUT FORMAT:
Provide ONLY the reply text. Do NOT include any preamble, explanations, quotes, or conversational filler.`;
  }
};

if (typeof self !== 'undefined') {
  self.PromptBuilder = PromptBuilder;
}
