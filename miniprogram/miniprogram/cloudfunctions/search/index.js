// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let keyWords = event._keyword
  
  try {
    //这里的keyWords是前端小程序访问的参数_keyword
    return await db.collection('FoodInfo').limit(50).where(
        db.command.or([{
            //使用正则查询，实现对‘name’字段的搜索的模糊查询
            name: db.RegExp({
              regexp: keyWords,
              options: 'i', //大小写不区分
            }),
          }
          //下面可以增加更多的选项,可以做多字段的选择
        ])
      ).get()
  } catch (e) {
    console.log(e)
  }
  return {
    event,
  }
}