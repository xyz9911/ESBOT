const app = getApp()
const moment = require('moment')
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
// const API = require('api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    testMessageDetail: {
      data: [
      ]
    },
    isLoading: false,
    // 评论和回复内容
    reply_content: "",
    voice_content: "",
    top_value: 100,
    // 最大行数
    max_length: 0,
  },

  // isMore true 用于上拉刷新
  loadMessage: async function(query) {
    if(!this.data.isLoading){
      this.setData({isLoading: true})
    }
    let seconds=new Date().getSeconds();
    let minutes=new Date().getMinutes();
    let hours=new Date().getHours();
    let timestamp =hours+':'+minutes+':'+seconds
    const slot = await this.requestAPI('getSlot','post',query)
    if(!slot){
      this.showToast("获取信息失败", "/images/icons/error.png")
      return false
    }
    var userTmp={
      self: 1,
      showTime: 1,
      string_time: timestamp,
      target_user: {
        username: 'user',
        avatar: '../../images/user.png'
      },
      content: query.query
    }
    this.data.testMessageDetail.data.push(userTmp)
    const intent=await this.requestAPI('getIntent','post',{query:query.query,slot:slot.slot})
    const answer=await this.requestAPI('getAnswer','post',{query:query.query,intent:intent.to_user})
    if (answer.to_user) {
      this.setData({
        isLoading: false
      })
      this.getMaxLength(answer.to_user[0])
      this.setData({
        top_value: this.data.max_length*2,
      });
      var botTmp={self: 0,
      showTime: 0,
      string_time: '',
      target_user: {
        username: 'bot',
        avatar: '../../images/bot.jpg'
      },
      content: answer.to_user[0]
    }
      this.data.testMessageDetail.data.push(botTmp)
      var test=this.data.testMessageDetail.data
      console.log(test)
      this.setData({
        testMessageDetail: this.data.testMessageDetail,
      });
      return true
      // this.autoLoadMessage()
      }
      
    else {
      var guess="";
      if(slot.slot){
        guess+=",我认为你想说的有关:"+slot.slot
      }
      if(intent.to_user&&intent.to_user!=="意图未知"){
        guess+=",我认为你的意图有关:"+intent.to_user
      }
      var botTmp={self: 0,
        showTime: 0,
        string_time: '',
        target_user: {
          username: 'bot',
          avatar: '../../images/bot.jpg'
        },
        content: '抱歉，我不能理解你的话'+guess
      }
        this.data.testMessageDetail.data.push(botTmp)
        this.setData({
          testMessageDetail: this.data.testMessageDetail,
        });
      this.setData({isLoading: false})
      return true
    }
  },

  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  onLoad: async function() {
    this.initRecord()
    // moment.locale('en', {
    //   longDateFormat: {
    //     l: "MM-DD HH:mm",
    //     L: "MM-DD HH:mm:ss"
    //   }
    // });
    // 判断从哪里穿进来参数
    // var param={
    //   query:'你好，请问高血压的人能吃茄子和其他甜品么'
    // }
    // // this.test()
    // const res=await this.requestAPI('getSlot','post',param)
    // console.log(res)
    // const res = await this.loadMessage()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function() {

  // },
  // onMsgRefresh: function(){
  //   if (!this.data.isLoading && !this.data.noMore){
  //     this.data.page = this.data.page + 1
  //     this.loadMessage(this.data.session_id, this.data.status, true)
  //   }
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  showToast: function(str, src) {
    if (src == "") {
      wx.showToast({
        title: str,
        icon: 'success', //图标，支持"success"、"loading" 
        //image: src,//自定义图标的本地路径，image 的优先级高于 icon
        duration: 2000, //提示的延迟时间，单位毫秒，默认：1500 
        mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false 
        success: function() {},
        fail: function() {},
        complete: function() {}
      });
    } else {
      wx.showToast({
        title: str,
        //icon: 'loading',//图标，支持"success"、"loading" 
        image: src, //自定义图标的本地路径，image 的优先级高于 icon
        duration: 2000, //提示的延迟时间，单位毫秒，默认：1500 
        mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false 
        success: function() {},
        fail: function() {},
        complete: function() {}
      });
    }
  },
  getMaxLength: function(text){
    // 利用回车数量以及字数判断高度
    var enter_count = 0
    for (let t of text) {
      if (t === '\n') {
        enter_count++;
      }
    }
    var max = (enter_count + text.length / 13) * 72
    if (max > this.data.max_length){
      this.data.max_length = max
    }
  },
  // 提交回复
  submitReply: async function (e) {
    // 消息为空
    if (!/[^\s]+/.test(this.data.reply_content)) {
      this.setData({
        reply_content: ""
      });
      this.showToast("消息为空", "/images/icons/error.png");
      return;
    }
    // TODO: 在线更新该回复
    const res = this.loadMessage({
      query: this.data.reply_content
    })
    if(!res){
      this.showToast("发送失败", "/images/icons/error.png")
      return
    }
    // await this.loadMessage(this.data.session_id, this.data.status, false)
    this.setData({
      reply_content: ""
    })
  },
  // 评论内容刷新
  replyInputChange: function(e) {
    this.setData({
      reply_content: e.detail.value
    })
  },
  // autoLoadMessage: async function(){
  //   var res = await server.request('GET', 'messages/' + this.data.session_id, {
  //     page: 1,
  //     size: 1
  //   })
  //   if(res.data.length === 0) {}
  //   else{
      
  //     var last = this.data.testMessageDetail.data[this.data.testMessageDetail.data.length - 1]
  //     var getLast = res.data.data.messages[0]
  //     if (getLast.content === last.content && getLast.time === last.time){

  //     }else{
  //       if (getLast.user_id === res.data.data.target_user.id) {
  //         getLast.target_user = res.data.data.target_user
  //         getLast.self = false
  //       } else {
  //         getLast.target_user = {
  //           nickname: app.globalData.userInfo.info.nickname,
  //           avatar: app.globalData.userInfo.info.avatar
  //         }
  //         getLast.self = true
  //       }
  //       moment.locale('en', {
  //         longDateFormat: {
  //           l: "MM-DD HH:mm",
  //           L: "MM-DD HH:mm:ss"
  //         }
  //       })
  //       console.log(getLast.content.length)
  //       // 利用回车数量以及字数判断高度
  //       this.getMaxLength(getLast.content)
  //       getLast.string_time = moment(getLast.time * 1000).format('L')
  //       getLast.showTime = false
  //       this.data.testMessageDetail.data.push(getLast)
  //       this.setData({
  //         testMessageDetail:{
  //           data: this.data.testMessageDetail.data
  //         }
  //       })
  //       this.setData({
  //         // 之前的最长长度 + 最后一条消息的长度
  //         top_value: this.data.max_length * this.data.testMessageDetail.data.length,
  //       })
  //     }
  //     // if (getLast.content === (this.data.testMessageDetail.data.reserve()[0]).content){

  //     // }else{
  //     //   // this.data.testMessageDetail.data.push(res.data.data.)
  //     // }
  //   }
  //   setTimeout(this.autoLoadMessage, 5000)
  // },
  requestAPI: function(url, method, data) {
    var _url = 'http://58.59.92.190:5000/' + url;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: _url,
        method: method,
        data: data,
        header: {
          'Content-Type': 'application/json'
        },
        success: function success(request) {
          console.log(request.data)
          resolve(request.data);
        },
        fail: function fail(error) {
          reject(error);
        },
        complete: function complete(aaa) {
          // 加载完成
        }
      });
    });
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
      this.loadMessage({
        query:text
      })
      // 得到完整识别内容就可以去翻译了
      // this.translateTextAction()
    }
  },
  // translateTextAction: function() {},
})

