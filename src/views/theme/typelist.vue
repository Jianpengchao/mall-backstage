<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        @click="handleShow"
      >查看</el-button>
      <el-button class="filter-item" type="primary">编辑</el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleAdd"
      >新增</el-button>
      <el-button
        class="filter-item"
        type="danger"
        @click="handleDelete"
      >删除</el-button>
    </div>
    <el-table
      ref="serveTable"
      v-loading="loading"
      :data="shopList"
      style="width: 100%"
      border
      @row-click="rowClick"
      @selection-change="slectionChange"
    >
      <el-table-column type="selection" align="center" width="45" />
      <el-table-column type="index" align="center" label=" 序号" width="50" />
      <el-table-column align="center" label="商品图片" min-width="160">
        <template slot-scope="{ row }">
          <img :src="row.shopPic" style="width: 120px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column align="center" label="家具名称" min-width="160">
        <template slot-scope="{ row }">
          <a @click="handleShow(row)">{{ row.shopName }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="家具类型" min-width="120">
        <template slot-scope="{ row }">
          {{ row.shopType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格" min-width="130">
        <template slot-scope="{ row }">
          {{ row.shopPrice }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="商品描述"
        min-width="180"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          {{ row.shopDes }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建日期" min-width="180">
        <template slot-scope="{ row }">
          {{ row.createTime | moment }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" min-width="180">
        <template slot-scope="{ row }">
          {{ row.creater }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="shopQuery.current"
      :page-sizes="[10, 20, 50, 100, 1000]"
      :page-size="shopQuery.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @pagination="handleByPage"
    />

    <!-- 增加弹窗 -->
    <el-dialog :visible.sync="dialogVisible" :title="disTitle">
      <el-form
        ref="shopInfo"
        :model="shopInfo"
        label-width="85px"
        label-position="right"
      >
        <el-row>
          <el-col :span="11">
            <div class="grid-content bg-purple">
              <el-form-item label="家具名称" prop="shopName">
                <el-input
                  v-model="shopInfo.shopName"
                  style="width: 100%"
                  :disabled="inputDisabled"
                />
              </el-form-item>
              <el-form-item label="家具类型" prop="shopType">
                <el-input
                  v-model="shopInfo.shopType"
                  style="width: 100%"
                  :disabled="inputDisabled"
                  placeholder="家具类型"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="11" style="margin-left: 25px">
            <el-form-item label="价格" prop="shopPrice">
              <el-input
                v-model="shopInfo.shopPrice"
                style="width: 100%"
                :disabled="inputDisabled"
                placeholder=" 价格"
              />
            </el-form-item>
            <el-form-item label=" 创建人">
              <el-input
                v-model="shopInfo.creater"
                :disabled="inputDisabled"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片">
          <el-input v-model="shopInfo.shopPic" style="width: 100%" />
          <el-button @click="selectPic"> 选择图片 </el-button>
        </el-form-item>
        <el-form-item label="商品描述" prop="shopDes">
          <el-input
            v-model="shopInfo.shopDes"
            style="width: 100%"
            :disabled="inputDisabled"
            placeholder=" 商品描述"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>

      <div v-show="!inputDisabled" style="text-align: center">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="uploadVisible" title="图片上传">
      <el-upload
        class="upload-demo"
        action=""
        :on-change="handleChange"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button
          slot="trigger"
          size="small"
          type="primary"
        >选取文件</el-button>
        <el-button
          size="small"
          type="primary"
          style="margin-left: 12px"
          @click="uploadPic"
        >上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      shopList: [],
      loading: false,
      shopQuery: {
        size: 10,
        current: 1,
        optimizeCountSql: true,
        optimizeJoinOfCountSql: true,
        searchCount: true
      },
      total: 10,
      multipleSelection: [],
      fileList: [],
      temp: {},
      shopInfo: {},
      dialogVisible: false,
      disTitle: '',
      inputDisabled: false,
      uploadVisible: false
    }
  },
  created() {
    this.handleByPage()
  },
  mounted() {},
  methods: {
    handleChange(file, fileList) {
      console.log(file)
      this.temp = file
    },
    uploadPic() {
      var formData = new FormData() // 创建formdata对象
      formData.append('file', this.temp.raw) // 将文件信息 append 进入formdata对象 key值 为后台 single 设置的值
      this.$axios
        .post('/api/shopPic/upload', formData, {
          Headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          console.log(res)
          this.uploadVisible = false
          this.$message.success('上传成功')
          this.shopInfo.shopPic = 'http://localhost:3060' + res.data.data
        })
        .catch(() => {
          this.$message.error('上传失败，请重试')
        })
    },

    // 查看
    handleShow(row) {
      if (row.isTrusted === true) {
        if (this.multipleSelection.length === 0) {
          this.$message.error('请选择要查看的数据！')

          return
        } else if (this.multipleSelection.length > 1) {
          this.$message.warning('只能查看一条数据!')

          return
        }
        this.$axios
          .get('/api/showInfo/?id=' + this.multipleSelection[0].id)
          .then((res) => {
            this.shopInfo = res.data.data[0]
          })
        this.disTitle = '查看'
        this.inputDisabled = true
        this.dialogVisible = true
      } else {
        this.disTitle = '查看'
        this.dialogVisible = true
        this.inputDisabled = true
        this.$axios
          .get('/api/showInfo/?id=' + row.id)
          .then((res) => {
            this.shopInfo = res.data.data[0]
          })
      }
    },
    handleAdd() {
      this.disTitle = '新增'
      this.shopInfo = {}
      this.dialogVisible = true
    },
    confirm() {
      const data = this.shopInfo
      if (this.disTitle === '新增') {
        this.$axios({
          url: 'http://localhost:3060/addShop',
          method: 'POST',
          data
        }).then((res) => {
          console.log(res)
          this.dialogVisible = false
          this.handleByPage()
        })
      } else if (this.disTitle === '编辑') {
        this.$axios({
          url: 'http://localhost:3060/addShop',
          method: 'POST',
          data
        }).then((res) => {
          console.log(res)
          this.dialogVisible = false
          this.handleByPage()
        })
      }
    },
    selectPic() {
      this.uploadVisible = true
    },
    handleByPage() {
      this.loading = true
      this.$axios.get('/api/queryByPage').then((res) => {
        console.log(res)
        this.shopList = res.data.data
        this.total = res.data.data.length
        this.loading = false
      })
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
      this.shopQuery.size = size
      this.handleByPage()
    },
    handleCurrentChange(currentPage) {
      this.loading = true
      this.shopQuery.current = currentPage
      this.handleByPage()
    },
    // 删除
    handleDelete() {
      if (this.multipleSelection.length !== 1) {
        this.$message.error('请选择一条数据数据！')

        return
      }
      this.$confirm('是否删除该商品', '温馨提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .delete('/api/deleteShop/?id=' + this.multipleSelection[0].id)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.handleByPage()
          })
      })
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
