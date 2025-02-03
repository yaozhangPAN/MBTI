const { OpenAI } = require('openai');
const { getPersonality } = require('../services/personalityService');
const config = require('../config/config');

const openai = new OpenAI({
    apiKey: config.openaiApiKey
});

async function handleChatMessage(req, res) {
    try {
        const { message, mbtiType, context } = req.body;
        const personality = getPersonality(mbtiType);

        const systemPrompt = `${personality.prompt}
            记住：
            1. 保持一致的人格特征
            2. 根据用户的具体问题调整回应方式
            3. 在专业建议中融入个性化的表达
            4. 始终保持同理心和支持性的态度`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...context.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
        });

        res.json({ 
            response: completion.choices[0].message.content,
            aiName: personality.name
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: '服务器错误' });
    }
}

module.exports = {
    handleChatMessage
}; 