<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary">查看</el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleEdit"
      >编辑</el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleAdd"
      >新增</el-button>
      <el-button class="filter-item" type="danger">删除</el-button>
    </div>
    <el-table
      ref="serveTable"
      v-loading="loading"
      :data="usersList"
      style="width: 85%"
      border
      @selection-change="slectionChange"
      @row-click="rowClick"
    >
      <el-table-column
        type="selection"
        align="center"
        width="45"
      />
      <el-table-column
        type="index"
        align="center"
        label=" 序号"
        width="50"
      />
      <el-table-column align="center" label=" 账号" width="120">
        <template slot-scope="{ row }">{{ row.account }}</template>
      </el-table-column>
      <el-table-column v-if="showPsd" align="center" label="密码" width="120">
        <template slot-scope="{ row }">{{ row.password }}</template>
      </el-table-column>
      <el-table-column align="center" label="用户名称" width="180">
        <template slot-scope="{ row }">{{ row.nickName }}</template>
      </el-table-column>
      <el-table-column align="center" label=" 性别">
        <template slot-scope="{ row }">{{ row.sex }}</template>
      </el-table-column>
      <el-table-column align="center" label=" 地址">
        <template slot-scope="{ row }">{{ row.address }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="300px">
        <template slot-scope="{ row }">{{ row.time | moment }} </template>
      </el-table-column>
      <el-table-column align="center" label=" 用户描述">
        <template slot-scope="{ row }">{{ row.description }}</template>
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
    <!-- 增加弹窗 -->
    <el-dialog :visible.sync="dialogVisible" :title="disTitle">
      <el-form
        ref="user"
        :model="user"
        label-width="85px"
        label-position="right"
      >
        <el-row>
          <el-col :span="11">
            <div class="grid-content bg-purple">
              <el-form-item label="账号" prop="account">
                <el-input
                  v-model="user.account"
                  style="width: 100%"
                  :disabled="inputDisabled"
                  placeholder="账号"
                />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="user.password"
                  style="width: 100%"
                  :disabled="inputDisabled"
                  type="password"
                  placeholder="密码"
                  @input="changeInput"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="11" style="margin-left: 25px">
            <el-form-item label="用户名称" prop="nickName">
              <el-input
                v-model="user.nickName"
                style="width: 100%"
                :disabled="inputDisabled"
                placeholder=" 用户名称"
              />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select
                v-model="user.sex"
                placeholder="请选择"
                :disabled="inputDisabled"
              >
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="user.address"
            style="width: 100%"
            :disabled="inputDisabled"
          />
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model="user.description"
            :disabled="inputDisabled"
            style="width: 100%"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>

      <div v-show="!inputDisabled" style="text-align: center">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      disTitle: '',
      showPsd: false,
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
      multipleSelection: [],
      dialogVisible: false,
      user: {},
      sexOptions: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        }
      ],
      inputDisabled: false
      // rules: {
      //   account: [
      //     { required: true, message: "请输入账号", trigger: "blur" },
      //     { min: 3, max: 100, message: "长度在 3 到 100 个字符", trigger: "blur" },
      //   ],
      //    password: [
      //     { required: true, message: "请选择用户的密码", trigger: "blur" },
      //   ],
      //    nickName: [
      //     { required: true, message: "请输入用户名称", trigger: "blur" },
      //     { min: 2, max: 100, message: "长度在 2 到 100 个字符", trigger: "blur" },
      //   ],
      //   sex: [
      //     { required: true, message: "请选择性别", trigger: "blur" },
      //   ],
      //   address: [
      //     { required: true, message: "请输入地址", trigger: "blur" },
      //   ],

      // },
    }
  },
  created() {
    this.initMsg()
  },
  mounted() {},
  methods: {
    initMsg() {
      this.loading = true
      this.$axios.get('/api/userlist').then((res) => {
        console.log(res)
        this.usersList = res.data.data
        this.total = res.data.data.length
        this.loading = false
      })
    },
    handleAdd() {
      this.disTitle = '新增'
      this.dialogVisible = true
    },
    handleEdit(row) {
      if (this.multipleSelection.length === 1) {
        row = this.multipleSelection[0]
      } else if (this.multipleSelection.length > 1) {
        this.$alert('一次只能编辑一个选项', {
          confirmButtonText: '确定'
        })
        return
      } else {
        this.$message('请选择要编辑的数据！')
        return
      }
      this.disTitle = '编辑'
      this.dialogVisible = true
      this.$axios
        .get('/api/user/?id=' + this.multipleSelection[0].id)
        .then((res) => {
          console.log(res)
          this.user = res.data.data[0]
        })
    },
    confirm() {
      // let data = this.$qs.stringify(this.user)
      // console.log(data);
      // this.$axios.post("/api/add",data).then(res => {
      //   console.log(res)
      // });
      const data = this.user
      this.$axios({
        url: 'http://localhost:3060/add',
        method: 'POST',
        data
      }).then(
        (res) => {
          console.log(res)
          this.initMsg()
        },
        (fail) => {
          console.log(fail)
        }
      )
      this.dialogVisible = false
    },
    changeInput() {
      this.passwordChange = 2
    },
    slectionChange(val) {
      this.multipleSelection = val
    },
    rowClick(row) {
      // 监听row-click事件，实现选中
      this.$refs.serveTable.toggleRowSelection(row)
    },
    handleSizeChange(size) {
      this.loading = true
      this.userQuery.size = size
      this.handleByPage()
    },
    handleCurrentChange(currentPage) {
      this.loading = true
      this.userQuery.current = currentPage
      this.handleByPage()
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
</style>
