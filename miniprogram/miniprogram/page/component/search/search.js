const db = wx.cloud.database();//初始化数据库
Page({
  data:{
    search:'',//记录输入的查询字段
   },

  Input(e) {//输入框输入数据
    this.setData({
      search: e.detail.value//赋值
    })
    console.log(e.detail.value)//控制台监听输入
   },
   
  Search :function () {//在云数据库中进行搜索
    wx: wx.showLoading({
      title: '加载中',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    
    // 数据库正则对象
    db.collection('FoodInfo').where({
    //使用正则查询，在collection"FoodInfo"中模糊搜索
    name: db.RegExp({
    regexp: this.data.search,
    //从搜索栏中获取的search作为规则进行匹配。
    options: 'i',
    //大小写不区分value
    })
    }).get({
    success: res => {
    console.log(res)//在控制台上呈现

    },
  });
}
  })
