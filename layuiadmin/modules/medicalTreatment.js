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


  layui.use(['admin', 'echarts', 'laydate', 'form', 'table', 'laypage', 'jquery'], function () {
    var $ = layui.$
      , admin = layui.admin
      , form = layui.form
      , echarts = layui.echarts
      , laydate = layui.laydate
      , table = layui.table
      , laypage = layui.laypage
      , $ = layui.jquery
      , dept_name = null
    laydate.render({
      elem: '#test1'
    });
    laydate.render({
      elem: '#test1-1'
    });
    form.on('select(dept_name)', function (data) {
      dept_name = data.value
    });
    const getMedical = (pageNum, pageSize, dept_name) => {
      $.ajax(`${ip}/api/treatmentGroup/getDataList`, {
        data: { pageNum, pageSize, dept_name },
        success(res) {
          initPage(res.data.total, res.data.pageNum, res.data.pageSize)
          initTable(res.data, res.data.pageSize)
        }
      })
    }
    const initTable = (data, size) => {
      const list = data.list;
      list.map((item, index) => {
        item.num = index + 1;
      })
      table.render({
        elem: '#demo'
        , height: 450
        , even: true
        , data: list
        , limit: size
        , cols: [[
          { field: 'num', title: "序号", width: 80, 'align': 'center' }
          , { field: 'dept_code', title: "科室编码", }
          , { field: 'dept_name', title: "科室名称", width: 250, }
          , { field: 'di_code', title: "编码", }
          , { field: 'wg_name', title: "诊疗组名称", }
          , { field: 'wg_code', title: "编码", width: 200 }
          , { field: 'di_name', title: "医疗组名称", }
          , { field: 'do_code', title: "医生编码", }
          , { field: 'do_name', title: "医生名称", }
        ]]
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
        }
      });
    }
    const initPage = (count, pageNum, pageSize) => {
      laypage.render({
        elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
        count: count, //数据总数，从服务端得到
        layout: ['prev', 'page', 'next', 'limit'],
        curr: pageNum,
        limit: pageSize,
        jump(obj, first) {
          //首次不执行
          let num = pageNum;
          let size = pageSize;
          if (!first) {
            if (num !== obj.curr || size !== obj.limit) {
              getMedical(obj.curr, obj.limit, dept_name)
            }
          }
        }
      })
    }
    getMedical(1, 10);
    const getSelect = (level, dept_name) => {
      $.ajax(`${ip}/api/treatmentGroup/list`, {
        data: { level, dept_name },
        success(res) {
          initSelect(res.data)
        }
      })
    }
    const initSelect = (data) => {
      $.each(data, function (index, item) {
        $('#dept_name').append(new Option(item.Dep_name));// 下拉菜单里添加元素
      });
      layui.form.render("select");
    }
    getSelect(1)
    $('.layui-btn').click(() => {
      getMedical(1, 10, dept_name)
    })
  });


  exports('medicalTreatment', {})
});