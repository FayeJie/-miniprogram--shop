# miniprogram--shop
模拟商城小程序
其实很简陋啦，但是应该打开就能运行！请注意数据库是微信小程序的云数据库哦~~
系统实现了基本的美食app功能，还需改进…

实现了商品的展示
腾讯云数据库的使用：
onLoad() {
  wx.cloud.database().collection("FoodInfo")
    .get()
    .then(res => {
      console.log("请求成功", res);
      this.setData({
        list: res.data
      })
    })
    .catch(err => {
      console.log("请求失败", err);
    })
},
这段代码的功能是从云数据库中获取 "FoodInfo" 集合的数据，并将数据存储在页面的 list 字段中。在请求成功时，将结果打印到控制台，并通过 setData 更新页面数据。在请求失败时，将错误信息打印到控制台。
项目使用了 Flex 布局，以后的前端代码都使用了flex布局。

轮播图的实现

<swiper indicator-dots="true" autoplay="true" interval="{{interval}}" duration="{{duration}}" circular="true">
<block wx:for="{{imgUrls}}" wx:key="{{index}}">
<swiper-item>
<image src="{{item}}" class="slide-image" width="100%"/>
</swiper-item>
</block>
</swiper>
这段代码的解释：
<swiper> 组件：实现轮播图效果。
indicator-dots="true"：显示指示点。
autoplay="true"：自动播放。
interval="{{interval}}"：轮播间隔时间。
duration="{{duration}}"：切换动画时长。
<block wx:for="{{imgUrls}}" wx:key="{{index}}">：通过 wx:for 循环渲染 imgUrls 数组中的每个元素。

用户页面
登录功能、注册功能
其实这两个也是和之前一样添加读取数据库用户信息就好了，原理很简单

// 
page/component/login/login.js
Page({
  data: {
    nickname: '',
    password: ''
  },
  //获取输入的账号
  getName(event) {
    //console.log('账号', event.detail.value)
    this.setData({
      nickname: event.detail.value
    })

  },
  //获取输入的密码
  getPsw(event) {
    // console.log('密码', event.detail.value)
    this.setData({
      password: event.detail.value
    })
  },
  //点击登陆
  login() {
    let nickname = this.data.nickname
    let password = this.data.password
    console.log('账号', nickname, '密码', password)
   

    //登陆
    wx.cloud.database().collection('Customer').where({
      nickname: nickname,
      password: password
    }).get({
      success(res) {
        console.log("获取数据成功", res)
        let Customer = res.data[0]
        console.log("Customer", Customer)
        if (res.data.length > 0) {
          console.log('登录成功')
          wx.showToast({
            title: '登录成功',
          })
     
          setTimeout(() => {
            wx.switchTab({
              url: '/page/component/index',
            });
          }, 1000);
          
          
          
         
          //保存用户登陆状态
          wx.setStorageSync('Customer', Customer)
        } else {
          console.log('登陆失败')
       
          wx.showToast({
            title: '账号密码不正确',
            icon: 'error',
            duration: 1000,
          })
        }
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })

  }
})

   

更改头像的方法
  changeAvatar() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        const thumb = tempFilePaths[0];
        
        // 更新用户头像数据
        const db = wx.cloud.database();
        const collection = db.collection('Customer');
        const customerId = wx.getStorageSync('Customer')._id;
        
        collection.doc(customerId).update({
          data: {
            thumb: thumb
          },
          success: (result) => {
            wx.showToast({
              title: '头像更新成功',
              icon: 'success',
              duration: 2000
            });
            
            this.setData({
              thumb: thumb
            });
          },
          fail: (error) => {
            console.error('头像更新失败', error);
          }
        });
      },
      fail: (error) => {
        console.error('选择头像图片失败', error);
      }
    });
  },

   

购物车页面                                 

在页面的 onLoad 生命周期中，通过调用 wx.cloud.database().collection() 方法获取名为 "Cart" 的集合数据，并将获取的数据保存到 carts 数组中。然后调用 this.getTotalPrice() 方法计算购物车中商品的总价。
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
}
selectList 方法是商品选中事件的处理函数。通过 e.currentTarget.dataset.index 获取被点击商品的索引，然后在 carts 数组中将该商品的 selected 属性取反，实现选中和取消选中的切换。最后调用 this.getTotalPrice() 方法重新计算购物车商品的总价。


