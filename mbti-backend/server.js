const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// 配置 OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

// 处理聊天消息
app.post('/api/chat', async (req, res) => {
    try {
        const { message, mbtiType, context } = req.body;

        // 构建系统提示
        let systemPrompt = "你是一个友好的AI助手。";
        if (mbtiType) {
            systemPrompt += `用户是${mbtiType}性格类型，请根据这个性格类型的特点来调整回复的语气和内容。`;
        }

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

        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 处理文件上传
app.post('/api/upload/file', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有收到文件' });
        }

        const fileContent = req.file.buffer.toString('utf-8');
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "你是一个文件分析助手，请帮助用户理解文件内容。" 
                },
                { 
                    role: "user", 
                    content: `请分析以下文件内容：\n${fileContent}` 
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('File processing error:', error);
        res.status(500).json({ error: '文件处理失败' });
    }
});

// 处理图片上传
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有收到图片' });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "请描述这张图片，并给出相关的分析或建议。" },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
                            }
                        }
                    ],
                },
            ],
        });

        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('Image processing error:', error);
        res.status(500).json({ error: '图片处理失败' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 