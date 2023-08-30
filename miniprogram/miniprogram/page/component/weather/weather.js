// page/component/weather/weather.js
import { BMapWX } from 'bmap-wx.min.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weatherData: '',
  },

  onLoad: function () {
    var that = this;
  // 新建百度地图对象 
  var BMap = new BMapWX({
    ak: 'je3GPClsj3j3pKWvTFpkyWzEYLFCaSLh'
 });
  var fail = function (data) {
    console.log(data)
  };
 var success = function (data) {
    var weatherData = data.currentWeather[0];
   weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
    that.setData({
        weatherData: weatherData
    });
  }
 // 发起weather请求 
    BMap.weather({
    fail: fail,
    success: success
  });
}
})