selectList(e) {
  const index = e.currentTarget.dataset.index;
  let carts = this.data.carts;
  const selected = carts[index].selected;
  carts[index].selected = !selected;
  this.setData({
    carts: carts
  });
  this.getTotalPrice();
}
deleteList 方法是删除购物车中当前商品的处理函数。通过 e.currentTarget.dataset.index 获取被点击商品的索引，并从 carts 数组中移除该商品。同时，调用 wx.cloud.database().collection().where().remove() 方法，从数据库中删除该商品的数据。如果购物车为空，则将 hasList 设置为 false，否则调用 this.getTotalPrice() 方法重新计算购物车商品的总价。


deleteList(e) {
  const index = e.currentTarget.dataset.index;
  let carts = this.data.carts;
  wx.cloud.database().collection('Cart').where({
    _id: carts[index]._id,
  }).remove()
  carts.splice(index, 1);
  this.setData({
    carts: carts
  });
  if (!carts.length) {
    this.setData({
      hasList: false
    });
  } else {
    this.getTotalPrice();
  }
}


selectAll 方法是购物车全选事件的处理函数。通过取反 selectAllStatus 变量，实现全选和取消全选的切换。然后遍历 carts 数组，将所有商品的 selected 属性设置为 selectAllStatus。最后调用 this.getTotalPrice() 方法重新计算购物车商品的总价。


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
}


addCount 方法是增加商品数量的处理函数。通过 e.currentTarget.dataset.index 获取被点击商品的索引，并将该商品的数量加1。同时，调用 wx.cloud.database().collection().where().update() 方法，更新数据库中该商品的数量。最后调用 this.getTotalPrice() 方法重新计算购物车商品的总价。


addCount(e) {
  const index = e.currentTarget.dataset.index;
  let carts = this.data.carts;
  let num = carts[index].num;

  const _ = wx.cloud.database().command;
  wx.cloud.database().collection('Cart').where({
    _id: carts[index]._id
  }).update({
    data: {
      num: _.inc(1)
    }
  });

  num = num + 1;
  carts[index].num = num;
  this.setData({
    carts: carts
  });
  this.getTotalPrice();
}


minusCount 方法是减少商品数量的处理函数。通过 e.currentTarget.dataset.index 获取被点击商品的索引，并将该商品的数量减1。同时，调用 wx.cloud.database().collection().where().update() 方法，更新数据库中该商品的数量。最后调用 this.getTotalPrice() 方法重新计算购物车商品的总价。


minusCount(e) {
  const index = e.currentTarget.dataset.index;
  let carts = this.data.carts;
  let num = carts[index].num;

  const _ = wx.cloud.database().command;
  wx.cloud.database().collection('Cart').where({
    _id: carts[index]._id
  }).update({
    data: {
      num: _.inc(-1)
    }
  });

  num = num - 1;
  carts[index].num = num;
  this.setData({
    carts: carts
  });
  this.getTotalPrice();
}



getTotalPrice 方法用于计算购物车商品的总价。首先获取购物车列表数据 carts，然后遍历列表计算选中商品的总价，将结果保存到 total 变量中，并将 total 转为保留两位小数的字符串赋值给 totalPrice。最后通过调用 this.setData() 方法将计算结果更新到页面中。


getTotalPrice() {
  let carts = this.data.carts;
  let total = 0;
  for (let i = 0; i < carts.length; i++) {
    if
在页面布局部分，根据购物车是否有数据的判断，展示不同的布局。如果购物车有数据，展示购物车列表和底部的全选栏，否则显示购物车为空的提示


收藏功能页面
其实也是读取收藏的商品并且显示，比购物车简单很多
获取收藏数据

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
    })
    .catch((err) => {
      console.error('获取收藏数据失败', err);
    });
}

渲染页面

<view class="like-list">
  <block wx:for="{{likes}}" wx:key="index">
    <view class="like-item">
      <image src="{{item.img}}"></image>
      <text>{{item.name}}</text>
      <text>{{item.price}}</text>
      <!-- 其他收藏项的信息展示 -->
    </view>
  </block>
</view>
长按取消收藏
我在like.wxml中的like-item元素上添加了bindlongpress事件，该事件绑定了deleteLike方法，并通过data-item-id属性传递了收藏食物的id，这样，当用户长按收藏项时，会弹出确认删除的提示框，确认后会从数据库中删除对应的收藏数据，并重新获取最新的收藏数据进行展示，我在删除操作后调用getLikes方法重新获取最新的收藏数据，以便实时更新页面内容。


