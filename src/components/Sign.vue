<template>
    <div>
        <x-header :left-options="{showBack: false}">J次集团课程签到系统</x-header>
        <divider>{{courseInfo.course.name}}</divider>
        <card :header="{title:'课程信息'}">
            <div slot="content" class="card-demo-flex card-demo-content01">
                <div class="vux-1px-l vux-1px-r">
                    主会场
                    <br/>
                    <span>{{courseInfo.course.course_place}}</span>
                </div>
                <div class="vux-1px-r">
                    主讲人
                    <br/>
                    <span>{{courseInfo.course.course_speaker}}</span>
                </div>
            </div>
        </card>
        <card :header="{title:'课程时间'}">
            <div slot="content" class="card-demo-flex card-demo-content01">
                <div class="vux-1px-l time-start-right">
                    <span>{{courseInfo.course_time.start}}</span>
                </div>
                <div class="vux-1px-r">
                    <span>{{courseInfo.course_time.end}}</span>
                </div>
            </div>
        </card>
        <group v-if="inputShow">
            <x-input title="工号" placeholder="点此输入工号" v-model="signData.user_id" required></x-input>
            <x-input title="姓名" placeholder="点此输入姓名" v-model="signData.user_name" required></x-input>
            <x-input title="部门" placeholder="点此输入部门" v-model="signData.user_department" required></x-input>
            <x-input title="地点" placeholder="点此输入地点" v-model="signData.sign_place" required></x-input>
        </group>
    </div>
</template>

<script>
import { Group, Cell, XHeader, Divider, Card, XInput } from 'vux'
import Config from '../config'
export default {
    components: {
        Group,
        Cell,
        XHeader,
        Divider,
        Card,
        XInput
    },
    data() {
        return {
            // note: changing this line won't causes changes
            // with hot-reload because the reloaded component
            // preserves its current state and we are modifying
            // its initial state.
            courseInfo: {
                course:
                {
                    course_id: "",
                    name: "",
                    creat_time: 1505704843,
                    course_time_start: 1505705340,
                    course_time_end: 1505707200,
                    course_place: "",
                    course_speaker: "",
                    course_sign_id: ""
                },
                course_time:
                {
                    start: "2017-01-01 12:00:00",
                    end: "2017-01-01 12:00:00"
                }
            },
            inputShow: false,
            signData: {
                course_id: '',
                user_id: '',
                user_name: '',
                user_department: '',
                sign_place: ''
            }
        }
    },
    mounted() {
        console.log(this.$route.params.id);
        console.log(Config.service.getCourseInfoUrl);
        this.getCourseInfo(this.$route.params.id).then(res => {
            if (res.status) {
                this.courseInfo = res.data;
                this.inputShow = true;
            }

        });
        // this.locToString(1, 2).then(res => {
        //     console.log(res)
        // })
        this.getLocation().then(res => {
            var addComp = res.addressComponents;
            alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        }).catch(err => {
            console.log(err)
            alert(err);
        });
    },
    methods: {
        getCourseInfo: function(id) {
            return new Promise((resolve, reject) => {
                let url = `${Config.service.getCourseInfoUrl}/?cid=${id}`
                this.$http.get(url).then(res => {
                    resolve(res.data);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        getLocation: function() {
            return new Promise((resolve, reject) => {
                var map = new BMap.Map("allmap");
                var longitude, latitude, _this = this;
                navigator.geolocation.getCurrentPosition(function(position) {
                    longitude = position.coords.longitude;
                    latitude = position.coords.latitude;
                    var gpsPoint = new BMap.Point(longitude, latitude);
                    BMap.Convertor.translate(gpsPoint, 0, function(point) {
                        var geoc = new BMap.Geocoder();
                        geoc.getLocation(point, function(rs) {
                            resolve(rs)
                        });
                    });

                }, function(error) {
                    var errorType = ['您拒绝共享位置信息', '获取不到位置信息', '获取位置信息超时'];
                    reject(errorType[error.code - 1]);
                });
            })

        },
    },
}
</script>

<style scoped lang="less">
@import '~vux/src/styles/1px.less';

.card-demo-flex {
    display: flex;
}

.card-demo-content01 {
    padding: 10px 0;
}

.card-padding {
    padding: 15px;
}

.card-demo-flex>div {
    flex: 1;
    text-align: center;
    font-size: 12px;
}

.card-demo-flex span {
    color: #f74c31;
}

.time-start-right::after {
    content: '至';
    position: absolute;
    top: 0;
    right: 0;
}
</style>
