import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'


//请求拦截器
axios.interceptors.request.use(config => {
    //如果存在token，请求携带这个token
    if(window.sessionStorage.getItem('tokenStr')){
        config.headers['Authorization'] = "Bearer " +window.sessionStorage.getItem('tokenStr');
    }
    return config;
},error => {
    ElMessage.error("您还为登录，请先登录");
    this.$router.replace('/');
})

//响应拦截器
axios.interceptors.response.use(success => {
    //登录成功
    if (success.data.code == 0) {
    }
    else if(success.data.code === 4){
        ElMessage.error(success.data.message);
    }
    else if(success.data.code === 1){
        ElMessage.error("用户名或密码错误");
    }
    else{
        if(success.data.msg !== null){
            ElMessage.success(success.data.message);
        }
        else{
            ElMessage.error("不知道什么原因，操作失败了:(");
        }
    }
    return success.data;
},error => {
    if(error.status === 504 || error.status === 404){
        ElMessage.error({message: '服务器被吃了QAQ'});
    }
    else if(error.status === 403){
        ElMessage.error({message: '权限不足，请联系管理员'});
    }
    else{
        if(error.data && error.data.code===4){
            ElMessage.error({message: error.data.message});
        }
        else{
            ElMessage.error({message: '未知错误'});
        }
    }
    return;
})

let base = '';

//传送json格式的post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}