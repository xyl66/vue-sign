<template>
  <div>
    <x-header :left-options="{showBack: false}">J次集团课程签到系统</x-header>
    <divider class="title">{{courseInfo.course.name}}</divider>
    <card :header="{title:'课程信息'}">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-l vux-1px-r">
          主会场
          <br/>
          <span class="iconfont icon-changdi"></span>
          <span>{{courseInfo.course.course_place}}</span>
        </div>
        <div>
          主讲人
          <br/>
          <span class="iconfont icon-ren"></span>
          <span>{{courseInfo.course.course_speaker}}</span>
        </div>
      </div>
    </card>
    <card :header="{title:'课程时间 '+courseInfo.course_time.date}">
      <div slot="content" class="card-time-flex card-demo-content01">
        <div class="vux-1px-l time-right">
          <span>{{courseInfo.course_time.start}}</span>
          <br/>
          <span class="iconfont icon-shijian">开始</span>
        </div>
        <div>
          <span>{{courseInfo.course_time.end}}</span>
          <br/>
          <span class="iconfont icon-shijian">结束</span>
        </div>
      </div>
    </card>
    <group>
      <x-input v-for="(item,index) of inputArr" :key="index" :title="item.key" :placeholder="'请点此填写'+item.key" v-model="item.value">
        <span slot="label" class="title-section">
          <span :class="item.icon" class="iconfont demo-icon" style="font-size:20px;vertical-align:middle;"></span>{{item.key}}</span>
      </x-input>
    </group>
    <x-button type="primary" action-type="button" @click.native="signHandler">确认签到</x-button>
  </div>
</template>

<script>
import { XHeader, XButton, GroupTitle, Group, Cell, CellBox, XInput, Divider, Card, Flexbox, FlexboxItem } from 'vux'
import Config from '../config'
function showError(error) {
  var innerHTML;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("用户拒绝对获取地理位置的请求。")
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("位置信息是不可用的。")
      break;
    case error.TIMEOUT:
      console.log("请求用户地理位置超时。")
      break;
    case error.UNKNOWN_ERROR:
      console.log("未知错误。")
      break;
  }
}
export default {
  components: {
    XHeader,
    XButton,
    GroupTitle,
    Group,
    Cell,
    CellBox,
    XInput,
    Divider,
    Card,
    Flexbox,
    FlexboxItem,
  },
  data() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      courseInfo: {
        course: {
          name: '',
          course_place: '',
          course_speaker: ''
        },
        course_time: {
          start: '',
          end: ''
        }
      },
      inputArr: [{
        icon: 'icon-gonghao',
        key: '工号',
        value: ''
      }, {
        icon: 'icon-xingming',
        key: '姓名',
        value: ''
      }, {
        icon: 'icon-bumen',
        key: '部门',
        value: ''
      }, {
        icon: 'icon-didian',
        key: '地点',
        value: ''
      }
      ],
      value: ''
    }
  },
  mounted() {
    this.getCourseInfo(this.$route.params.id).then(res => {
      let date=res.data.course_time.start.substr(0,10),
      newstart=res.data.course_time.start.substr(11),
      newend=res.data.course_time.end.substr(11);
      Object.assign(res.data.course_time,{date:date,start:newstart,end:newend});
      this.courseInfo = res.data
    }).then(this.getLocation()).catch(err => {
      this.$vux.toast.show({
        text: err.msg,
        type: 'warn'
      })
    })
  },
  methods: {
    getCourseInfo: function(id) {
      return new Promise((resolve, reject) => {
        var url = `${Config.service.getCourseInfoUrl}/?cid=${id}`;
        this.$http.get(url).then(response => {
          //求助的部分
          if (response.data.status) {
            resolve(response.data)
          } else {
            reject(response.data)
            // 显示文字
          }
        })
      })
    },
    signHandler: function() {
      var querystring = require('querystring');
      var url = Config.service.couseSignUrl,
        signdata = {
          course_id: this.courseInfo.course.course_id,
          user_id: this.inputArr[0].value,
          user_name: this.inputArr[1].value,
          user_department: this.inputArr[2].value,
          sign_place: this.inputArr[3].value,
        };
      this.$http.post(url, querystring.stringify(signdata)).then(res => {
        console.log(res.data)
        this.$vux.alert.show({
          title: '课程签到系统提醒您',
          content: res.data.msg,
          onShow() {
            console.log('Plugin: I\'m showing')
          },
          onHide() {
            console.log('Plugin: I\'m hiding now')
          }
        })
      }, err => {
        // 失败回调
      });
    },
    getAddress: function(position) {
      console.log("dingwei")
      var address,
        _this = this,
        latitude = position.coords.latitude,
        longitude = position.coords.longitude,
        lnglatXY = [longitude, latitude];
      //通过高德地图 API获取街道名称
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      geocoder.getAddress(lnglatXY, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          _this.inputArr[3].value = result.regeocode.formattedAddress; //返回地址描述
        }
      });
    },
    getLocation: function() {
      var _this = this
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(_this.getAddress, _this.showError);
      }
      else {
        console.log("该浏览器不支持获取地理位置");
      }
    },
    showError: function(error) {
      var innerHTML;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.$vux.toast.show({
            text: "用户拒绝对获取地理位置的请求",
            type: 'warn'
          })
          break;
        case error.POSITION_UNAVAILABLE:
          this.$vux.toast.show({
            text: "位置信息是不可用的",
            type: 'warn'
          })

          break;
        case error.TIMEOUT:
          this.$vux.toast.show({
            text: "请求用户地理位置超时",
            type: 'warn'
          })

          break;
        case error.UNKNOWN_ERROR:
          this.$vux.toast.show({
            text: "未知错误。",
            type: 'warn'
          })
          break;
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '~vux/src/styles/1px.less';

.title {
  font-weight: 600;
}

.card-demo-flex,
.card-time-flex {
  display: flex;
}

.card-demo-content01 {
  padding: 10px 0;
}

.card-padding {
  padding: 15px;
}

.card-demo-flex>div,
.card-time-flex>div {
  flex: 1;
  text-align: center;
  font-size: 12px;
}

.card-demo-flex div:first-child span {
  color: #ff629a;
}

.card-demo-flex div:last-child span {
  color: #1296db;
}

.card-time-flex span:first-child {
  color: #000;
  font-size: 12px;
}

.card-time-flex div:first-child span:last-child {
  color: #04be02;
  font-size: 14px;
}

.card-time-flex div:last-child span:last-child {
  color: #f74c31;
  font-size: 14px;
}

.time-right::after {
  content: "至";
  position: absolute;
  top: 0px;
  right: 0px;
  color: black;
  height: 100%;
  line-height: 41px;
}

.demo-icon {
  font-family: vux-demo;
  font-size: 20px;
  color: #04be02;
}

.title-section {
  margin-right: 1.5em;
}
</style>
