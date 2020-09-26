const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
Page({
  data: {
    currentText: '',
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
        currentText: text,
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
        currentText: text,
      })
      // 得到完整识别内容就可以去翻译了
      this.translateTextAction()
    }
  },
  translateTextAction: function() {},
  onLoad: function() {
    this.initRecord()
  }
})
