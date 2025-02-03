# MBTI 测试与 AI 助手

这是一个结合了 MBTI 性格测试和 AI 助手功能的 Web 应用。用户可以进行 MBTI 测试，获取个性化的每日激励语句，并与 AI 助手进行智能对话。

## 功能特点

### MBTI 测试
- 完整的 MBTI 性格测试题目
- 即时计算并显示测试结果
- 支持手动输入已知的 MBTI 类型
- 本地保存测试结果

### 每日激励
- 基于 MBTI 类型的个性化激励语句
- 根据时间段（早中晚）显示不同类型的激励内容
- 支持随机切换激励语句
- 考虑用户性格特点的内容定制

### AI 助手
- 智能对话功能
- 支持文本、语音、图片和文件多种交互方式
- 基于 MBTI 类型调整回复风格
- 对话历史记录保存功能

## 技术栈

### 前端
- HTML5
- CSS3
- JavaScript (原生)
- Web Speech API (语音识别)

### 后端
- Node.js
- Express.js
- OpenAI API
- Multer (文件处理)

## 安装与运行

1. 克隆项目
2. 安装依赖
3. 运行项目

## 项目结构

```
MBTI/
├── web/                      # Web 前端
│   ├── index.html
│   ├── css/
│   │   └── style.css        # 样式文件
│   └── js/
│       ├── chat.js          # 聊天功能
│       ├── mbti.js          # MBTI 测试逻辑
│       └── quotes.js        # 激励语句管理
├── mbti-backend/            # 后端
│   ├── server.js            # 主服务器文件
│   ├── controllers/         # 控制器
│   ├── services/           # 服务层
│   └── config/             # 配置文件
└── miniprogram/            # 小程序端
```
        