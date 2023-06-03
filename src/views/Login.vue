<template>
  <div ref='vantaRef' class="Page">
    <el-form :rules="rules"
             key="loginForm"
             v-loading="loading"
             element-loading-text="正在登录"
             :element-loading-spinner="svg"
             element-loading-svg-view-box="-10, -10, 50, 50"
             ref="loginForm"
             :model="loginForm"
             class = "loginContainer"
             label-width="80px"
             @keyup.enter.native="login"
    >
      <h3 class="loginTitle">充电桩系统登录</h3>
      <el-form-item prop="username" label="用户名">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="text" auto-complete="false" v-model="loginForm.password" show-password placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login" style="width: 30%;margin-left: 70px;margin-top: 8px">登录</el-button>
      </el-form-item>
      <div class="lastColumn">
        <el-link @click="toRegister">我没有账号，点击注册</el-link>
      </div>
    </el-form>
  </div>

</template>

<script>
import {postRequest} from "@/utils/api";
import WAVES from 'vanta/src/vanta.waves'
import * as THREE from 'three'

//创建代理服务器

export default {
  name: 'userCharging',
  data() {
    return {
      proxyAddress: 'http://10.128.238.56:8080',
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'change' }
        ]
      },
      loading:false,

    }
  },

  methods: {
    login() {
      this.$refs.loginForm.validate((valid)=> {
        if (valid) {
          this.loading = true;
          postRequest('/user/login',this.loginForm).then(resp=>{
            if(resp && resp.code == "0") {
              this.loading = false;
              //存储用户token
              const token = resp.token;
              window.sessionStorage.setItem('tokenStr',token);
              console.log(token);
              //跳转首页
              this.$router.replace('/home');
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
    toRegister(){
      this.$router.push('/Register');
    },
    applyProxy() {
      // 应用代理地址
      const proxyConfig = {
        ws: false,
        target: this.proxyAddress,
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        },
        // 使用 proxyConfig 更新 http-proxy-middleware 的代理配置
        // ...
      };
      this.$axios.defaults.proxy = proxyConfig;
      console.log(this.$axios.defaults.proxy);
    }
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
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 250px auto;
  width: 400px;
  padding: 15px 35px 15px 35px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0 auto 30px auto;
  text-align: center;
}

.loginRemember{
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

.proxyModify{
  border-radius: 15px;
  background-clip: padding-box;
  margin: 250px auto;
  width: 400px;
  padding: 15px 35px 15px 35px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.lastColumn{
  text-align: right;
}
</style>