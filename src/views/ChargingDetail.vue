<template>
  <div style="text-align:center;">
    充电详情
  </div>
  <div style="display: flex">
    <el-col :sm="12" :lg="6" class="chargingState"
            v-loading="loading"
            element-loading-text="正在加载用户充电状态"
            :element-loading-spinner="svg"
            element-loading-svg-view-box="-10, -10, 50, 50"
            display: flex
    >
      <el-result :icon="iconStyle" :title="titleMessage" :sub-title="subtitleMsg">
        <template #extra>
          <div>
            <el-button @click="switchShowInput" :icon="Edit" circle />
            <input v-if="showInput" type="text" style="width: 20%;margin: 0 15px 0 15px " v-model="inputValue" @blur="hideInput" @keyup.enter="saveInput" />
            <el-button id="leftButton" v-if="!showInput" :disabled="leftNochange" type="primary" @click="leftButtonHandle">{{ leftButtonMsg }}</el-button>
            <el-button id="rightButton" type="primary" :disabled="modeNoChange" @click="rightButtonHandle">{{ rightButtonMsg }}</el-button>
            <el-button @click="getCharge" :icon="RefreshRight" circle />
          </div>
        </template>
      </el-result>
    </el-col>
  </div>
</template>

<script>
import {getRequest, postRequest, putRequest, deleteRequest} from "@/utils/api";
import {ElMessage} from "element-plus";
import {Edit, RefreshRight} from "@element-plus/icons-vue";
import {left} from "core-js/internals/array-reduce";

  export default {
    name: 'ChargingDetail',
    computed: {
      Edit() {
        return Edit
      },
      RefreshRight() {
        return RefreshRight
      }
    },
    data() {
      return {
        inputValue: '',
        showInput: false,
        loading:true,
        pile:88,
        titleMessage: "网络错误",
        subtitleMsg:"请检查网络连接",
        leftButtonMsg:"左按钮",
        rightButtonMsg:"右按钮",
        iconStyle:"error",
        cancelClicked: false,
        fastChargingMode: false,
        modeNoChange: false,
        leftNochange: false,
        states:"",
        position:0,
        chargeApplyInfo:{
          amount:300,
          fast:true,
          totalAmount:300,
        },
        totalAmount: 300,
      }
    },
    methods:{
      switchShowInput(){
        if (this.showInput) {
          this.showInput = false;
        } else {
          this.showInput = true;
        }
      },
      saveInput() {
        // 处理保存操作逻辑
        this.chargeApplyInfo.amount = this.inputValue;
        this.showInput = false;
        this.modifyCharge(this.chargeApplyInfo);
      },
      //初始化界面
      updateUI(resp){
        this.fastChargingMode = resp.fast;
        this.states = resp.status;
        this.position = resp.position;
        //根据用户的状态来确定页面显示什么
        if(resp.status === "充电中"){
          this.iconStyle = "success";
          this.subtitleMsg = "您的爱车在" + resp.pile.toString() + "号充电桩";
          this.titleMessage = "正在充电" ;
          this.leftButtonMsg = "取消充电";
          this.leftNochange = false;
          this.rightButtonMsg = "模式:" + (resp.fast ? "快充" : "慢充");
          this.modeNoChange = true;
        }else if(resp.status === "等候区排队中"){
          this.iconStyle = "info";
          this.titleMessage = "等候区排队中";
          if(resp.position === 0)
            this.subtitleMsg = "别着急,下一辆就到你啦!";
          else if(resp.position != 0 )
            this.subtitleMsg = "您的爱车正在排队,前方还有" + resp.position.toString() + "辆车";
          this.leftButtonMsg = "取消排队";
          this.leftNochange = false;
          this.rightButtonMsg = "模式:" + (resp.fast ? "快充" : "慢充");
          this.modeNoChange = false;
        }else if(resp.status === "充电区等候中"){
          this.iconStyle = "warning";
          this.titleMessage = "小钱等您插上充电枪哟";
          this.leftNochange = false;
          this.leftButtonMsg = "取消充电";
          this.rightButtonMsg = "模式:" + (resp.fast ? "快充" : "慢充");
          this.modeNoChange = true;
        }else if(resp.status === "充电完成"){
          this.iconStyle = "success";
          this.leftButtonMsg = "再次充电";
          this.leftNochange = false;
          this.modeNoChange = false;
          this.rightButtonMsg = "模式:" + (resp.fast ? "快充" : "慢充");
          this.titleMessage = "本次充电完成";
          this.subtitleMsg = "您的爱车在" + resp.pile.toString() + "号充电桩，请记得将充电桩归位哟";
        }else if(!resp.status){
          this.iconStyle = "error";
          this.titleMessage = "暂未充电";
          this.subtitleMsg = "您还没有充电,点击按钮开始充电吧";
          this.leftButtonMsg = "开始充电";
          this.rightButtonMsg = "模式:" + (resp.fast ? "快充" : "慢充");
          this.modeNoChange = false;
        }
      },
      leftButtonHandle() {
        if(this.states === "充电中")
          this.finishCharge();
        else if(this.states === "等候区排队中")
          this.cancelCharge();
        else if(this.states === "充电区等候中")
          this.cancelCharge();
        else {
          this.createCharge();
        }
        document.getElementById("leftButton").blur();
      },
      rightButtonHandle() {
        if (this.fastChargingMode == true) {
          this.fastChargingMode = false;
        } else {
          this.fastChargingMode = true;
        }
        if(this.states === "等候区排队中"){
          this.modifyCharge(this.chargeApplyInfo);
        }
        this.rightButtonMsg = "模式:"+(this.fastChargingMode ? "快充" : "慢充");
        document.getElementById("rightButton").blur();
      },
      getCharge(){
        console.log("getCharge");
        this.loading = true;
        getRequest('/charge').then(resp=>{
          console.log(JSON.stringify(resp));
          //alert(JSON.stringify(resp));
          //查询到用户有充电请求
          if(resp && resp.code === 0) {
            console.log("getCharge success");
            this.pile = resp.pile;
            //修改页面状态
            this.updateUI(resp);
          }
          //用户没有充电
          else if(resp && !resp.status){
            console.log("getCharge fail1");
            //修改页面状态
            this.updateUI(resp);
            this.iconStyle = "error";
            this.titleMessage = "暂未充电";
            this.subtitleMsg = "您还没有充电,点击按钮开始充电吧";
            this.leftButtonMsg = "开始充电";
            this.rightButtonMsg = "模式:" + (this.fastChargingMode ? "快充" : "慢充");
            ElMessage.warning("用户没有充电请求");
          }else{
            console.log("getCharge fail2");
            this.updateUI(resp);
          }
        })
        this.loading = false;
      },
      modifyCharge(){
        console.log("modifyCharge");
        this.chargeApplyInfo.fast = this.fastChargingMode;
        this.chargeApplyInfo.totalAmount = 100 - this.chargeApplyInfo.amount;
        putRequest('/charge',this.chargeApplyInfo).then(resp=>{
          //修改页面状态
          console.log(JSON.stringify(resp));
        })
      },
      createCharge(){
        console.log("createCharge");
        this.loading = true;
        this.chargeApplyInfo.amount = Math.random()*300;
        this.chargeApplyInfo.fast = this.fastChargingMode;
        this.chargeApplyInfo.fast = this.fastChargingMode;
        postRequest('/charge', this.chargeApplyInfo).then(resp=>{
          //修改页面状态
          if(resp){
            this.leftButtonMsg = "取消充电";
            this.updateUI(resp);
          }
          else
            this.getCharge();
        })
        this.loading = false;
      },
      finishCharge(){
        postRequest('/charge/finish').then(resp=>{
          if(resp && resp.code === 4){
            console.log(JSON.stringify(resp));
            ElMessage.error(resp.message);
          }
          else if(resp){
            ElMessage.success("取消成功");
            //修改页面状态
            this.iconStyle = "success";
            this.leftButtonMsg = "再次充电";
            this.leftNochange = false;
            this.rightButtonMsg = "模式:" + (this.fastChargingMode ? "快充" : "慢充");
            this.titleMessage = "本次充电完成";
            this.subtitleMsg = "您的爱车在" + this.pile + "号充电桩，请记得将充电桩归位哟";
            this.modeNoChange = false;
            this.states = "充电完成";
            console.log(JSON.stringify(resp));
            this.$alert("本次收费" + JSON.stringify(resp.totalFee) + "元", '查询信息', {
                confirmButtonText: '关闭',
            });
          }else{
            ElMessage.error("正在充电，无法取消");
          }
        })
      },
      cancelCharge(){
        deleteRequest('/charge').then(resp=>{
          if(resp && resp.code === 0){
            ElMessage.success("取消成功");
            //修改页面状态
            this.updateUI(resp);
          }else{
            ElMessage.error("正在充电，无法取消");
          }
        })
      },
      hideInput() {
        // 处理输入框失去焦点时的操作逻辑
        this.showInput = false;
      }
    },
    mounted() {
      this.getCharge();
    }
  }
</script>

<style scoped>
.chargingState {
  margin:20px auto;
  align-items: center;
}
</style>