const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    user_query:'',
    answer:'',
    msgList:[],
  },
  streamRecord: function() {
    manager.start({
      lang: 'zh_CN',
    })
  },
  streamRecordEnd: function() {
    manager.stop()
  },
  initRecord: function() {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        user_query: text,
      })
    }
    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      if(text == '') {
        // 用户没有说话，可以做一下提示处理...
        return
      }
      this.setData({
        user_query: text,
      })
      // 得到完整识别内容就可以去翻译了
      this.translateTextAction()
    }
  },
  translateTextAction: function() {},
  onLoad: function() {
    this.initRecord()
  },
  inputChange:function(e){
    this.setData({
        user_query: e.detail.value
    })
  },
  sendMsg: function(){
    this.pos()
    this.setData({
      // msgList:[...this.data.msgList, this.data.answer],
      user_query:''
    })
  },
  pos: function(){
    var that = this;
    wx.request({
      url: 'http://58.59.92.190:5000/match_graph', 
      data: JSON.stringify({"query": this.data.user_query}),
      method:'POST',
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        console.log(res.data.to_user[0])
        that.setData({
          msgList:[...that.data.msgList, res.data.to_user[0]],
        })
      }
    })
  }
  
})
