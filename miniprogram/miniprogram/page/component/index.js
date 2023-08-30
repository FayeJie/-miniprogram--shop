wx. cloud. init()

Page({

    onLoad(){
      
      wx.cloud.database().collection("FoodInfo")
      .get()
      .then(res=>{
        console.log("请求成功",res);
        this.setData({
          list:res.data
        })
        
      })
      .catch(err=>{
        console.log("请求失败",err);
      })
    },
   
   

  data: {
   
    imgUrls: [
      '/image/top1.png',
      '/image/top2.png',
      '/image/top3.png'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800
  },
 
})