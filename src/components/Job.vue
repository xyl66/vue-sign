<template>
  <div>
    <x-header :left-options="{showBack: false}">富士康科技集团</x-header>
    <divider class="title">财会核算共享中心衡阳分部招募</divider>
    <group>
      <section v-for="(item,index) of inputArr" :key="index">
        <x-input v-if="item.key!='性别:'"  :title="item.key" :placeholder="'请点此填写'+item.key" v-model="item.value" required>
          <span slot="label" class="title-section">
            <span :class="item.icon" class="iconfont demo-icon" style="font-size:20px;vertical-align:middle;"></span>{{item.key}}</span>
        </x-input>
        <section class="sex-section" v-else>
          <span :class="item.icon" class="iconfont demo-icon" style="font-size:20px;vertical-align:middle;"></span>
          <selector  class="sel-section"  :title="item.key" :options="list" v-model="item.value">
            </selector>
        </section>
        
        
      </section>
    </group>
    <x-button type="primary" action-type="button" @click.native="signHandler">确认报名</x-button>
  </div>
</template>

<script>
import {
  XHeader,
  XButton,
  GroupTitle,
  Group,
  Cell,
  CellBox,
  XInput,
  Selector,
  Divider,
  Card,
  Flexbox,
  FlexboxItem
} from "vux";
import Config from "../config";
function showError(error) {
  var innerHTML;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("用户拒绝对获取地理位置的请求。");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("位置信息是不可用的。");
      break;
    case error.TIMEOUT:
      console.log("请求用户地理位置超时。");
      break;
    case error.UNKNOWN_ERROR:
      console.log("未知错误。");
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
    Selector,
    Divider,
    Card,
    Flexbox,
    FlexboxItem
  },
  data() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      courseInfo: {
        course: {
          name: "",
          course_place: "",
          course_speaker: ""
        },
        course_time: {
          start: "",
          end: ""
        }
      },
      inputArr: [
        {
          icon: "icon-xingming",
          key: "姓名",
          value: ""
        },
        {
          icon: "icon-xingbie",
          key: "性别:",
          value: "man"
        },
        {
          icon: "icon-dianhua",
          key: "电话",
          value: ""
        },
        {
          icon: "icon-xuexiao",
          key: "学校",
          value: ""
        },
        {
          icon: "icon-zhuanye",
          key: "专业",
          value: ""
        },
        {
          icon: "icon-classes",
          key: "班级",
          value: ""
        }
      ],
      list: [{key: 'man', value: '男'}, {key: 'woman', value: '女'}],
      value: ""
    };
  },
  mounted() {},
  methods: {
    signHandler: function() {
      var querystring = require("querystring");
      var url = Config.service.jobSignUrl,
        signdata = {
          user_name: this.inputArr[0].value,
          user_sex:this.inputArr[1].value,
          user_tel: this.inputArr[2].value,
          user_school: this.inputArr[3].value,
          user_special: this.inputArr[4].value,
          user_classes: this.inputArr[5].value
        };
      this.$http.post(url, querystring.stringify(signdata)).then(
        res => {
          console.log(res.data);
          this.$vux.alert.show({
            title: "招募报名系统提醒您",
            content: res.data.msg,
            onShow() {
              console.log("Plugin: I'm showing");
            },
            onHide() {
              console.log("Plugin: I'm hiding now");
            }
          });
        },
        err => {
          // 失败回调
        }
      );
    }
  }
};
</script>

<style scoped lang="less">
@import "~vux/src/styles/1px.less";

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

.card-demo-flex > div,
.card-time-flex > div {
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
.title-section::after {
  content: ":";
}
.sex-section{
  display: flex;
}
.sex-section span{
  padding: 10px 15px;
  margin-right: -30px;
}
.sel-section,.sel-section::before{
  border-top:1px solid #fff; 
}
.sel-section{
  width: 100%;
}
</style>
