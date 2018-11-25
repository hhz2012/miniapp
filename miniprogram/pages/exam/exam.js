const audio = wx.createInnerAudioContext()
const recorderManager = wx.getRecorderManager();


// miniprogram/pages/exam/exam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.startExamLoop();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  startExamLoop: function () {
    //create a test
    var that = this;
    this.tts();
    //setTimeout(() => { that.showQuestion(); }, 1000);
    setTimeout(() => { that.txspeechRecognition(); }, 1000);

  },

  showQuestion: function () {
    let ques = "一，加，十，等于，多少？"
    //call tts
    var text = encodeURI(ques);
    var token = this.data.token;
    var cuid = 'IMEI';
    var ctp = 1;
    var lan = "zh";

    var spd = 5;
    var url = "http://tsn.baidu.com/text2audio?tex=" + text + "&lan=" + lan + "&ctp=" + ctp + "&tok=" + token + "&spd=" + spd + "&cuid=" + cuid
    wx.downloadFile({
      url: url,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath;
        if (res.statusCode == 200) {
          //  wx.playVoice({
          //    filePath:res.tempFilePath
          //  })
          audio.src = res.tempFilePath
          audio.play()
        }
      }
    })

  },
  tts: function (e) {
    var grant_type = "client_credentials";
    var appKey = "LwKyClewlnPlID5GFS0aHXc3";
    var appSecret = "BLqqmccggkI0IlAHX9AAG9rNTPQCRlkG";
    var url = "https://openapi.baidu.com/oauth/2.0/token";
    var that = this;
    var mytoken = null;
    wx.request({
      url: url,
      data: {
        grant_type: grant_type,
        client_id: appKey,
        client_secret: appSecret
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        mytoken = res.data.access_token
        that.setData(
          {
            token: mytoken
          }
        )
      }
    })
    this.initRecorder();
  },
  initRecorder: function () {
    var that = this;
    recorderManager.onStop((res) => {
      // 获取文件路径-提交到后台-后台发送到百度
      speechRecognition(that, res);
    })

    recorderManager.onError((res) => {
      console.log("error", res);
    });

  },
  onStartAnswer: function () {
    const options = {
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 64000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options);
  },
  speechRecognition: function (that, res) {
    console.log("语音识别");
    wx.uploadFile({
      url: API_URL,
      filePath: res.tempFilePath,
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        console.log(res); console.log(res.data);
      },
      fail: function () {
        console.log("语音识别失败");
      }
    })
  },
  txspeechRecognition: function (that, res) {
    let cred = new Credential("", "");
    let httpProfile = new HttpProfile();
    httpProfile.endpoint = "aai.tencentcloudapi.com";
    let clientProfile = new ClientProfile();
    clientProfile.httpProfile = httpProfile;
    let client = new AaiClient(cred, "", clientProfile);

    let req = new models.SentenceRecognitionRequest();

    let params = '{}'
    req.from_json_string(params);


    client.SentenceRecognition(req, function (errMsg, response) {

      if (errMsg) {
        console.log(errMsg);
        return;
      }

      console.log(response.to_json_string());
    });
  },
  onEndAnswer: function () {
    recorderManager.stop();
  }


})