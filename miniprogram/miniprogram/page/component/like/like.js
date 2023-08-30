// pages/like/like.js
Page({
  data: {
    likes: []  // 存储收藏数据的数组
  },

  onLoad() {
    const db = wx.cloud.database();
    const collection = db.collection('Collection');  // 指定集合名称

    collection
      .where({
        userId: wx.getStorageSync('Customer')._id
      })
      .get()
      .then((res) => {
        this.setData({
          likes: res.data  // 将获取到的收藏数据存储到 likes 数组中
        });
        this.onLoad();
      })
      .catch((err) => {
        console.error('获取收藏数据失败', err);
      });
  }
});