deleteLike(event) {
    const db = wx.cloud.database();
    const collection = db.collection('Collection');  // 指定集合名称
    const itemId = event.currentTarget.dataset.itemId;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除该收藏吗？',
      success: (res) => {
        if (res.confirm) {
          collection
            .doc(itemId)
            .remove()
            .then(() => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });
              this.getLikes(); // 重新获取收藏数据
            })
            .catch((err) => {
              console.error('删除收藏失败', err);
            });
        }
      }

      
 分类功能页面
        
在 onLoad 函数中，获取分类数据和初始商品数据。


onLoad() {
  // 获取分类数据
  wx.cloud.database().collection("Type").get().then(res => {
    this.setData({
      category: res.data
    }) 
  });

  // 获取初始商品数据
  wx.cloud.database().collection("FoodInfo")
    .get()
    .then(res=>{
      let select = res.data.filter((item) => {
        return item.type == "1"
      })
      this.setData({
        cate: res.data,
        selectCate: select
      })
      console.log("获取数据成功", select);
    })
    .catch(err=>{
      console.log("获取数据失败", err)
    })
},


实现切换分类选项卡的功能，并根据选择的分类切换商品列表。

switchTab(e) {
  const self = this;
  this.setData({
    isScroll: true
  })
  setTimeout( () => {
    let select = this.data.cate.filter((item) => {
      return item.type == e.target.dataset.id
    })
    this.setData({
      selectCate: select
    })
    self.setData({
      toView: e.target.dataset.id,
      curIndex: e.target.dataset.id
    })
  }, 0)
  setTimeout(function () {
    self.setData({
      isScroll: false
    })
  }, 1)
},
页面渲染分类选项卡和对应的商品列表。

<view class="main">
  <view class="categroy-left">
    <view wx:for="{{category}}" wx:key="index" data-id="{{item.typeId}}" data-index="{{index}}" bindtap="switchTab" class="cate-list {{curIndex == index+1?'on':''}}">{{item.typeName}}</view>
  </view>
  <scroll-view class="categroy-right" scroll-y="{{isScroll}}" scroll-into-view="{{toView}}" scroll-with-animation="true">
    <view class="cate-box">
      <view class="cate-banner">
        <image src="{{category[curIndex-1].img}}"></image>
      </view>
      <view class="cate-title">
        <text>{{category[curIndex-1].typeName}}</text>
      </view>
      <view class="product">
        <view class="product-list" wx:for="{{selectCate}}">
          <navigator url="{{'../details/details?id=' + item._id}}">
            <image src="{{item.img}}"></image>
            <view class="classname"><text>{{item.name}}</text></view>
          </navigator>
        </view>
      </view> 
    </view>
  </scroll-view>
</view>


详情页面

在 onLoad 函数中，根据传入的 options.id 获取商品详情数据。

onLoad(options) {
  let id = options.id;
  wx.cloud.database().collection("FoodInfo")
    .doc(id)
    .get()
    .then(res => {
      console.log("请求成功", res);
      this.setData({
        goods: res.data,
        curIndex: 0,
        num: 0
      });
    })
    .catch(err => {
      console.log("请求失败", err);
    });
},
实现商品数量增加的功能。
javascript
Copy code
addCount() {
  let num = this.data.num;
  num++;
  this.setData({
    num: num
  });
},
实现商品数量减少的功能。
javascript
Copy code
minusCount() {
  let num = this.data.num;
  num--;
  this.setData({
    num: num
  });
},
实现将商品添加到购物车的功能。
javascript
Copy code
addToCart() {
  if (this.data.num < 1) {
    wx.showToast({
      title: '请添加库存',
      icon: 'error',
      duration: 1000,
    });
    return;
  }
  
  // 判断购物车中是否已存在该商品
  
  const _ = wx.cloud.database().command;
  wx.cloud.database().collection('Cart')
    .where({
      id: this.data.goods._id,
      userId: wx.getStorageSync('Customer')._id
    })
    .get()
    .then(data => {
      if (data.data.length == 0) {
        // 购物车中不存在该商品，添加到购物车
        wx.cloud.database().collection('Cart').add({
          data: {
            "id": this.data.goods._id,
            "name": this.data.goods.name,
            "img": this.data.goods.img,
            "price": this.data.goods.price,
            "num": this.data.num,
            "userId": wx.getStorageSync('Customer')._id
          }
        }).then(res => {
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 1200,
          });
        });
      } else {
        // 购物车中已存在该商品，增加数量
        wx.cloud.database().collection('Cart').where({ "id": this.data.goods._id, userId: wx.getStorageSync('Customer')._id }).update({
          data: {
            "num": _.inc(this.data.num)
          }
        }).then(res => {
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 1200,
          });
        });
      }
    });
},
实现切换商品详情选项卡的功能。

