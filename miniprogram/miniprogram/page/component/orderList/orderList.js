// page/component/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		wx.cloud.database().collection("Order").get().then(res => {
       this.setData({
         list: res.data
       }) 
    });
  }
})