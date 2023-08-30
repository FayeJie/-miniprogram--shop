// page/component/details/details.js
wx. cloud. init()


Page({

  onLoad(options){
   let id = options.id
    wx.cloud.database().collection("FoodInfo")
    .doc(id)
    .get()
    .then(res=>{
      console.log("请求成功",res);
      this.setData({
        goods:res.data,
        curIndex:0,
        num:0
      })
    })
    .catch(err=>{
      console.log("请求失败",err);
    })
  
  },


  

  data:{
    goods: {
     
    },
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    isCollected:false
  },

  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },

  minusCount() {
    let num = this.data.num;
    num--;
    this.setData({
      num : num
    })
  },

  addToCart() {
    if(this.data.num < 1){
      wx.showToast({
        title: '请添加库存',
        icon: 'error',
        duration: 1000,
      })
      return
    }
    console.log(this.data.goods)
    const _ = wx.cloud.database().command
    wx.cloud.database().collection('Cart')
    .where({
        id: this.data.goods._id,
        userId: wx.getStorageSync('Customer')._id
    }).get().then(data => {
      if(data.data.length == 0){

        wx.cloud.database().collection('Cart').add({
          data: {
            "id":  this.data.goods._id,
            "name":  this.data.goods.name,
            "img":  this.data.goods.img,
            "price":  this.data.goods.price,
            "num": this.data.num,
            "userId": wx.getStorageSync('Customer')._id
          }
        }).then(res => {
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 1200,
          })
        })
      }else{
        // 库存+1
        wx.cloud.database().collection('Cart').where({ "id":  this.data.goods._id, userId: wx.getStorageSync('Customer')._id}).update({
          data: {
            "num": _.inc(this.data.num)
          }
        }).then(res => {
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 1200,
          })
        })
      }
    });
  
 

  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },

  like(e) {
    const db = wx.cloud.database();
    const collection = db.collection('Collection');  // 指定集合名称
  
    if (!this.data.isCollected) {
      const goods = this.data.goods;
  
      collection.add({
        data: {
          id: goods._id,
          name: goods.name,
          img: goods.img,
          price: goods.price,
          num: this.data.num,
          userId: wx.getStorageSync('Customer')._id
        },
        success: (res) => {
          wx.showToast({
            title: '已收藏',
          });
        },
        fail: (err) => {
          console.error('收藏失败', err);
        }
      });
    } else {
      const goods = this.data.goods;
      const userId = wx.getStorageSync('Customer')._id;
  
      collection
        .where({
          id: goods._id,
          userId: userId
        })
        .remove()
        .then((res) => {
          wx.showToast({
            title: '已取消收藏',
          });
        })
        .catch((err) => {
          console.error('取消收藏失败', err);
        });
    }
  
    this.setData({
      isCollected: !this.data.isCollected
    });
  }
  
  
 
})

