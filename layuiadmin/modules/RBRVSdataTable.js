/**

 @Name：layuiAdmin 主页控制台
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：GPL-2
    
 */
layui.define(function (exports) {

  /*
    下面通过 layui.use 分段加载不同的模块，实现不同区域的同时渲染，从而保证视图的快速呈现
  */


  layui.use(['admin', 'echarts', 'laydate', 'form', 'table'], function () {
    var $ = layui.$
      , admin = layui.admin
      , form = layui.form
      , echarts = layui.echarts
      , laydate = layui.laydate
      , table = layui.table
    let start = null;
    let end = null;
    let iih_name = null;
    let userRole = null;
    let excel_total = 0;//excel导出统一接口设置pagesize
    laydate.render({
      elem: '#test1',
      done(value) {
        start = value
      }
    });
    laydate.render({
      elem: '#test1-1',
      done(value) {
        end = value
      }
    });
    // form.on('select(city)', function(data){
    //   iih_name = data.value
    // });
    let role = layui.data('user').data.userRole
    if (role === '本科') {
      iih_name = layui.data('user').data.depName
    } else {

    }
    const getRBRVS = () => {
      table.render({
        elem: '#demo'
        , height: 450
        , url: `${ip}/api/data/getDataList` //数据接口
        // , url:'http://106.13.46.134:8090/api/data/getDataList'
        , page: true //开启分页
        , request: {
          pageName: 'pageNum',
          limitName: 'pageSize'
        },
        where: {
          start, end, iih_name
        }
        , headers: { "Accept": "application/json;charset=UTF-8" }
        , limit: 10

        // ,skin: 'nob' //行边框风格
        , even: true //开启隔行背景
        , cols: [[ //表头
          { field: 'num', title: "序号", width: 80, 'align': 'center' }
          , { field: 'iih_name', title: "iih科室名称",width:150 }
          , { field: 'iih_code', title: "iih科室编码", width: 150, }
          , { field: 'iih_group', title:'iih组别' }
          , { field: 'group_name', title:'iih组名',width:180 }
          , { field: 'area_type', title:'片区分类',width:150}
          , { field: 'money', title:'金额' }
          , { field: 'data_value', title: "点值",  }
          , { field: 'yy_code', title: "用友科室编码",width:180 }
          , { field: 'yy_name', title: "用友科室名称", width:180}  
          , { field: 'upload_time', title: "时间", }
          , { field: 'is_open',title:'是否开放', width:120}
          , { field: 'data_type', title:'数据类别' ,width:120}
          , { field: 'execute_helper', title:'执行辅助' ,width:120}
          , { field: 'data_source', title:'来源' ,width:120} 
        ]]
        , parseData(res) {
          const { data } = res
          excel_total = data.total
          data.list.map((item, index) => {
            item.num = index + 1
          })
          return {
            code: 0,
            count: data.total,
            data: data.list
          }
        }
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
        }
      });
    }
    getRBRVS();
    $('.rbrvs_search').click(() => {
      getRBRVS()
    })

    // 导出excel
    const initExcel = (data) => {
      let header = ['iih科室名称','iih科室编码','iih组别','iih组名','片区分类','金额','点值','用友科室编码','用友科室名称','时间','是否开放','数据类别','执行辅助','来源']
      let dataArr = []
      $.each(data,(index,item) => {  
        let arr = []
        // 这里顺序要一致就只能自己调整了
        arr[0] = item.iih_name
        arr[1] = item.iih_code
        arr[2] = item.iih_group
        arr[3] = item.group_name
        arr[4] = item.area_type
        arr[5] = item.money
        arr[6] = item.data_value
        arr[7] = item.yy_code
        arr[8] = item.yy_name
        arr[9] = item.upload_time
        arr[10] = item.is_open
        arr[11] = item.data_type
        arr[12] = item.execute_helper
        arr[13] = item.data_source 
        dataArr.push(arr)
      })

      table.exportFile(header,dataArr,'xls','RBRVS')
    }
    $('.export_excel').click(() => {
      // pageSize后端如果数据库只有一条数据，pagesize传总数1过去会查不到，前端处理一下,excel_total为1就改成2，其它不变  
      if(excel_total === 1){
        excel_total = 2
      }
      $.ajax(`${ip}/api/data/getDataList`, {
        data: {
          pageNum: 1,
          pageSize: excel_total
        }
      }).then(res => {
        let { list } = res.data
        initExcel(list)
      })
    })
  });


  exports('RBRVSdataTable', {})
});