bindTap(e) {
  const index = parseInt(e.currentTarget.dataset.index);
  this.setData({
    curIndex: index
  });
},
实现收藏商品的功能。
javascript
Copy code
like(e) {
  const db = wx.cloud.database();
  const collection = db.collection('Collection');  // 指定集合名称

  if (!this.data.isCollected) {
    // 添加收藏
    
    const goods = this.data.goods;
    collection.add({
      data: id: goods._id,
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
  
  
    // 取消收藏
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
},


搜索功能界面
      
Page({
  data: {
    foods: [],  // 存储所有商品数据的数组
    filteredFoods: [],  // 存储过滤后的商品数据的数组
    keyword: ''  // 存储搜索关键词
  },

  onLoad() {
    // 从数据库中获取商品数据并存储到 foods 数组中
    // 请根据您的实际情况修改以下代码
    const db = wx.cloud.database();
    const collection = db.collection('FoodInfo');

    collection.get()
      .then(res => {
        this.setData({
          foods: res.data,
          filteredFoods: res.data
        });
      })
      .catch(err => {
        console.error('获取商品数据失败', err);
      });
  },

  handleInput(event) {
    const keyword = event.detail.value.trim();
    this.setData({
      keyword: keyword
    });

    // 根据关键词进行模糊搜索并更新 filteredFoods 数组
    const reg = new RegExp(keyword, 'i');
    const filteredFoods = this.data.foods.filter(item => reg.test(item.name));
    this.setData({
      filteredFoods: filteredFoods
    });
  }
});
这段代码定义了一个Page对象，包含了页面的数据和函数。其中：foods是一个空数组，用于存储所有商品数据。filteredFoods是一个空数组，用于存储根据搜索关键词过滤后的商品数据。keyword是一个空字符串，用于存储搜索关键词。
在onLoad函数中，通过调用云数据库的get()方法获取商品数据，并将数据存储到foods数组和filteredFoods数组中。获取数据成功后，使用setData()方法更新页面数据。

handleInput函数用于处理输入框输入事件，获取输入的关键词并存储到keyword变量中。然后，使用正则表达式对商品数据进行模糊搜索，将符合条件的数据存储到filteredFoods数组中，并使用setData()方法更新页面数据

<view class="main">
  <view class="search-box">
    <view class="search-container">
      <input class="search-input" placeholder="请输入搜索关键词" bindinput="handleInput" />
    </view>
  </view>

  <view class="food-list">
    <block wx:for="{{filteredFoods}}" wx:key="index">
      <view class="food-item">
        <navigator url="{{'../details/details?id=' + item._id}}">
          <image class="food-image" src="{{item.img}}"></image>
          <text class="food-name">{{item.name}}</text>
        </navigator>
      </view>
    </block>
  </view>
</view>
这段代码构建了一个搜索框和一个商品列表。在搜索框中，使用input元素绑定了handleInput函数，当输入框的值发生变化时会触发该函数。商品列表通过wx:for指令遍历filteredFoods数组，将每个商品显示为一个food-item元素，其中包含商品图片和名称。



数据库设计
在腾讯云数据库上建了六张表
1.	用户表Custmomer
用户表Custmomer存储用户的信息
表1 用户表
表名	属性	类型	描述	示例

Custmomer	Userid	String	用户id	SWE001
	Address	String	地址	
	password	String	密码	123456
	Persona	String	身份	学生
	Phone	String	电话	
	Orderlist	Arrary	订单列表	
	Point	String	积分	1000
	Nickname	String	昵称	张三

 
2.订单表Order
订单表ODERS，存储用户及其订单的基本信息
 
3.购物车表Cart
 
4.分类表Type
 
5.收藏表Collection
 
6.食物信息表FoodInfo

......
