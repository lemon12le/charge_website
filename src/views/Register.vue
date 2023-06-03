<template>
  <div  ref='vantaRef' class="Page">
    <el-form :rules="rules"
             v-loading="loading"
             element-loading-text="正在注册"
             :element-loading-spinner="svg"
             element-loading-svg-view-box="-10, -10, 50, 50"
             element-loading-background="rgba(122, 122, 122, 0.8)"
             ref="registerForm"
             :model="registerForm"
             class = "registerContainer"
             label-width="80px"
             @keyup.enter.native="register"
    >
      <h3 class="registerTitle">充电桩系统注册</h3>
      <el-form-item prop="username" label="用户名">
        <el-input type="text" auto-complete="false" v-model="registerForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="text" auto-complete="false" v-model="registerForm.password" show-password placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="passwordConfirm" label="确认密码">
        <el-input type="text" auto-complete="false" v-model="registerForm.passwordConfirm" show-password placeholder="请再输入一次密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register" style="width: 30%;margin-left: 70px;margin-top: 8px">注册</el-button>
      </el-form-item>
      <div style="text-align: right"><el-link @click="toLogin">我已有账号，点击登录</el-link></div>
    </el-form>
  </div>
</template>


<script>
import {postRequest} from "@/utils/api";
import {ElMessage} from "element-plus";
import WAVES from 'vanta/src/vanta.waves'
import * as THREE from 'three'

export default {
  name: 'userCharging',
  data() {
    let checkPassword=((rule,value,callback)=>{
      if(value.trim().length==0){
        callback(new Error("请确认密码不能为空"));
      }else if(value.trim().length<6 || value.trim().length >16){
        callback(new Error("长度在 6 到 16 个字符"));
      }
      else if(value !=this.registerForm.password){
        callback(new Error("两次密码不一致"));
      }else{
        callback();
      }
    })
    return {
      registerForm: {
        username: '',
        password: '',
        passwordConfirm:'',
      },
      account:{
        username: '',
        password: '',
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change'}
        ],
        passwordConfirm: [
          { required: true, validator:checkPassword, trigger: 'change'}
        ]
      },
      loading: false,

    }
  },
  methods: {
    toLogin(){
      this.$router.push('/');
    },
    register() {
      this.$refs.registerForm.validate((valid)=> {
        if (valid) {
          this.loading = true;
          this.account.username = this.registerForm.username;
          this.account.password = this.registerForm.password;
          postRequest('/user/register',this.account).then(resp=>{
            if(resp && resp.code == "0") {
              ElMessage.success(resp.message);
              //跳转首页
              this.$router.push('/');
            }
            this.loading = false;
            // 打印出返回的信息
            // alert(JSON.stringify(resp));
          })
        } else {
          this.$message.error('填写信息有误，请重新填写');
        }
      })
    },
  },

  mounted() {
    this.vantaEffect = WAVES({
      el: this.$refs.vantaRef,
      THREE: THREE
    })
    this.vantaEffect.setOptions({
      el: "#your-element-selector",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      shininess: 21.00,
      waveHeight: 23.50,
      waveSpeed: 1.10,
      zoom: 0.8
    })
  },

  beforeDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  },
}
</script>


<style>
.registerContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 400px;
  padding: 15px 35px 15px 35px;
  background: white;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.registerTitle {
  margin: 0 auto 30px auto;
  text-align: center;
}

.registerRemember{
  text-align: left;
  margin:0 0 15px 0;
}

.Page {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>