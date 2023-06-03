<template>
  <div style="text-align: center">
    订单详情
  </div>
  <el-input v-model="searchID" size="default" style="width: 20%" placeholder="请输入订单ID进行搜索" clearable @keyup.enter.native="search" @clear="initData" @blur="searchID?search():initData()" />
  <div class="home">
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
<!--订单id、订单创建时间、订单更新时间、订单删除时间、请求充电量、充电开始时间、充电结束时间、充电费用、服务费、总费用、用户id、充电桩id-->
      <el-table-column type="index" width="50" />
      <el-table-column prop="id" label="订单id" width="80" align="center" />
      <el-table-column prop="created_at" label="订单创建时间" sortable width="140" align="center" />
      <el-table-column prop="updated_at" label="订单更新时间" sortable width="140" align="center" />
      <el-table-column prop="deleted_at" label="订单删除时间" width="120" align="center" />
      <el-table-column prop="chargeAmount" label="请求充电量" width="120" align="center" />
      <el-table-column prop="chargeStartTime" label="充电开始时间" width="120" align="center" />
      <el-table-column prop="chargeEndTime" label="充电结束时间" width="120" align="center" />
      <el-table-column prop="chargeFee" label="充电费用" width="100" align="center" />
      <el-table-column prop="serviceFee" label="服务费" width="100" align="center" />
      <el-table-column prop="totalFee" label="总费用" sortable  width="120" align="center" />
      <el-table-column prop="userId" label="用户id" width="100" align="center" />
      <el-table-column prop="pileId" label="充电桩id" width="100" align="center" />
    </el-table>
    <div class="example-pagination-block">
      <el-pagination align='center'
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[1,5,10,20]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableData.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>

import {getRequest, putRequest} from "@/utils/api";
import { reactive, toRefs } from "vue";

export default {
  name:"OrderDetails",
  data(){
    return{
      userID: '',
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 5, // 每页的数据条数
      getParams:{
        limit:-1,
        skip:0,
      },
      searchID:'',
      tableData : [
        //详单编号、详单生成时间、充电桩编号、充电电量、充电时长、启动时间、停止时间、充电费用、服务费用、总费用
      ],
    }
  },
  methods:{
    initData() {
      getRequest('/charge/bills',this.getParams).then(resp=>{
        //alert(JSON.stringify(resp));
        if(resp) {
          if(resp.code === 4){
            this.$message({
              type: 'error',
              message: '查询失败'
            })
          }
          //将数据放到表格里
          else{
            this.tableData = resp;
            this.total = resp.length;
            this.userID = resp[0].userId;
          }
        }
      })
    },
    search(){
      getRequest(`/charge/bill/${this.searchID}`).then(resp=>{
        if(resp) {
          if(resp.code === 4){
          }
          else if(resp.userId !== this.userID){
            this.$message({
              type: 'error',
              message: '该订单不属于该用户'
            })
          }
          //将数据放到表格里
          else{
            this.$message({
              type: 'success',
              message: '查询成功'
            })
            this.tableData = [resp];
            this.total = resp.length;
          }
        }
      })
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    }


  },
  mounted() {
    this.initData();
  }
}
</script>

<style scoped>
.el-pagination{
  margin-top: 20px;
  justify-content: center;
}
</style>