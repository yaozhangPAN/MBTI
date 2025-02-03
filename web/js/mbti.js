// MBTI 测试相关功能
const questions = [
    {
        id: 1,
        text: "在社交场合中，你通常会：",
        options: [
            { value: "E", text: "主动与他人交谈，感到能量充沛" },
            { value: "I", text: "倾向于安静观察，觉得社交消耗能量" }
        ]
    },
    {
        id: 2,
        text: "在获取信息时，你更倾向于：",
        options: [
            { value: "S", text: "关注具体的细节和事实" },
            { value: "N", text: "关注概念和可能性" }
        ]
    },
    {
        id: 3,
        text: "做决定时，你通常会：",
        options: [
            { value: "T", text: "依据逻辑和客观分析" },
            { value: "F", text: "考虑他人感受和价值观" }
        ]
    },
    {
        id: 4,
        text: "在日常生活中，你更喜欢：",
        options: [
            { value: "J", text: "按计划行事，喜欢确定性" },
            { value: "P", text: "保持灵活，随机应变" }
        ]
    }
];

let currentQuestionIndex = 0;
let answers = new Array(questions.length).fill('');

function showQuestion() {
    const question = questions[currentQuestionIndex];
    const container = document.getElementById('main-container');

    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    container.innerHTML = `
        <div class="question-container">
            <div class="question-number">问题 ${currentQuestionIndex + 1}/${questions.length}</div>
            <div class="question-text">${question.text}</div>
            <div class="options-container">
                ${question.options.map(option => `
                    <button class="option-btn" onclick="selectAnswer('${option.value}')">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function selectAnswer(value) {
    answers[currentQuestionIndex] = value;
    currentQuestionIndex++;
    showQuestion();
}

function calculateResult() {
    let mbtiResult = '';
    
    // E/I - 第一题
    const eCount = answers[0] === 'E' ? 1 : 0;
    mbtiResult += eCount > 0 ? 'E' : 'I';
    
    // S/N - 第二题
    const sCount = answers[1] === 'S' ? 1 : 0;
    mbtiResult += sCount > 0 ? 'S' : 'N';
    
    // T/F - 第三题
    const tCount = answers[2] === 'T' ? 1 : 0;
    mbtiResult += tCount > 0 ? 'T' : 'F';
    
    // J/P - 第四题
    const jCount = answers[3] === 'J' ? 1 : 0;
    mbtiResult += jCount > 0 ? 'J' : 'P';

    return mbtiResult;
}

function showResult() {
    const result = calculateResult();
    localStorage.setItem('mbtiType', result);
    const container = document.getElementById('main-container');
    
    container.innerHTML = `
        <div class="result-container">
            <h2>测试结果</h2>
            <p>您的MBTI类型是: ${result}</p>
            <button class="option-btn" onclick="restartTest()">重新测试</button>
            <button class="option-btn" onclick="showQuoteSection()">查看今日激励</button>
        </div>
    `;
}

function restartTest() {
    currentQuestionIndex = 0;
    answers = new Array(questions.length).fill('');
    showQuestion();
}

function showTestSection() {
    currentQuestionIndex = 0;
    answers = new Array(questions.length).fill('');
    showQuestion();
}

// ... 其他 MBTI 测试相关函数 ... 