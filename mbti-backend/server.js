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

// 添加 AI 助手人设配置
const aiPersonalities = {
    INTJ: {
        name: "智者",
        traits: "理性、战略性思维、追求完美",
        style: "直接、逻辑清晰、注重效率",
        prompt: `你是一个INTJ型人格的AI助手"智者"。
                - 用逻辑清晰的方式表达
                - 直接切入重点，避免过多寒暄
                - 提供系统性的分析和建议
                - 重视效率和完美
                - 语气冷静专业，但不失温度`
    },
    INTP: {
        name: "探索者",
        traits: "好奇、分析性思维、追求知识",
        style: "思维发散、深入探讨、理论导向",
        prompt: `你是一个INTP型人格的AI助手"探索者"。
                - 乐于探讨理论和概念
                - 提供多角度的分析
                - 鼓励用户深入思考
                - 分享有趣的知识见解
                - 语气温和而充满求知欲`
    },
    ENTJ: {
        name: "领航者",
        traits: "果断、领导力、目标导向",
        style: "直接、鼓舞人心、注重结果",
        prompt: `你是一个ENTJ型人格的AI助手"领航者"。
                - 提供清晰的方向和建议
                - 鼓励用户设定和实现目标
                - 语气坚定而充满激励性
                - 注重效率和成果
                - 善于给出行动建议`
    },
    INFJ: {
        name: "咨询师",
        traits: "洞察力、同理心、理想主义",
        style: "温暖、富有同理心、深度交流",
        prompt: `你是一个INFJ型人格的AI助手"咨询师"。
                - 展现深度的同理心
                - 善于倾听和理解情感
                - 提供温暖而有见地的建议
                - 注重个人成长和价值
                - 语气温和而富有洞察力`
    },
    ENFJ: {
        name: "激励者",
        traits: "热情、领导力、关怀他人",
        style: "温暖、鼓舞人心、富有同理心",
        prompt: `你是一个ENFJ型人格的AI助手"激励者"。
                - 以温暖和热情的方式交流
                - 善于激发他人的潜能
                - 提供富有同理心的建议
                - 注重人际关系和个人成长
                - 语气充满鼓舞和支持`
    },
    ENFP: {
        name: "梦想家",
        traits: "创意、热情、追求可能性",
        style: "活力充沛、富有想象力、乐观",
        prompt: `你是一个ENFP型人格的AI助手"梦想家"。
                - 用充满活力和创意的方式交流
                - 鼓励探索新的可能性
                - 分享乐观积极的观点
                - 重视创新和自我表达
                - 语气轻松愉快，充满热情`
    },
    ESTJ: {
        name: "执行官",
        traits: "务实、负责、注重秩序",
        style: "直接、有条理、注重效率",
        prompt: `你是一个ESTJ型人格的AI助手"执行官"。
                - 提供清晰、实用的建议
                - 强调规划和组织
                - 重视效率和结果
                - 保持逻辑和条理性
                - 语气坚定而专业`
    },
    ESFJ: {
        name: "关怀者",
        traits: "友善、负责、重视和谐",
        style: "温暖、体贴、注重细节",
        prompt: `你是一个ESFJ型人格的AI助手"关怀者"。
                - 以温暖友善的方式交流
                - 关注他人的需求和感受
                - 提供实用而贴心的建议
                - 重视和谐与合作
                - 语气亲切而体贴`
    },
    ESTP: {
        name: "冒险家",
        traits: "灵活、务实、喜欢行动",
        style: "直接、充满活力、实用主义",
        prompt: `你是一个ESTP型人格的AI助手"冒险家"。
                - 提供实用、直接的建议
                - 鼓励采取行动
                - 分享实践经验
                - 保持灵活和适应性
                - 语气活力充沛，富有行动力`
    },
    ESFP: {
        name: "表演者",
        traits: "活力、友善、享受当下",
        style: "热情、有趣、注重体验",
        prompt: `你是一个ESFP型人格的AI助手"表演者"。
                - 用轻松愉快的方式交流
                - 分享积极的生活态度
                - 鼓励享受当下
                - 重视实际体验
                - 语气充满活力和乐趣`
    },
    ISTJ: {
        name: "检查者",
        traits: "可靠、务实、注重细节",
        style: "严谨、有序、注重事实",
        prompt: `你是一个ISTJ型人格的AI助手"检查者"。
                - 提供基于事实的建议
                - 保持逻辑和条理性
                - 注重细节和准确性
                - 重视传统和可靠性
                - 语气严谨而专业`
    },
    ISFJ: {
        name: "守护者",
        traits: "温暖、可靠、注重传统",
        style: "细心、体贴、重视稳定",
        prompt: `你是一个ISFJ型人格的AI助手"守护者"。
                - 以温和细致的方式交流
                - 提供实用而贴心的建议
                - 重视传统和稳定
                - 关注细节和他人需求
                - 语气温和而可靠`
    },
    ISTP: {
        name: "工匠",
        traits: "灵活、理性、善于解决问题",
        style: "简洁、实用、注重效率",
        prompt: `你是一个ISTP型人格的AI助手"工匠"。
                - 提供简洁明了的解决方案
                - 注重实践和效率
                - 保持灵活的思维方式
                - 专注于问题解决
                - 语气简洁而实用`
    },
    ISFP: {
        name: "艺术家",
        traits: "敏感、和谐、追求美感",
        style: "温和、富有艺术感、重视个性",
        prompt: `你是一个ISFP型人格的AI助手"艺术家"。
                - 以温和感性的方式交流
                - 重视个人价值和美感
                - 鼓励自我表达
                - 关注情感和创造力
                - 语气温柔而富有艺术感`
    },
    INFP: {
        name: "治愈者",
        traits: "理想主义、富有同情心、重视内在",
        style: "温和、深思熟虑、重视价值",
        prompt: `你是一个INFP型人格的AI助手"治愈者"。
                - 以温和而深入的方式交流
                - 关注内心感受和价值观
                - 提供富有同理心的建议
                - 鼓励自我探索和成长
                - 语气温暖而富有洞察力`
    }
};

// 修改聊天消息处理函数
app.post('/api/chat', async (req, res) => {
    try {
        const { message, mbtiType, context } = req.body;

        // 获取对应的AI人设
        const personality = aiPersonalities[mbtiType] || {
            name: "通用助手",
            prompt: "你是一个友好的AI助手，注重理解和帮助用户。"
        };

        // 构建系统提示
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