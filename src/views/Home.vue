<template>
  <div>
    <div class="common-layout">
      <el-container>
        <el-header class="el-header">
          <div class="header">
            <el-image
                :size="32"
                style="margin-top: 5px"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAXRJREFUWEdjZMABOM5/V/jPwHwflzwp4owMDIk/DNkWYNPDSB8H/G/8YcjeQJEDDDgZGS58/0+Kx+FqGRmo4IDFCswMgfxMRDng938GBsFLv6nvgFAB4hzw/d+oA0ZDgAYhYMfDyHD/F1GZAKzo8S9ElqVKNiTeakyVNHWAPBsjw0Mk32Iv7ahQEOEKgRoJZoaWF3/xBhDNQiBWiIkBhN3u/BkYB/wwYGU49OX/wDhgthwz2PcD4gBQltylwgIOdpAD0NPAw18MKAmT6mkAZDnIEdgAKEeoX0NNE1R1ACjYQcGPC4ASJChUkAHVHADK8ze1IEGPDbS8+Ic1S1LNAeiWwhIiLC3gyo50cQDHBUQLCN2hNHcAtninSRrAFgWgLDegRfHid/8IVpQ0iwKCNkMVjDpg6IQA+5kfyv+ZmWogUcfIw8jwP4TYeCag7sJ/BoYLIDUsf39XfTPhfg5Tj1KjgBzAwMx0h0qWYjWG+e9vqUHlAAC79FMwV2UoBAAAAABJRU5ErkJggg=="
            />
            <span class="text-large font-600 mr-3" style="margin-right: 5px"> 吊炸天系统v0.2 </span>
            <el-tag style="font-size: 60%">欢迎您使用吊炸天充电桩!我是最吊的!</el-tag>
            <div style="  display: flex;
                          align-items: center;
                          justify-content: center;
                          margin-top: -25px">
              <el-date-picker
                  v-model="timeValue"
                  type="datetime"
                  placeholder="Select date and time"
                  style="margin-right: 5px"
              />
              <el-button @click="setTime" type="danger" style="margin-right: 5px"> 重置 </el-button>
              <el-tag style="font-size: 60%;margin-right: 5px">{{ "时间"+currentTime }}</el-tag>
              <el-button @click="toggleTimer" :icon=" !isTimerRunning ? VideoPlay : VideoPause" circle />
            </div>
            <el-button type="danger" @click="logOut" style="float:right; margin-top: -30px" plain>注销</el-button>
          </div>
        </el-header>
        <el-divider />
        <el-container>
          <el-aside width="200px">
            <el-menu @select="menuClick">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><Menu /></el-icon>功能列表
                </template>
                  <el-menu-item index="ChargingDetail"><el-icon><Van /></el-icon>充电详情</el-menu-item>
                  <el-menu-item index="OrderDetails"><el-icon><List /></el-icon>订单详情</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-aside>
          <el-main >
            <router-view/>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import {Menu, VideoPause, VideoPlay} from "@element-plus/icons-vue";
import {getRequest, postRequest, putRequest} from "@/utils/api";

  export default {
    name:"Home",
    computed: {
      VideoPause() {
        return VideoPause
      },
      VideoPlay() {
        return VideoPlay
      }
    },
    components: {Menu},
    data() {
      return {
        currentTime: '',
        isTimerRunning: true,
        timer: null,
        timeValue: '',
      };
    },
    methods: {
      setTime() {
        //把this.timeValue转换成时间戳
        const timestamp = new Date(this.timeValue).getTime();
        console.log(timestamp);
        //把时间戳发送给服务器
        putRequest('/time', timestamp).then(response => {
          console.log(response);
        })
            .catch(error => {
              console.log(error);
            });
      },
      startTimer() {
        console.log('start timer');
        this.timer = setInterval(() => {
          this.fetchTime();
        }, 1000);
      },
      stopTimer() {
        console.log('stop timer');
        clearInterval(this.timer);
        this.timer = null; // 重置定时器变量
      },
      toggleTimer() {
        console.log('toggle timer');
        if (this.isTimerRunning) {
          this.stopTimer();
        } else {
          this.startTimer();
        }
        this.isTimerRunning = !this.isTimerRunning;
      },
      menuClick(index) {
        this.$router.push(index);
      },
      logOut() {
        this.$router.push('/');
        window.sessionStorage.removeItem('tokenStr');
      },
      fetchTime() {
        getRequest('/time').then(response => {
          console.log(response);
          const timestamp = response.time; // 假设服务器返回的时间在time字段中
          const date = new Date(timestamp ) ; // 将时间戳转换为毫秒
          this.currentTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        })
            .catch(error => {
              console.error('获取时间失败', error);
            });
      },
    },
    mounted() {
      this.fetchTime(); // 初始化时获取一次时间
      this.timer = setInterval(this.fetchTime, 1000); // 每秒钟获取一次时间
    },
    beforeUnmount() {
      this.stopTimer();
    },
  }
</script>

<style scoped>
.el-header{
  width: 100%;
  height: 40px;
  top: 0;
  left: 0;
}
</style>