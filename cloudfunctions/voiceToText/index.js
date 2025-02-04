const cloud = require('wx-server-sdk');
const tencentcloud = require('tencentcloud-sdk-nodejs');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const AsrClient = tencentcloud.asr.v20190614.Client;
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: 'ap-guangzhou',
  profile: {
    httpProfile: {
      endpoint: 'asr.tencentcloudapi.com',
    },
  },
};

const client = new AsrClient(clientConfig);

exports.main = async (event, context) => {
  try {
    const { fileID } = event;
    
    // 下载音频文件
    const res = await cloud.downloadFile({
      fileID: fileID,
    });
    
    // 将音频文件转为 base64
    const base64Audio = res.fileContent.toString('base64');
    
    // 调用腾讯云语音识别 API
    const result = await client.SentenceRecognition({
      ProjectId: 0,
      SubServiceType: 2,
      EngSerViceType: '16k_zh',
      SourceType: 1,
      VoiceFormat: 'mp3',
      UsrAudioKey: Date.now().toString(),
      Data: base64Audio,
      DataLen: res.fileContent.length
    });

    return {
      success: true,
      text: result.Result
    };
  } catch (error) {
    console.error('语音识别错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 