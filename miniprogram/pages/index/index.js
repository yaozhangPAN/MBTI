Page({
  data: {
    mbtiType: ''
  },
  onInputChange: function (e) {
    this.setData({
      mbtiType: e.detail.value
    });
  },
  onSubmit: function () {
    // 提交 MBTI 类型
    console.log('用户的 MBTI 类型:', this.data.mbtiType);
    // 这里可以调用后端接口保存用户的 MBTI 类型
  }
}); 