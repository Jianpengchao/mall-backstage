<template>
  <div class="app-container">
    <div class="filter-container" >
      <el-button class="filter-item" type="primary" 
        >查看</el-button
      >
      <el-button class="filter-item" type="primary" 
        >编辑</el-button
      >
      <el-button class="filter-item" type="primary"
        >新增</el-button
      >
      <el-button class="filter-item" type="danger" 
        >删除</el-button
      >
      <el-button class="filter-item" type="primary" 
        >密码重置</el-button
      >
    </div>
    <el-table
      :data="usersList "
      style="width: 85%"
      @selection-change="slectionChange"
      border
      v-loading="loading"
      ref="serveTable"
    >
      <el-table-column type="selection" align="center" width="45">
      </el-table-column>
      <el-table-column type="index" align="center" label=" 序号" width="50">
      </el-table-column>
      <el-table-column align="center" label="用户名" width="160">
        <template slot-scope="{ row }">
          <a>{{ row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label=" 账号" width="120">
        <template slot-scope="{ row }">
          {{ row.account }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码" width="120">
        <template slot-scope="{ row }">
          {{ row.psd }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话" width="180">
        <template slot-scope="{ row }">
          {{ row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label=" 更新人">
        <template slot-scope="{ row }">
          {{ row.updateName }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="userQuery.current"
      :page-sizes="[10, 20, 50, 100, 1000]"
      :page-size="userQuery.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
       @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: '',
  data() {
    return {
      usersList:[],
      loading: false,
      userQuery: {
        size: 10,
        current: 1,
        optimizeCountSql: true,
        optimizeJoinOfCountSql: true,
        searchCount: true,
      },
      total:10,
      multipleSelection: [],
     
    }
  },
  created() {
  },
   mounted () {
        this.initMsg();
    },
  methods: {
    initMsg(){
     this.$axios.get("/api/list").then((res)=>{
      console.log(res.data.list)
    this.usersList = res.data.list
      })
      },
   slectionChange(val){
      this.multipleSelection = val
   },
    handleSizeChange(size) {
      this.recordQuery.size = size;
    },
    handleCurrentChange(currentPage) {
      this.recordQuery.current = currentPage;
    },
  },
}
</script>

<style lang="scss" scoped>
a:hover {
  color: #1184e9;
}
.customWidth {
  width: 40%;
}
</style>
