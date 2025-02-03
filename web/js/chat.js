// 聊天相关功能
function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    const isFirstOpen = chatContainer.style.display === 'none' && !chatContainer.dataset.opened;
    chatContainer.style.display = chatContainer.style.display === 'none' ? 'flex' : 'none';
    
    if (isFirstOpen) {
        chatContainer.dataset.opened = 'true';
        const savedMbtiType = localStorage.getItem('mbtiType');
        const welcomeMessage = savedMbtiType 
            ? `欢迎回来！作为一个 ${savedMbtiType} 类型的人，我很高兴能和你交流。` 
            : '你好！我是你的AI助手，很高兴见到你。';
        addMessage(welcomeMessage, 'bot');
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    mbtiType: localStorage.getItem('mbtiType') || '',
                    context: getConversationHistory()
                })
            });
            
            const data = await response.json();
            document.getElementById('aiAssistantName').textContent = 
                `AI 助手 - ${data.aiName}`;
            addMessage(data.response, 'bot');
            saveConversation();
        } catch (error) {
            addMessage('抱歉，出现了一些问题，请稍后再试。', 'bot');
        }
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(text, sender, typing = true) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'bot' && typing) {
        let i = 0;
        messageDiv.textContent = '';
        const interval = setInterval(() => {
            messageDiv.textContent += text[i];
            i++;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            if (i >= text.length) clearInterval(interval);
        }, 30);
    } else {
        messageDiv.textContent = text;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 语音输入功能
function toggleVoiceInput() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;

        const voiceButton = document.querySelector('[title="语音输入"]');
        
        recognition.onstart = () => {
            voiceButton.classList.add('recording');
        };

        recognition.onend = () => {
            voiceButton.classList.remove('recording');
        };

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            document.getElementById('chatInput').value = text;
            sendMessage();
        };

        recognition.start();
    } else {
        alert('您的浏览器不支持语音输入功能');
    }
}

// 对话历史记录管理
function getConversationHistory() {
    const messages = document.querySelectorAll('.message');
    return Array.from(messages).map(msg => ({
        role: msg.classList.contains('user-message') ? 'user' : 'assistant',
        content: msg.textContent
    }));
}

function saveConversation() {
    const history = getConversationHistory();
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

function loadConversation() {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.forEach(msg => {
        addMessage(msg.content, msg.role === 'user' ? 'user' : 'bot', false);
    });
}

// 在页面加载时初始化聊天历史
document.addEventListener('DOMContentLoaded', () => {
    loadConversation();
}); 