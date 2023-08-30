// page/component/new-pages/cart/cart.js
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus: false,    // 全选状态，默认不全选
    obj:{
        name:"hello"
    }
  },
  onShow() {
    wx.cloud.database().collection('Cart').where({
      userId: wx.getStorageSync('Customer')._id
    }).get().then(res => {
      this.setData({
        hasList: true,
        carts: res.data
      });
      this.getTotalPrice();
    })
    // this.setData({
    //   hasList: true,
    //   carts:[
    // 
    //   ]
    // });
  
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    wx.cloud.database().collection('Cart').where({
      _id: carts[index]._id,
    }).remove()
    carts.splice(index,1);
    this.setData({
      carts: carts
    });
    if(!carts.length){
      this.setData({
        hasList: false
      });
    }else{
      this.getTotalPrice();
    }
  },
  goOrders(){
    if(this.data.totalPrice > 0){
      let result = this.data.carts.filter(item => {
        return item.selected == true
      })
      // result[result.length] = this.sumPrice
      wx.setStorageSync('orderInfo',result)
      wx.navigateTo({     
        url:'/page/component/orders/orders'
      })
    }else{
      wx.showToast({
        title: '请选择先商品',
        icon: 'error',
        duration: 1000,
      })
    }  
  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    const data = this.data.carts[index]
    let carts = this.data.carts;
    let num = data.num;

    const _ = wx.cloud.database().command
      // if(type == -1 && num == 1){
      //   this.list.splice(index, 1)
      //   wx.cloud.database().collection('car').where({
      //     id: id
      //   }).remove()
      //   return false
      // }
      //  this.$set(this.list[index],'num', this.list[index].num + type)
        wx.cloud.database().collection('Cart').where({
          _id: data._id
        }).update({
            data: {
              "num": _.inc(1)
            }
        })
    
    
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const _ = wx.cloud.database().command
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = carts[index].num;
    const data = this.data.carts[index]
    if(num <= 1){
      return false;
    }
    wx.cloud.database().collection('Cart').where({
      _id: data._id
    }).update({
        data: {
          "num": _.inc(-1)
        }
    })
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  }

})