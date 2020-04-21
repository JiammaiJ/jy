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


  layui.use(['admin', 'echarts', 'laydate', 'form', 'table', 'layer'], function () {
    var $ = layui.$
      , admin = layui.admin
      , form = layui.form
      , echarts = layui.echarts
      , laydate = layui.laydate
      , table = layui.table
      , layer = layui.layer
    let name = null;
    let dep = null;
    let account = null;
    laydate.render({
      elem: '#test1'
    });
    laydate.render({
      elem: '#test1-1'
    });
    const loadTable = () => {
      name = $('.search_name').val()
      dep = $('.search_dept').val()
      table.render({
        elem: '#demo'
        , height: 'full-200'
        , url: `${ip}/api/user/system-user` //数据接口
        ,page: true //开启分页
        ,limit:10
        ,skin: 'nob' //行边框风格
        , where: {
          name, dep
        }, request: {
          pageName: 'page',
          limitName: 'size'
        }
        , parseData(res) {
          console.log(res)
          let { data } = res
          let list = data.list
          data.list.map((item, index) => item.num = index + 1)
          return {
            code: 0,
            data:list,
            count:data.total
          }
        }
        , even: true //开启隔行背景
        , cols: [[ //表头
          { field: 'num', title: "序号", width: 80, 'align': 'center' }
          , { field: 'name', title: "姓名", }
          , { field: 'code', title: "人员编码", width: 250, }
          , { field: 'depName', title: "科室名称", }
          , { field: 'sex', title: "性别", }
          , { field: 'action', title: "操作", width: 200, toolbar: '#barDemo' }
        ]]
        , done: function (e) {
          $('#layui-table-page1').css({ 'margin-bottom': '20px' })
          $('thead').find('span').css({ 'color': 'black', 'font-weight': 'bold' })
        }
      });
    }
    // 搜索人员
    loadTable()
    $('.search').click(() => {
      loadTable()
    })
    table.on('tool(test)', function (obj) {
      var data = obj.data;

      if (obj.event === 'edit') {
        layer.open({
          type: 1,
          // skin: 'layui-layer-rim', //加上边框
          area: ['50%', '60%'], //宽高
          shade: 0.6,
          title: '编辑',
          offset: 'auto',
          id: 'LAY_layuipro',
          btnAlign: 'r',
          btn: ['╳'],
          moveType: 1,//拖拽模式，0或者1
          content: $('#testForm'),
          success: function (layero) {

            $('.edit_userName').val(data.name)
            $('.edit_usercode').val(data.code)
            $('.edit_depName').val(data.depName)
            if (data.sex === '2') {
              $('.edit_sex').val('女')
            } else if (data.sex === '1') {
              $('.edit_sex').val('男')
            }
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
            // $('#checkedAll').prop('checked',true)
            layero.find('input').css({ 'border': 'none', 'color': '#333' })
            layero.find('#testTable').find('input').eq(0).val(data.name)
            layero.find('#testTable').find('input').eq(1).val(data.renyuannum)
            layero.find('#testTable').find('input').eq(2).val(data.keshiname)
            layero.find('#testTable').find('input').eq(3).val(data.sex)
            // $('.click_checked').click(function (e) {
            //   if (e.target.nodeName == 'SPAN' || e.target.nodeName == 'I') {
            //     if ($(e.target).parents('.layui-form-checkbox').find('span').text() == '全部') {
            //       if ($(e.target).parents('.layui-input-block').find('input:checkbox[name="boxAll"]:checked').length == 1) {
            //         $('.click_checked').find('input:checkbox[name="box"]').each(function (current, index) {
            //           $(this).prop('checked', true)
            //           // form.render();
            //         })
            //       } else {
            //         $('.click_checked').find('input:checkbox[name="box"]').each(function (current, index) {
            //           $(this).prop('checked', false)
            //           // form.render();
            //         })
            //       }
            //     } else {
            //       if ($(e.target).parents('.layui-input-block').find('input:checkbox[name="box"]:checked').length == 2) {
            //         $('#checkedAll').prop('checked', true)
            //         // form.render();
            //       } else {
            //         $('#checkedAll').prop('checked', false)
            //         // form.render();
            //       }
            //     }
            //     form.render();
            //   }
            // })
          }
        });
      } else if (obj.event == 'reset') {
        
        account = data.code
        layer.open({
          type: 1,
          // skin: 'layui-layer-rim', //加上边框
          area: ['50%', '60%'], //宽高
          shade: 0.6,
          title: '重置密码',
          offset: 'auto',
          id: 'LAY_layuipro',
          btnAlign: 'r',
          btn: ['╳'],
          moveType: 1,//拖拽模式，0或者1
          content: $('#example'),
          success: function (layero) {
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
            layero.find('.layui-input').css({ 'width': '60%', 'height': '45px', 'border': '1px solid #c9c9c9', 'border-radius': '4px' })
            layero.find('.layui-input-block').css({ 'margin-left': '0', 'display': 'flex', 'justify-content': 'center', 'margin-top': '3%' })
            layero.find('.layui-inline button').css({
              'background-color': '#32b67a',
              'width': '100px',
              'border-radius': '5px',
              'padding': '0',
              'font-size': '16px',
              'margin-left': '40px',
            })
          }
        });
      }
    });
    const userSubmit = () => {
      // input:checkbox[name='the checkbox name']:checked"
      let checkboxs = $('.user_checkbox').find('input:checkbox:checked')
      let arr = [];
      let userCode = $('.edit_usercode').val()
      let userRole = $('.user_radio').find('input:radio:checked').val()
      $.each(checkboxs, (index, item) => {
        arr.push($(item).val())
      })
      let data = {
        permissions: arr,
        userCode,
        userRole
      }
      console.log(arr,userRole,userCode)
      // data: {ids:""+arr,_method:'delete'}
      $.ajax({
        type: 'PUT',
        url: `${ip}/api/user/permission`,
        contentType: "application/json;charset=UTF-8",
        accepts: "application/json;charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (res) {
          if(res.code === 200) {
            layer.msg('修改成功')
          }
        },

      });
    }
    // 修改
    $('.user_save').click(() => {
      userSubmit()
    })
    // 改密码
    const userReset = () => {
      let oldPass = $('.oldPass').val()
      let newPass1 = $('.newPass1').val()
      let newPass2 = $('.newPass2').val()
      console.log(oldPass, newPass1, newPass2, account)
      if (newPass1 !== newPass2) {
        layer.msg('两次输入密码不同')
      } else if (newPass1 === newPass2) {
        let data = {
          account,
          oldPass,
          newPass: newPass1
        }
        $.ajax({
          type: 'PUT',
          url: `${ip}/api/user/reset-password`,
          contentType: "application/json;charset=UTF-8",
          accepts: "application/json;charset=UTF-8",
          dataType: "json",
          data: JSON.stringify(data),
          success: function (res) {
           if(res.code === 200) {
             layer.msg('修改成功')
           }else {
             layer.msg(res.message)
           }
          }
        });
      }
    }
    $('.resetPassword').click(() => {
      userReset()
    })
    // 同步
    $('.user_tb').click(() => {
      $.ajax(`${ip}/api/user/user-sync`,{
        success(res) {
          if(res.code === 200) {
            layer.msg('同步成功')
          }
        }
      })
    })
  });


  exports('personList', {})
});