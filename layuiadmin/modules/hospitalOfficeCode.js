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


  layui.use(['admin', 'echarts', 'laydate', 'form', 'table', 'jquery', 'tableSelect'], function () {
    var $ = layui.$
      , admin = layui.admin
      , form = layui.form
      , echarts = layui.echarts
      , laydate = layui.laydate
      , table = layui.table
      , $ = layui.jquery;
    tableSelect = layui.tableSelect;
    let start = null //获取本科室对码列表开始时间
    let end = null //获取本科室对码列表结束时间
    let large = {}
    let small = {}
    // 
    // let small_dept = {}
    // let big_dept = {}
    let large_dept_name = null
    let large_dept_code = null
    let small_dept_name = null
    let small_dept_code = null
    let keyword = null;
    let keyword2 = null;
    laydate.render({
      elem: '#test1',
      type:'datetime',
      done(value) {
        start = value
        console.log(value)
      }
    });
    laydate.render({
      elem: '#test1-1',
      type:'datetime',
      done(value) {
        end = value

      }
    });
    const loadTable = () => {

      table.render({
        elem: '#test4'
        , height: 450
        , url: `${ip}/api/hospitalDic/getHospitalDic` //数据接口
        , page: true //开启分页
        , limit: 10
        , request: {
          pageName: 'pageNum',
          limitName: 'pageSize'
        }
        , where: {
          start, end, large_dept_name, small_dept_name
        }
        , parseData(res) {
          const { data } = res
          let list = data.list
          list.map((item, index) => item.num = index + 1)
          return {
            code: 0,
            count: data.total,
            data: list
          }
        }
        // ,skin: 'nob' //行边框风格
        , even: true //开启隔行背景
        , cols: [[ //表头
          { field: 'num', title: "序号", width: 80, 'align': 'center' }
          , { field: 'large_dept_name', title: "大科室", }
          , { field: 'large_dept_code', title: "大科室编码", width: 250, }
          , { field: 'small_dept_name', title: "小科室", }
          , { field: 'small_dept_code', title: "小科室编码", }
          , { field: 'operation_time', title: "最后一次对码时间", width: 200 }
          , { field: 'operator', title: "最后一次对码人", }
          , { field: 'action', title: "操作", toolbar: '#barDemo', }
        ]]
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
        }
      });
    }
    // 小科室
    $('.small_open').click(() => {
      openSmall()
    })
    const openSmall = () => {
      layer.open({
        type: 1,
        // skin: 'layui-layer-rim', //加上边框
        area: ['80%', '80%'], //宽高
        shade: 0.6,
        title: '小科室列表',
        offset: 'auto',
        id: 'LAY_layuipro',
        btnAlign: 'r',
        btn: ['╳'],
        moveType: 1,//拖拽模式，0或者1
        content: `<div><table id="small" lay-filter="small"></table></div>`,
        success: function (layero) {
          loadSmallTable()
          layero.find('.layui-layer-title').css({ 'padding': 0, 'text-align': 'center', 'height': '60px', 'line-height': '60px', 'font-size': '20px', 'color': 'white', 'background-color': '#31b77a' })
          layero.find('.layui-layer-setwin').css({ 'display': 'none' })
          layero.find('.layui-layer-btn0').css({
            position: 'absolute',
            right: '50px',
            top: '15px',
            height: '30px',
            width: '20px',
            'z-index': 999,
            border: 0,
            'background-color': 'rgba(0, 0, 0, 0)',
            color: '#fff',
            'font-size': '30px'
          })
        }
      });
    }
    const loadSmallTable = () => {
      table.render({
        elem: '#small'
        , height: 450
        , url: `${ip}/api/hospitalDic/getSmallDeptName` //数据接口
        , toolbar: '#toolbarDemo'
        , defaultToolbar: []
        , where: { keyword }
        , page: true //开启分页
        , limit: 10
        , request: {
          pageName: 'page',
          limitName: 'size'
        },
        // where: {
        //   name: data.large_dept_name
        // },
        parseData(res) {
          let { data } = res
          let list = data.list
          list.map((item, index) => item.num = index + 1)
          return {
            code: 0,
            count: data.total,
            data: list
          }
        }
        // ,skin: 'nob' //行边框风格
        , even: true //开启隔行背景
        , cols: [[ //表头
          { title: '选择', type: 'radio' },
          { field: 'num', title: "序号", width: 80, 'align': 'center' }
          , { field: 'id', title: "小科室编码", }
          , { field: 'name', title: "小科室" }
        ]]
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
        }
      });
    }

    // 大
    $('.big_open').click(() => {
      openBig()
    })
    const openBig = () => {
      layer.open({
        type: 1,
        // skin: 'layui-layer-rim', //加上边框
        area: ['80%', '80%'], //宽高
        shade: 0.6,
        title: '大科室列表',
        offset: 'auto',
        id: 'LAY_layuipro',
        btnAlign: 'r',
        btn: ['╳'],
        moveType: 1,//拖拽模式，0或者1
        content: `<div><table id="bigTable" lay-filter="bigs"></table></div>`,
        success: function (layero) {
          loadBigTable()
          layero.find('.layui-layer-title').css({ 'padding': 0, 'text-align': 'center', 'height': '60px', 'line-height': '60px', 'font-size': '20px', 'color': 'white', 'background-color': '#31b77a' })
          layero.find('.layui-layer-setwin').css({ 'display': 'none' })
          layero.find('.layui-layer-btn0').css({
            position: 'absolute',
            right: '50px',
            top: '15px',
            height: '30px',
            width: '20px',
            'z-index': 999,
            border: 0,
            'background-color': 'rgba(0, 0, 0, 0)',
            color: '#fff',
            'font-size': '30px'
          })
        }
      });
    }
    const loadBigTable = () => {
      table.render({
        elem: '#bigTable'
        , height: 450
        , url: `${ip}/api/hospitalDic/getLargeDeptName` //数据接口
        , toolbar: '#toolbarDemo2'
        , defaultToolbar: []
        , where: { keyword: keyword2 }
        , page: true //开启分页
        , limit: 10
        , request: {
          pageName: 'page',
          limitName: 'size'
        },
        parseData(res) {

          let list = res.data.list
          list.map((item, index) => item.num = index + 1)
          return {
            code: 0,
            count: res.data.total,
            data: list
          }
        }
        , even: true //开启隔行背景
        , cols: [[ //表头
          { title: '选择', type: 'radio' },
          { field: 'num', title: "序号", width: 80, 'align': 'center' }
          , { field: 'id', title: "大科室编码", }
          , { field: 'name', title: "大科室" }
        ]]
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
        }
      });
    }

    // 小
    table.on('toolbar(small)', function (obj) {
      var checkStatus = table.checkStatus(obj.config.id); //获取选中行状态
      let data = checkStatus.data;
      switch (obj.event) {
        case 'getCheckData':  //获取选中行数据
          small_dept_name = data[0].name
          small_dept_code = data[0].id
          $('.small_open').val(small_dept_name)
          layer.close(layer.index)
          break;
        case 'search':
          keyword = $('.searchContent').val()
          loadSmallTable()
          break;
      };
    });
    // 大
    table.on('toolbar(bigs)', function (obj) {
      var checkStatus = table.checkStatus(obj.config.id); //获取选中行状态
      let data = checkStatus.data;
      switch (obj.event) {
        case 'getCheckData':  //获取选中行数据
          large_dept_name = data[0].name
          large_dept_code = data[0].id
          $('.big_open').val(large_dept_name)
          loadTable1()
          layer.close(layer.index)
          break;
        case 'search':
          keyword2 = $('.searchContent2').val()
          loadBigTable()
          break;
      };
    });
    table.on('tool(test4)', function (obj) {
      let { data } = obj
      if (obj.event === 'record') {
        layer.open({
          type: 1,
          // skin: 'layui-layer-rim', //加上边框
          area: ['80%', '80%'], //宽高
          shade: 0.6,
          title: '操作记录',
          offset: 'auto',
          id: 'LAY_layuipro',
          btnAlign: 'r',
          btn: ['╳'],
          moveType: 1,//拖拽模式，0或者1
          content: `<div><table id="test6" lay-filter="test6"></table></div>`,
          success: function (layero) {
            table.render({
              elem: '#test6'
              , height: 300
              , url: `${ip}/api/hospitalDic/getHospitalDicRecord` //数据接口
              , page: true //开启分页
              , limit: 10
              , request: {
                pageName: 'pageNum',
                limitName: 'pageSize'
              },
              where: {
                name: data.large_dept_name
              },
              parseData(res) {
                console.log(res)
                const { data } = res
                let list = data.list
                list.map((item, index) => item.num = index + 1)
                return {
                  code: 0,
                  count: data.total,
                  data: list
                }
              }
              // ,skin: 'nob' //行边框风格
              , even: true //开启隔行背景
              , cols: [[ //表头
                { field: 'num', title: "序号", width: 80, 'align': 'center' }
                , { field: 'operation_time', title: "操作时间", }
                , { field: 'operator', title: "操作人" }
                , { field: 'large_dept_name', title: "大科室", }
                , { field: 'large_dept_code', title: "大科室编码", }
                , { field: 'small_dept_name', title: "小科室" }
                , { field: 'small_dept_code', title: "小科室编码" }
              ]]
              , done: function (e) {
                $('#layui-table-page1').css({ 'margin-bottom': '20px' })
                $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
              }
            });
            layero.find('.layui-layer-title').css({ 'padding': 0, 'text-align': 'center', 'height': '60px', 'line-height': '60px', 'font-size': '20px', 'color': 'white', 'background-color': '#31b77a' })
            layero.find('.layui-layer-setwin').css({ 'display': 'none' })
            layero.find('.layui-layer-btn0').css({
              position: 'absolute',
              right: '50px',
              top: '15px',
              height: '30px',
              width: '20px',
              'z-index': 999,
              border: 0,
              'background-color': 'rgba(0, 0, 0, 0)',
              color: '#fff',
              'font-size': '30px'
            })
          }
        });
      } else if (obj.event === 'delete') {
        let del_data = {
          id: data.id,
          large_dept_code: data.large_dept_code,
          large_dept_name: data.large_dept_name,
          operator: data.operator,
          small_dept_code: data.small_dept_code,
          small_dept_name: data.small_dept_name
        }
        layer.confirm('确定删除吗', function (index) {
          delDep(del_data, index, obj)
        });
      }
    })
    $('.layui-inline').eq(0).click(function (e) {
      $('.layui-inline').eq(0).find('span').css({ 'background-color': '#f5f6fa', 'color': '#333' })
      $(e.target).css({ 'background-color': '#e1eeec', 'color': '#32b67a' })
      if (e.target.innerText == '对码管理') {
        $('.layui_thisLine').removeClass('show_layui_thisLine').addClass('hidden_layui_thisLine')
        // $('.layui_thisLine').toggleClass('hidden_layui_thisLine')
        $('.layui_thisLine1').removeClass('hidden_layui_thisLine1').addClass('show_layui_thisLine1')
        // $('.layui_thisLine1').toggleClass('show_layui_thisLine1')
        $('.layui_Table').removeClass('show_layui_Table').addClass('hidden_layui_Table')
        // $('.layui_Table').toggleClass('hidden_layui_Table')
        $('.layui_Table1').removeClass('hidden_layui_Table1').addClass('show_layui_Table1')
        // $('.layui_Table1').toggleClass('show_layui_Table1')
        // loadTable1()
        // large_dept_name = null
        // large_dept_code = null
        // small_dept_name = null
        // small_dept_code = null
      } else {
        $('.layui_thisLine').removeClass('hidden_layui_thisLine').addClass('show_layui_thisLine')
        // $('.layui_thisLine').toggleClass('show_layui_thisLine') 
        $('.layui_thisLine1').removeClass('show_layui_thisLine1').addClass('hidden_layui_thisLine1')
        // $('.layui_thisLine1').toggleClass('hidden_layui_thisLine1')
        $('.layui_Table').removeClass('hidden_layui_Table').addClass('show_layui_Table')
        // $('.layui_Table').toggleClass('show_layui_Table')
        $('.layui_Table1').removeClass('show_layui_Table1').addClass('hidden_layui_Table1')
        // $('.layui_Table1').toggleClass('hidden_layui_Table1')
        large_dept_name = null
        large_dept_code = null
        small_dept_name = null
        small_dept_code = null
        $('.big_open').val('')
        $('.xks_name').val('')
        $('.xks_code').text('')
        loadTable()
      }
    })
    function loadTable1() {
      table.render({
        elem: '#test5'
        , height: 400
        , url: '../../layuiadmin/json/console/hospitalOfficeCode1.json' //数据接口
        , page: false //开启分页
        , limit: 12
        , skin: 'nob' //行边框风格
        , even: true //开启隔行背景
        , cols: [[ //表头
          { title: "小科室", width: 200, 'align': 'center', templet: (params) => '<input type="text" value="" style="border:none;width:100%;height:100%" class="xks_name">' }
          , { title: "小科室编码", width: 200, templet: (params) => '<div><span class="xks_code"></span></div>' }
          , {
            title: "操作", width: 200, toolbar: `<div><a class="" lay-event="hos_add" style="cursor:pointer;margin-right:30px;color:#32b67a">新增</a>
            </div>`, 'align': 'center'
          }
        ]]
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })

          tableSelect.render({
            elem: '.xks_name',	//定义输入框input对象 必填
            checkedKey: 'id', //表格的唯一建值，非常重要，影响到选中状态 必填
            searchKey: 'keyword',	//搜索输入框的name值 默认keyword
            searchPlaceholder: '关键词搜索',	//搜索输入框的提示文字 默认关键词搜索
            table: {	//定义表格参数，与LAYUI的TABLE模块一致，只是无需再定义表格elem
              url: `${ip}/api/hospitalDic/getSmallDeptName`,
              page: true,
              limit: 10,
              request: {
                pageName: 'page', //页码的参数名称，默认：page
                limitName: 'size' //每页数据量的参数名，默认：limit
              },
              where: {
                code: large_dept_code
              },
              cols: [[
                { title: '选择', type: 'radio' },
                { field: 'name', title: '名称' },
                { field: 'code', title: '编码' }
              ]],
              parseData(res) {
                const { data } = res
                return {
                  code: 0,
                  data: data.list,
                  count: data.total
                }
              }
            },
            done: function (elem, data) {
              console.log(elem, data)
              small_dept_name = data.data[0].name
              small_dept_code = data.data[0].id
              $('.xks_name').val(data.data[0].name)
              $('.xks_code').text(data.data[0].id)
            }
          })
        }
      });
    }
    table.on('tool(test5)', function (obj) {
      let operator = layui.data('user').data.userName
      if (obj.event === 'hos_add') {
        let add_data = {
          large_dept_code, large_dept_name,
          small_dept_code, small_dept_name,
          operator: operator
        }
        saveDepart(add_data)

      }
    })
    // 新增http://192.168.211.42:8090/api/hospitalDic/saveDepartmentDic
    const saveDepart = (data) => {
      $.ajax(`${ip}/api/hospitalDic/saveDepartmentDic`, {
        type: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        accepts: "application/json;charset=UTF-8",
        success(res) {
          layer.msg('新增成功')
        }
      })
    }
    loadTable()
    // 删除
    const delDep = (data, index, obj) => {
      $.ajax(`${ip}/api/hospitalDic/deleteDepartmentDic`, {
        type: 'POST',
        contentType: "application/json;charset=UTF-8",
        accepts: "application/json;charset=UTF-8",
        data: JSON.stringify(data),
        success(res) {
          obj.del();
          layer.close(index);
        }
      })
    }
    //  查询
    // $.ajax('http://192.168.211.42:8090/api/hospitalDic/getHospitalDic',{
    //   data:{

    //   }
    // })
    $('#my_search').click(() => {
      loadTable()
    })
    $('.ooo').click(() => {
      console.log(large_dept_code, large_dept_name)
    })
  });

  exports('hospitalOfficeCode', {})
});