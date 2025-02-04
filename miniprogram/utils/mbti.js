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

function calculateMBTI(answers) {
  console.log('计算MBTI，收到的答案:', answers);
  
  if (!Array.isArray(answers) || answers.length !== 4) {
    console.error('答案数组格式错误:', answers);
    return '';
  }

  let mbtiResult = '';
  
  // E/I - 第一题
  if (!answers[0]) {
    console.error('第一题答案缺失');
    return '';
  }
  mbtiResult += answers[0];
  
  // S/N - 第二题
  if (!answers[1]) {
    console.error('第二题答案缺失');
    return '';
  }
  mbtiResult += answers[1];
  
  // T/F - 第三题
  if (!answers[2]) {
    console.error('第三题答案缺失');
    return '';
  }
  mbtiResult += answers[2];
  
  // J/P - 第四题
  if (!answers[3]) {
    console.error('第四题答案缺失');
    return '';
  }
  mbtiResult += answers[3];

  console.log('计算得到的MBTI结果:', mbtiResult);
  return mbtiResult;
}

module.exports = {
  questions,
  calculateMBTI
}; 