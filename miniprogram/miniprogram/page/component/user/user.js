// page/component/new-pages/user/user.js
Page({
  data:{
    thumb:'',
    nickname: wx.getStorageSync('Customer').nickname,
    orders:[],
    hasAddress:false,
    address:{},
    list:[]
   
  },

  
  onLoad(){
   
    wx.cloud.database().collection("Order").where({
      userId: wx.getStorageSync('Customer')._id
    }).get().then(res => {
      this.setData({
        orders: res.data
      }) 
   });
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function(res){
        let nickName= '暂未登录'
        if(wx.getStorageSync('Customer')){
          nickName = wx.getStorageSync('Customer').nickname
        }
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: nickName
        })
      }
    }),



    /**
     * 发起请求获取订单列表信息
     */
    wx.request({
      url: 'http://www.gdfengshuo.com/api/wx/orders.txt',
      success(res){
        self.setData({
          orders: res.data
        })
      }
    })
  },
  onShow(){
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },
  /**
   * 发起支付请求
   */
  payOrders(){
    wx.requestPayment({
      timeStamp: 'String1',
      nonceStr: 'String2',
      package: 'String3',
      signType: 'MD5',
      paySign: 'String4',
      success: function(res){
        console.log(res)
      },
      fail: function(res) {
        wx.showModal({
          title:'支付提示',
          content:'<text>',
          showCancel: false
        })
      }
    })
  },

  register() {
    wx.navigateTo({
      url: '/page/register/register', 
      
    });
  },

  login(){
    wx.navigateTo({
      url: '/page/login/login', 
      
    });
  }
})

