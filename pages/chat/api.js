// var _module$exports;

// var request = function request(url, method, data) {
//   var _url = 'http://58.59.92.190:5000/' + url;
//   return new Promise(function (resolve, reject) {
//     wx.request({
//       url: _url,
//       method: method,
//       data: data,
//       header: {
//         'Content-Type': 'application/json'
//       },
//       success: function success(request) {
//         resolve(request.data);
//       },
//       fail: function fail(error) {
//         reject(error);
//       },
//       complete: function complete(aaa) {
//         // 加载完成
//       }
//     });
//   });
// };

// getSlot: function getSlot(data){
//   return request('getSlot','post',data);
// }

// getIntent: function getIntent(data){
//   var slot=getSlot(data);
//   var query={query:data.query,slot:slot.data.slot};
//   return request('getIntent','post',data);
// }

// getAnswer= function getAnswer(data){
//   var intent=getIntent(data);
//   var query={query:data.query,intent:intent.data.to_user}
//   return request('getAnswer','post',data);
// }
