<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary">查看</el-button>
      <el-button class="filter-item" type="primary">编辑</el-button>
      <el-button class="filter-item" type="primary">新增</el-button>
      <el-button class="filter-item" type="danger">删除</el-button>
      <el-button class="filter-item" type="primary">密码重置</el-button>
    </div>
    <el-table
      ref="serveTable"
      v-loading="loading"
      :data="usersList"
      style="width: 85%"
      border
      @selection-change="slectionChange"
    >
      <el-table-column type="selection" align="center" width="45" />
      <el-table-column type="index" align="center" label=" 序号" width="50" />
      <el-table-column align="center" label="昵称" width="160">
        <template slot-scope="{ row }">
          <a>{{ row.username }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label=" 账号" width="120">
        <template slot-scope="{ row }">
          {{ row.Cname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码" width="120">
        <template slot-scope="{ row }">
          {{ row.password }}
        </template>
      </el-table-column>
      <el-table-column prop="password" label="密码" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            class="view"
            type="text"
            @click.native.prevent="view(scope.$index, scope.row)"
          ><i class="el-icon-view" /></el-button>{{ scope.row.password_d }}
        </template>
      </el-table-column>

      <el-table-column align="center" label=" 更新人">
        <template slot-scope="{ row }">
          {{ row.updateName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label=" 创建日期">
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
export default {
  name: '',
  data() {
    return {
      usersList: [],
      loading: false,
      userQuery: {
        size: 10,
        current: 1,
        optimizeCountSql: true,
        optimizeJoinOfCountSql: true,
        searchCount: true
      },
      total: 10,
      multipleSelection: []
    }
  },
  created() {},
  mounted() {
    this.initMsg()
  },
  methods: {
    initMsg() {
      this.$axios.get('/api/list').then((res) => {
        console.log(res.data.data)
        this.usersList = res.data.data
      })
    },
    slectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(size) {
      this.recordQuery.size = size
    },
    handleCurrentChange(currentPage) {
      this.recordQuery.current = currentPage
    }
  }
}
</script>

<style lang="scss" scoped>
a:hover {
  color: #1184e9;
}
.customWidth {
  width: 40%;
}
.view {
  position: absolute;
  top: 7px;
  left: 200px;
}
</style>
