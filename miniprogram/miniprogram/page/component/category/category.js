wx. cloud. init()
const db = wx.cloud.database()

   Page({
    data: {
      category: [
            {name:'肉类',id:'meet'},
            {name:'蔬菜',id:'vegetable'},
            {name:'水果',id:'friut'},
            {name:'零食',id:'lingshi'},
            {name:'主食',id:'zhushi'}
        ],
        cate:[],
        selectCate:[],
        typeId: 1,
        detail: [],
        isScroll: false,
        toView: '',
        curIndex: 1
      },
        onLoad(){
          wx.cloud.database().collection("Type").get().then(res => {
            this.setData({
              category: res.data
            }) 
         });
         wx.cloud.database().collection("FoodInfo")
          .get()
          .then(res=>{
            let select = res.data.filter((item) => {
              return item.type == "1"
            })
              this.setData({
                cate:res.data,
                selectCate: select
              })
              console.log("获取数据成功",select);
          })
          .catch(err=>{
              console.log("获取数据失败",err)
         })
         
       
       },
      
    
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
        
          }
        });
        
    
