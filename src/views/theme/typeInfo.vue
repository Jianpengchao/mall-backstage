<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleQueryByPage"
      >
        查询
      </el-button>
       <el-tooltip  effect="light" content="导出为当前页面的Excel" placement="bottom">
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="excel"
        @click="handleDownload"
      >
        导出
      </el-button>
      </el-tooltip>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleAddOrganization"
      >
        新增
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="handleEdit"
      >
        编辑
      </el-button>
      
      <el-button
        class="filter-item"
        type="primary"
        @click="handleShow"
      >
        查看
      </el-button>
      <el-button
        class="filter-item"
        type="danger"
        @click="handleBatchDeleted"
      >
        删除
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="organizationsList"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
      ref="serveTable"
      @row-click="rowClick"
      :row-style="rowStyle"
      :row-class-name="rowClassName"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="50" label="序号"/>
      <el-table-column align="center" label="类型名称" width="150">
        <template slot-scope="{ row }">
         <a @click="rowClickShow(row)"> {{ row.typename }} </a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型编号" width="120">
        <template slot-scope="{ row }">
         {{ row.typecode }} 
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" width="120">
        <template slot-scope="{ row }">
          {{ row.createBy }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人姓名" width="120">
        <template slot-scope="{ row }">
          {{ row.createName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新人" width="120">
        <template slot-scope="{ row }">
          {{ row.updateBy }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="{ row }">
          {{ row.createDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="200">
        <template slot-scope="{ row }">
          {{ row.updateDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" :show-overflow-tooltip="true">
        <template slot-scope="{ row }">
          {{ row.des }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="organizationQuery.current"
      :page-sizes="[10, 20, 50, 100, 1000]"
      :page-size="organizationQuery.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @pagination="handleQueryByPage"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType "
    >
      <el-form :model="organization" label-width="80px" ref="organization" label-position="right" :rules="rules">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="organization.name" placeholder="机构名称" style="width: 260px" :disabled="isshow"/>
        </el-form-item>
        <el-form-item label="机构代码" prop="code">
          <el-input v-model="organization.code" placeholder="机构代码" style="width: 260px" :disabled="isshow"/>
        </el-form-item>
        <el-form-item label="上级机构" >
          <treeselect
            v-model="organization.parentId"
            :multiple="false"
            lazy
            noChildrenText="暂无子选项"
            loadingText="organizationsTrees"
            :max-height="150"
            :disabled = "isshow"
            :options="organizationsTrees"
            :show-count="true"
            placeholder="请选择机构"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="机构描述" prop="description">
          <el-input v-model="organization.des" type="textarea" placeholder="机构描述" style="width: 400px" :disabled="isshow"/>
        </el-form-item>
      </el-form>
      <div style="text-align: center" >
        <el-button type="danger" @click="cancel('organization')">取消</el-button>
        <el-button type="primary" v-if="isShow" @click="confirm('organization')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      organization: {
       
      },
      rules:{
          name: [
            { required: true, message: '请输入机构名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        
          
      },
    
      organizationsList: [],
      organizationsTrees: [],
      organizationQuery: {
        size: 10,
        current: 1,
        optimizeCountSql: true,
        optimizeJoinOfCountSql: true,
        searchCount: true
      },
      dialogVisible: false,
      dialogType: '',
      listLoading: true,
      total: 0,
      downloadLoading: false,
      multipleSelection: [],
      checkStrictly: false,
      loading: false,
      name: null,
      isshow:false,
      isShow:true,
      
    }
  },
  created(){
    this.handleType()
  },
  methods: {
     handleType(){
     this.$axios.get("/api/typelist").then((res)=>{
      console.log(res)
    this.organizationsList = res.data.typelist
    this.total = res.data.typelist.length

      })
      },
    rowClickShow(row){
      this.dialogVisible = true
       this.isshow = true
      this.isShow = false
      this.dialogType = "查看"
      getOrganization(row.id).then(res=>{
        console.log(res)
        this.organization = res
      })

    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    rowStyle({ row, rowIndex }) {
      Object.defineProperty(row, "rowIndex", {
        //给每一行添加不可枚举属性rowIndex来标识当前行
        value: rowIndex,
        writable: true,
        enumerable: false,
      });
    },

    //监听row-click事件，实现选中
    rowClick(row, column, event) {
      let refsElTable = this.$refs.serveTable; // 获取表格对象
      let findRow = this.multipleSelection.find(
        (c) => c.rowIndex == row.rowIndex
      ); //找到选中的行
      if (findRow) {
        refsElTable.toggleRowSelection(row, false); //如过重复选中，则取消选中
        return;
      }
      refsElTable.toggleRowSelection(row, true); // 实现选中行中选中事件
    },
 
    getOrganizationsTree() {
      queryOrganizationsTree().then((response) => {
        console.log(response)
        this.organizationsTrees = response
      });
    },
     //实现选中高亮
    rowClassName({ row, rowIndex }) {
      let rowName = "",
        findRow = this.multipleSelection.find(
          (c) => c.rowIndex === row.rowIndex
        );
      if (findRow) {
        rowName = "current-row ";
      }
      return rowName; //也可以再加上其他类名 如果有需求的话
    },

    
    handleBatchDeleted() {
      const ids = []
      console.log(this.multipleSelection)
      if (this.multipleSelection.length == 0) {
        this.$message.error('请选择要删除的数据！')
        return
      }
      this.multipleSelection.forEach((row) => {
        ids.push(row.id)
      })
      this.$confirm('确认删除?', '温馨提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await batchDeleted(ids).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.handleQueryByPage()
        })
      }).catch((err) => {
        console.error(err)
      })
    },
    handleQueryByPage(){
      this.loading = true
      queryByPage(this.organizationQuery).then( (res) => {
          this.organizationsList = res.records
          this.total = res.total
          this.loading = false
        },
        
      )
    },
    // queryOrganization(listObj){
    //   let p =  new Promise((resolve,reject)=>{
    //     listObj.forEach((e,index)=>{
    //        getOrganization(e.organizationId).then(res=>{
    //         listObj[index]['company'] = res.label
    //         if(listObj[listObj.length-1].company != undefined){
    //           resolve(listObj)
    //         }
    //     })
    //     })
    //   })
    //   return p
    // },
    handleShow(){
      this.isshow = true
      this.isShow = false
      this.dialogType = "查看"
       let row = new Object()
      if (this.multipleSelection.length == 1) {
        if(this.organization.parentId == '上级'){
          this.organization.parentId = ''
        }
         this.dialogVisible = true
        row = this.multipleSelection[0]
      } else if (this.multipleSelection.length > 1) {
        this.$alert('一次只能查看一个选项', {
          confirmButtonText: '确定'
        })
        return
      } else {
        this.$message('请选择要查看的选项！')
        return
      }
        getOrganization(row.id).then(res=>{
            this.organization = res
         })
    },


    handleSizeChange: function(size) {
      this.listLoading = true
      this.organizationQuery.size = size
      this.handleQueryByPage()
    },

    handleCurrentChange: function(currentPage) {
      this.listLoading = true
      this.organizationQuery.current = currentPage
      this.handleQueryByPage()
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '机构名称',
          '机构代码',
          '机构描述',
          '创建人姓名',
          '创建时间',
          '更新时间'
        ]
        const filterVal = [
          'name',
          'code',
          'description',
          'createName',
          'createDate',
          'updateDate'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '机构表'
        })
        this.downloadLoading = false
      })
    },

    formatJson(filterVal) {
      return this.organizationsList.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },

    handleAddOrganization() {
      this.dialogType = '新增'
     this.getOrganizationsTree()
      this.dialogVisible = true
      this.isshow = false
      this.isShow = true
      this.organization = {parentId: null}
    },

    handleEdit() {
      this.isshow = false
      this.isShow = true
      let row = new Object()
      if (this.multipleSelection.length == 1) {
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
      this.dialogType = '编辑'
      this.dialogVisible = true
      this.organization = row
      getOrganization(row.id).then((response) => {
        console.log(response)
        this.organization = response
       // hasOwnProperty  检测一个属性是否是对象的自有属性
        if(this.organization.hasOwnProperty("parentId") && this.organization.parentId == '0'){
          this.organization.parentId = null
        }
      })
    },

    handleDelete(row, index) {
      if (this.multipleSelection.length < 1) {
        this.$alert('请选择要删除的项', {
          confirmButtonText: '确定'
        })
        return
      }
      const ids = []
      this.$confirm('确认删除?', '温馨提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteOrganization(row.id).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.handleQueryByPage()
        })
      }).catch((err) => {
        console.error(err)
      })
    },

    async confirm(organization) {
      this.$refs[organization].validate((valid) => {
          if (valid) {
      const isEdit = this.dialogType === '编辑'
      this.dialogVisible = false
      if( !this.organization.hasOwnProperty("parentId") || this.organization.parentId == undefined  
        || this.organization.parentId == null || this.organization.parentId == ''){
            this.organization["parentId"] = "0"
      }
      if (this.dialogType === '新增') {
        
        console.log(this.organization)
        addOrganization(this.organization).then((response) => {
          console.log(response)
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        this.getOrganizationsTree()
          this.handleQueryByPage()
        })
      } else if (this.dialogType === '编辑') {
        updateOrganization(this.organization).then((response) => {
          this.$notify({
            title: '温馨提醒',
            dangerouslyUseHTMLString: true,
            message: `操作成功`,
            type: 'success'
          })
          this.handleQueryByPage()
        })
      }
      } else {
            console.log('error submit!!');
             this.$message('请填写必填项')
            return false;
          }
        })
    },
    cancel(organization){
      this.dialogVisible = false
      this.$refs[organization].resetFields()
   
    }
  }
}
</script>
<style scoped>
a:hover{
  color: skyblue;
}
.filter-container-left {
  width: 200px;
  text-align: center;
  display: flex;
  justify-content: space-around;
}

.filter-container {
  display: flex;
}
</style>
