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


  layui.use(['admin', 'echarts', 'laydate', 'form', 'table', 'tableSelect', 'jquery', 'layer'], function () {
    var $ = layui.$
      , admin = layui.admin
      , form = layui.form
      , echarts = layui.echarts
      , laydate = layui.laydate
      , table = layui.table
      , $ = layui.jquery
      , layer = layui.layer
      let update_data = null;
    tableSelect = layui.tableSelect;
    let start = null;//第三方对码列表数据开始时间
    let end = null;//第三发对吗列表数据结束时间
    laydate.render({
      elem: '#test1',
      type:'datetime',
      done(value) {
        start = value
      }
    });
    laydate.render({
      elem: '#test1-1',
      type:'datetime',
      done(value) {
        end = value
      }
    });

    const loadTable = () => { //加载第三方对码列表数据
      table.render({
        elem: '#test'
        , height: 450
        , url: `${ip}/api/thirdParty/getThirdPartyDic` //数据接口
        , page: true //开启分页
        , limit: 10
        , request: {
          pageName: 'pageNum',
          limitName: 'pageSize'
        }
        , where: { start, end }
        // ,skin: 'nob' //行边框风格
        , even: true //开启隔行背景
        , cols: [[ //表头
          { field: 'num', title: "序号", width: 80, 'align': 'center' }
          , { field: 'iih_name', title: "iih名称", }
          , { field: 'iih_code', title: "iih编码", width: 130, }
          , { field: 'yy_name', title: "用友名称", }
          , { field: 'yy_code', title: "用友编码", }
          , { field: 'operation_time', title: "最后一次对码时间", width: 150 }
          , { field: 'operator', title: "最后一次对码人", width: 80 }
          , { field: 'action', title: "操作", toolbar: '#barDemo', }
        ]]
        , parseData(res) {
          let { data } = res
          let list = data.list
          list.map((item, index) => {
            item.num = index + 1
          })
          return {
            code: 0,
            data: list,
            count: data.total
          }
        }
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
        }
      })
    };

    // barDemo
    table.on('tool(test)', function (obj) {
      var data = obj.data;
      if (obj.event === 'del') {//删除第三方对码数据信息
        layer.confirm('确定删除吗', function (index) {
          const { yy_name,yy_code,id,iih_name,iih_code,operator  } = data
          del_data = {yy_name,yy_code,id,iih_name,iih_code,operator}
          delThirdParty(del_data,index,obj)
        });
      } else if (obj.event === 'edit') {//查看操作记录
        let { iih_name } = data
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
              , url: `${ip}/api/thirdParty/getThirdPartyDicRecord` //数据接口
              , page: true //开启分页
              , limit: 10
              , where: { name: iih_name }
              , request: {
                pageName: 'pageNum',
                limitName: 'pageSize'
              },
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
                { field: 'num', title: "序号", width: 80, 'align': 'center' }
                , { field: 'iih_name', title: "iih名称", }
                , { field: 'iih_code', title: "iih编码", }
                , { field: 'yy_name', title: "用友名称", }
                , { field: 'yy_code', title: "用友编码", }
                , { field: 'operation_time', title: "操作时间" }
                , { field: 'operator', title: "操作人" }
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
      } else if (obj.event === 'update') {//更新对码
        update_data = data
        console.log(update_data)
        layer.open({
          type: 1,
          // skin: 'layui-layer-rim', //加上边框
          area: ['80%', '80%'], //宽高
          shade: 0.6,
          title: '更新',
          offset: 'auto',
          id: 'LAY_layuipro',
          btnAlign: 'r',
          btn: ['╳'],
          moveType: 1,//拖拽模式，0或者1
          content: `<div><table id="test7" lay-filter="test7"></table></div>`,
          success: function (layero) {
            table.render({
              elem: '#test7'
              , height: 400
              , url: '../../layuiadmin/json/console/thirdPartyOfficeCode.json' //数据接口
              , page: true //开启分页
              , limit: 10
              // ,skin: 'nob' //行边框风格
              , even: true //开启隔行背景
              , cols: [[ //表头
                { field: 'num', title: "序号", width: 50, 'align': 'center' }
                , {
                  field: 'iihkeshiname', title: "iih科室名称", templet: function (params) {
                    return `<input type="text" value="${data.iih_name}" style="border:none;width:100%;height:100%" class="up_iihname">`
                  }
                }
                , { title: "iih科室编码", templet: `<div><span class="up_iihcode">${data.iih_code}</span></div>` }
                , {
                  title: "用友名称", templet: function (params) {
                    return '<input type="text" value="" style="border:none;width:100%;height:100%" class="update_name">'
                  }
                }
                , { title: "用友编码", templet: '<div><span class="update_code"></span></div>' }
                , {
                  title: "操作", width: 200, toolbar: `<div><a class="a_update" lay-event="a_update" style="cursor:pointer;margin-right:30px;color:#32b67a">保存</a>
                  </div>`, 'align': 'center'
                }
              ]]
              , done: function (e) {
                $('#layui-table-page1').css({ 'margin-bottom': '20px' })
                $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
                tableSelect.render({
                  elem: '.update_name',	//定义输入框input对象 必填
                  checkedKey: 'id', //表格的唯一建值，非常重要，影响到选中状态 必填
                  searchKey: 'keyword',	//搜索输入框的name值 默认keyword
                  searchPlaceholder: '关键词搜索',	//搜索输入框的提示文字 默认关键词搜索
                  table: {	//定义表格参数，与LAYUI的TABLE模块一致，只是无需再定义表格elem
                    url: `${ip}/api/thirdParty/getYyDic`,
                    page: true,
                    limit: 10,
                    request: {
                      pageName: 'pageNum', //页码的参数名称，默认：page
                      limitName: 'pageSize' //每页数据量的参数名，默认：limit
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
                    $(elem[0]).val(data.data[0].name)
                    $('.update_code').text(data.data[0].code)
                    update_data.yy_name = data.data[0].name
                    update_data.yy_code = data.data[0].code
                    // console.log(update_data)
                    //选择完后的回调，包含2个返回值 elem:返回之前input对象；data:表格返回的选中的数据 []
                    //拿到data[]后 就按照业务需求做想做的事情啦~比如加个隐藏域放ID...
                    
                  }
                })
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
      }
    });


    $('#third_search').click(() => {//查询
      loadTable()
    })

    $('.layui-inline').eq(0).click(function (e) {
      $('.layui-inline').eq(0).find('span').css({ 'background-color': '#f5f6fa', 'color': '#333' })
      $(e.target).css({ 'background-color': '#e1eeec', 'color': '#32b67a' })
      if (e.target.innerText == '添加') {
        $('.layui_thisLine').removeClass('show_layui_thisLine').addClass('hidden_layui_thisLine')
        // $('.layui_thisLine').toggleClass('hidden_layui_thisLine')
        $('.layui_thisLine1').removeClass('hidden_layui_thisLine1').addClass('show_layui_thisLine1')
        // $('.layui_thisLine1').toggleClass('show_layui_thisLine1')
        $('.layui_Table').removeClass('show_layui_Table').addClass('hidden_layui_Table')
        // $('.layui_Table').toggleClass('hidden_layui_Table')
        $('.layui_Table1').removeClass('hidden_layui_Table1').addClass('show_layui_Table1')
        // $('.layui_Table1').toggleClass('show_layui_Table1')
        loadTable1()
      } else {
        $('.layui_thisLine').removeClass('hidden_layui_thisLine').addClass('show_layui_thisLine')
        // $('.layui_thisLine').toggleClass('show_layui_thisLine') 
        $('.layui_thisLine1').removeClass('show_layui_thisLine1').addClass('hidden_layui_thisLine1')
        // $('.layui_thisLine1').toggleClass('hidden_layui_thisLine1')
        $('.layui_Table').removeClass('hidden_layui_Table').addClass('show_layui_Table')
        // $('.layui_Table').toggleClass('show_layui_Table')
        $('.layui_Table1').removeClass('show_layui_Table1').addClass('hidden_layui_Table1')
        // $('.layui_Table1').toggleClass('hidden_layui_Table1')
        loadTable()
      }
    })
    function loadTable1() {
      table.render({
        elem: '#test2'
        , height: 400
        , url: '../../layuiadmin/json/console/thirdPartyOfficeCode.json' //数据接口
        , page: true //开启分页
        , limit: 10
        // ,skin: 'nob' //行边框风格
        , even: true //开启隔行背景
        , cols: [[ //表头
          { field: 'num', title: "序号", width: 50, 'align': 'center' }
          , {
            field: 'iihkeshiname', title: "iih科室名称", templet: function (params) {
              return '<input type="text" value="" style="border:none;width:100%;height:100%" class="iih_name">'
            }
          }
          , { title: "iih科室编码", templet: '<div><span class="iih_code"></span></div>' }
          , {
            title: "用友名称", templet: function (params) {
              return '<input type="text" value="" style="border:none;width:100%;height:100%" class="yy_name">'
            }
          }
          , { title: "用友编码", templet: '<div><span class="yy_code"></span></div>' }
          , {
            title: "操作", width: 200, toolbar: `<div><a class="save" lay-event="save_update" style="cursor:pointer;margin-right:30px;color:#32b67a">保存</a>
            </div>`, 'align': 'center'
          }
        ]]
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
          tableSelect.render({
            elem: '.iih_name',	//定义输入框input对象 必填
            checkedKey: 'id', //表格的唯一建值，非常重要，影响到选中状态 必填
            searchKey: 'keyword',	//搜索输入框的name值 默认keyword
            searchPlaceholder: '关键词搜索',	//搜索输入框的提示文字 默认关键词搜索
            table: {	//定义表格参数，与LAYUI的TABLE模块一致，只是无需再定义表格elem
              url: `${ip}/api/thirdParty/getIihDic`,
              page: true,
              limit: 10,
              request: {
                pageName: 'pageNum', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
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
              $(elem[0]).val(data.data[0].name)
              $('.iih_code').text(data.data[0].code)
              //选择完后的回调，包含2个返回值 elem:返回之前input对象；data:表格返回的选中的数据 []
              //拿到data[]后 就按照业务需求做想做的事情啦~比如加个隐藏域放ID...
            }
          })
          tableSelect.render({
            elem: '.yy_name',	//定义输入框input对象 必填
            checkedKey: 'id', //表格的唯一建值，非常重要，影响到选中状态 必填
            searchKey: 'keyword',	//搜索输入框的name值 默认keyword
            searchPlaceholder: '关键词搜索',	//搜索输入框的提示文字 默认关键词搜索
            table: {	//定义表格参数，与LAYUI的TABLE模块一致，只是无需再定义表格elem
              url: `${ip}/api/thirdParty/getYyDic`,
              page: true,
              limit: 10,
              request: {
                pageName: 'pageNum', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
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
              $(elem[0]).val(data.data[0].name)
              $('.yy_code').text(data.data[0].code)
              //选择完后的回调，包含2个返回值 elem:返回之前input对象；data:表格返回的选中的数据 []
              //拿到data[]后 就按照业务需求做想做的事情啦~比如加个隐藏域放ID...
            }
          })
        }
      });
    }
    loadTable()
    // 保存/更新第三方对码数据信息
    const savePartyOfficeCode = (data) => {
      $.ajax({
        type: "POST",
        url: `${ip}/api/thirdParty/saveOrUpdateThirdPartyDic`,
        contentType: "application/json;charset=UTF-8",
        accepts: "application/json;charset=UTF-8",
        data: JSON.stringify(data),
        success(res) {
          layer.msg('更新/添加成功')
          initPartyOfficeCode()
        }
      })
    }
    // 删除第三方对码
    const delThirdParty = (data,index,obj) => {
      $.ajax({
        type: 'POST',
        url: `${ip}/api/thirdParty/deleteThirdPartyDic`,
        contentType: "application/json;charset=UTF-8",
        accepts: "application/json;charset=UTF-8",
        data: JSON.stringify(data),
        success(res) {
          obj.del();
          layer.close(index);
        }
      })
    }
    // 新增、保存成功后清空
    console.log(layui.data('user'))
    const initPartyOfficeCode = () => {
      $('.iih_name').val('')
      $('.iih_code').text('')
      $('.yy_name').val('')
      $('.yy_code').text('')
    }
    table.on('tool(test2)', (obj) => {
      const layEvent = obj.event
      // let id = `test123`
      const iih_name = $('.iih_name').val()
      const iih_code = $('.iih_code').text()
      const yy_name = $('.yy_name').val()
      const yy_code = $('.yy_code').text()
      let operator = layui.data('user').data.userName
      // let saveUpdate_data = { ...data, id, operator:'test' }
      // console.log(saveUpdate_data)
      const saveUpdate_data = { iih_name, iih_code, yy_name, yy_code,  operator: operator }
      // const del_data = { iih_name, iih_code, yy_name, yy_code,  operator: 'test' }
      if (layEvent === 'save_update') {
        savePartyOfficeCode(saveUpdate_data)
      }
      // if (layEvent === 'del') {
      //   delThirdParty(del_data)
      // }
    })
    table.on('tool(test7)',(obj) => {
      const layEvent = obj.event
      let operator = layui.data('user').data.userName
      if(layEvent === 'a_update'){
        let data = {
          iih_name:update_data.iih_name,
          iih_code:update_data.iih_code,
          yy_name:update_data.yy_name,
          yy_code:update_data.yy_code,
          id:update_data.id,
          operator:operator
        }
        console.log(data)
        savePartyOfficeCode(data)
      }
    })
  });


  exports('thirdPartyOfficeCode', {})
});