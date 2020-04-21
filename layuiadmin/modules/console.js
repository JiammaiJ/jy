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


  layui.use(['admin', 'echarts', 'laydate', 'form', 'table', 'jquery'], function () {
    var $ = layui.$
      , admin = layui.admin
      , form = layui.form
      , echarts = layui.echarts
      , laydate = layui.laydate
      , table = layui.table
      , $ = layui.jquery
      , startTime = defaultTime()
      , endTime = defaultTime()
      , themeName = null
      , startTime2 = null
      , endTime2 = null
    let pid = null;
    laydate.render({
      elem: '#test1',
      type: 'month',
      done(value) {
        startTime = value
      }
    });
    laydate.render({
      elem: '#test1-1',
      type: 'month',
      done(value) {
        endTime = value
      }
    });
    laydate.render({
      elem: '#test2',
      
      done(value) {
        console.log(value)
        startTime2 = value
      }
    });
    laydate.render({
      elem: '#test2-1',
      done(value) {
        endTime2 = value
      }
    });
    // $('.layui-card-body').click(function (e) {
    //   console.log(1)
    //   $('.layui-fluid').removeClass('show_layui-fluid').addClass('hidden_layui-fluid')
    //   $('.layui-fluid1').removeClass('hidden_layui-fluid1').addClass('show_layui-fluid1')
    //   table.render({
    //     elem: '#demo'
    //     , height: 450
    //     , url: '../../layuiadmin/json/console/console.json' //数据接口
    //     , page: true //开启分页
    //     , limit: 12
    //     // ,skin: 'nob' //行边框风格
    //     , even: true //开启隔行背景
    //     , cols: [[ //表头
    //       { field: 'num', title: "序号", width: 80, 'align': 'center' }
    //       , { field: 'jiekouname', title: "接口名称", }
    //       , { field: 'shujuliang', title: "数据量", width: 100, }
    //       , { field: 'shujutongbuTime', title: "数据同步时间", }
    //       , { field: 'shujuUpdateTime', title: "数据上传时间", }
    //       , {
    //         field: 'shujuStatus', title: "数据状态", width: 120
    //         , templet: function (params) {
    //           var htmlStr = ''
    //           htmlStr += '<div>'
    //           if (params.shujuStatus.slice(params.shujuStatus.length - 2, params.shujuStatus.length) == '成功') {
    //             htmlStr += '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#32b67a;margin-right:6px;"></span>'
    //           } else {
    //             htmlStr += '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#fb4e4e;margin-right:6px;"></span>'
    //           }
    //           htmlStr += `<span>${params.shujuStatus}</span>`
    //           htmlStr += '</div>'
    //           //  params.shujuStatus
    //           return htmlStr
    //         }
    //       }
    //       , {
    //         field: 'action', title: "操作", 'align': 'center', toolbar: `<div><a class="" lay-event="edit" style="cursor:pointer;margin-right:30px;color:#32b67a">数据预览</a>
    //       <a class="" lay-event="del" style="cursor:pointer;color:#32b67a">重新上传</a></div>` }
    //     ]]
    //     , done: function (e) {
    //       $('#layui-table-page1').css({ 'margin-bottom': '20px' })
    //       $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
    //     }
    //   });

    // })
    // 默认事件
    function defaultTime() {
      let time = new Date()
      let year = time.getFullYear();

      let month = time.getMonth();
      if (month === 0) {
        month = 1
      }
      if (month < 10) {
        month = "0" + month;
      }
      return `${year}-${month}`
    }

    $('.layui-fluid').on('click', '.layui-card-body', function (e) {
      pid = $(this).attr('id')
      console.log(pid)
      $('.layui-fluid').removeClass('show_layui-fluid').addClass('hidden_layui-fluid')
      $('.layui-fluid1').removeClass('hidden_layui-fluid1').addClass('show_layui-fluid1')
      loadTable()
      initStatus()
    })
    $('.back_layui-btn').click(function (e) {
      $('.layui-fluid1').removeClass('show_layui-fluid1').addClass('hidden_layui-fluid1')
      $('.layui-fluid').removeClass('hidden_layui-fluid').addClass('show_layui-fluid')
    })
    const loadTable = () => {
      table.render({
        elem: '#demo'
        , height: 450
        , url: `${ip}/api/homePage/getSpecificInfo` //数据接口
        , request: {
          pageName: 'pageNum' //页码的参数名称，默认：page
          , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        }
        , where: { pid,startTime:startTime2,endTime:endTime2 }
        , page: true //开启分页
        , limit: 10
        // ,skin: 'nob' //行边框风格
        , even: true //开启隔行背景
        , cols: [[ //表头
          { field: 'num', title: "序号", width: 80, 'align': 'center' }
          , { field: 'theme_name', title: "接口名称", }
          , { field: 'read_count', title: "数据量", width: 100, }
          , { field: 'sync_time', title: "数据同步时间", }
          , { field: 'upload_time', title: "数据上传时间", }
          , {
            field: 'data_status', title: "数据状态", width: 120
            , templet: function (params) {
              var htmlStr = ''
              htmlStr += '<div>'
              if (params.data_status.slice(params.data_status.length - 2, params.data_status.length) == '成功') {
                htmlStr += '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#32b67a;margin-right:6px;"></span>'
              } else {
                htmlStr += '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#fb4e4e;margin-right:6px;"></span>'
              }
              htmlStr += `<span>${params.data_status}</span>`
              htmlStr += '</div>'
              //  params.shujuStatus
              return htmlStr
            }
          }
          , {
            field: 'action', title: "操作", 'align': 'center', toolbar: '#barDemo'
          }
        ]],
        parseData(res) {
          console.log(res)
          let { data } = res
          let list = data.list
          list.map((item, index) => item.num = index + 1)
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
      });
    }

    //接口上传日志详情
    $('.spec_search').click(() => {
      loadTable()
    })
    form.on('select(menu_info)', function (data) {
      themeName = data.value
    });
    // 动态表头
    const dtTable = (data) => {
      $.ajax(`${ip}/api/homePage/getPreviewInfo`, {
        data: { tableName: data.table_name, dataVersion: '201911' },
        success(res) {
          console.log(res)
          let cols = [{ field: 'tablenum', title: "序号", width: 80, 'align': 'center' }]
          let list = res.data.list[0]
          let keys = Object.keys(list)
          for (let i = 0; i < keys.length; i++) {
            cols.push({ field: keys[i], title: [keys[i]] })
          }
          dtLoadTable(data, cols)
        }
      })
    }
    
    const dtLoadTable = (data, cols) => {
      table.render({
        elem: '#test6'
        , height: 300
        , url: `${ip}/api/homePage/getPreviewInfo` //数据接口
        , page: true //开启分页
        , limit: 10
        // dataVersion: data.data_version
        , where: { tableName: data.table_name, dataVersion: '201911' }
        , request: {
          pageName: 'pageNum',
          limitName: 'pageSize'
        },
        parseData(res) {
          console.log(res)
          let { data } = res
          let list = data.list
          list.map((item, index) => item.tablenum = index + 1)
          return {
            code: 0,
            count: data.total,
            data: list
          }
        }
        // ,skin: 'nob' //行边框风格
        , even: true //开启隔行背景
        // , cols: [[ //表头
        //   { field: 'num', title: "序号", width: 80, 'align': 'center' }
        //   , { field: 'iih_name', title: "iih名称", }
        //   , { field: 'iih_code', title: "iih编码", }
        //   , { field: 'yy_name', title: "用友名称", }
        //   , { field: 'yy_code', title: "用友编码", }
        //   , { field: 'operation_time', title: "操作时间" }
        //   , { field: 'operator', title: "操作人" }
        // ]]
        , cols: [cols]
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
        }
      });
    }
    table.on('tool(test)', (obj) => {
      const layEvent = obj.event
      let { data } = obj
      if (layEvent === 'preview') {
        layer.open({
          type: 1,
          // skin: 'layui-layer-rim', //加上边框
          area: ['80%', '80%'], //宽高
          shade: 0.6,
          title: '数据预览',
          offset: 'auto',
          id: 'LAY_layuipro',
          btnAlign: 'r',
          btn: ['╳'],
          moveType: 1,//拖拽模式，0或者1
          content: `<div><table id="test6" lay-filter="test6"></table></div>`,
          success: function (layero) {
            dtTable(data)
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

      } else if (layEvent === 'replay') {
        $.ajax(`${ip}/api/homePage/replayMessage`, {
          data: { tableName: data.table_name, dataVersion: data.data_version },
          success(res) {
            console.log(res)
          }
        })
      }

    })
    const initCard = (data) => {
      $('.layui-col-space15').remove();
      let result = []
      for (var i = 0; i < data.length; i += 3) {
        result.push(data.slice(i, i + 3));
      }
      $.each(result, (index, item) => {
        let col15 = $('<div class="layui-row layui-col-space15"></div>')//.appendTo($('.layui-fluid'))
        $.each(item, (index, item2) => {
          $(`<div class="layui-col-md4">
          <div class="layui-col-md12">
            <div class="layui-card">
              <div class="layui-card-body" style="height: 210px;cursor: pointer;" id="${item2.pid}">
                <div class=" layadmin-dataview" data-anim="fade" lay-filter="LAY-index-dataview"
                  style="height: 210px !important;">
                  <div carousel-item style="height: 210px;">
                    <div class="LAY-index-dataview" data-type="parentPopup" style="height: 210px;"><i
                        class="layui-icon layui-icon-loading1 layadmin-loading"></i>
                      <p style="display:flex">
                        <span>${item2.theme_name}</span>
                        <span>${item2.success_count + item2.fail_count}</span>
                      </p>
                      <p>
                        <span>
                          <b><i>${item2.success_count}</i><em>(条)</em></b>
                          <b>成功</b>
                        </span>
                        <span>
                          <b><i>${item2.fail_count}</i><em>(条)</em></b>
                          <b>失败</b>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`).appendTo($(col15))
        })
        col15.appendTo($('.layui-fluid'))
      })
    };
    const initSelect = (data) => {
      $.each(data, function (index, item) {
        $('#menu_info').append(new Option(item.name));// 下拉菜单里添加元素
      });
      layui.form.render("select");
    }
    const getMenuInfo = () => {
      $.ajax(`${ip}/api/homePage/getMenuInfo`, {
        success(res) {
          initSelect(res.data)
        }
      })
    }
    const getThemeList = () => {
      $.ajax(`${ip}/api/homePage/getThemeList`, {
        data: {
          pageNum: 1,
          pageSize: 10,
          startTime,
          endTime,
          themeName
        },
        success(res) {
          initCard(res.data.list)
        }
      })
    };
    getMenuInfo();
    getThemeList();
    $('.layui-btn').click(() => {
      getThemeList();
    })
    // 昨日上传状态

    const initStatus = () => {
      console.log(pid)
      $.ajax(`${ip}/api/homePage/getLastMonthInfo`, {
        data: { pid },
        success(res) {

          loadStatus(res)
        }
      })
    }
    const loadStatus = (res) => {
      $('.y_status').text(res.data.data_status)
      $('.y_count').text(res.data.success_count)
    }
  });
  console.log(ip)
  exports('console', {})
});