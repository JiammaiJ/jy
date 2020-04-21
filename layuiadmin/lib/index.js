/** layuiAdmin.std-v1.2.1 LPPL License By http://www.layui.com/admin/ */
//  ;layui.extend({setter:"config",admin:"lib/admin",view:"lib/view"}).define(["setter","admin"],function(a){var e=layui.setter,i=layui.element,n=layui.admin,t=n.tabsPage,d=layui.view,l=function(a,d){var l,b=r("#LAY_app_tabsheader>li"),y=a.replace(/(^http(s*):)|(\?[\s\S]*$)/g,"");if(b.each(function(e){var i=r(this),n=i.attr("lay-id");n===a&&(l=!0,t.index=e)}),d=d||"新标签页",e.pageTabs)l||(r(s).append(['<div class="layadmin-tabsbody-item layui-show">','<iframe src="'+a+'" frameborder="0" class="layadmin-iframe"></iframe>',"</div>"].join("")),t.index=b.length,i.tabAdd(o,{title:"<span>"+d+"</span>",id:a,attr:y}));else{var u=n.tabsBody(n.tabsPage.index).find(".layadmin-iframe");u[0].contentWindow.location.href=a}i.tabChange(o,a),n.tabsBodyChange(t.index,{url:a,text:d})},s="#LAY_app_body",o="layadmin-layout-tabs",r=layui.$;r(window);n.screen()<2&&n.sideFlexible(),layui.config({base:e.base+"modules/"}),layui.each(e.extend,function(a,i){var n={};n[i]="{/}"+e.base+"lib/extend/"+i,layui.extend(n)}),d().autoRender(),layui.use("common"),a("index",{openTabsPage:l})});
/**

 @Name：layuiAdmin iframe版主入口
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.extend({
  setter: 'config' //配置模块
  , admin: 'lib/admin' //核心模块
  , view: 'lib/view' //视图渲染模块
  , formSelects: 'formSelects-v4'
}).define(['setter', 'admin', 'form'], function (exports) {
  var formSelects = layui.formSelects;
  var setter = layui.setter
    , element = layui.element
    , admin = layui.admin
    , tabsPage = admin.tabsPage
    , view = layui.view
    , form = layui.form
    , List_Index = 0
    , List_Img_Array = ['../layuiadmin/style/jiankong_normal.png', '../layuiadmin/style/third_normal.png', '../layuiadmin/style/hospital_normal.png', '../layuiadmin/style/person_normal.png', '../layuiadmin/style/data_normal.png', '../layuiadmin/style/medical_normal.png']
    , tip_index = ''
    //设置一个全局变量，来检测快捷菜单里面选项名的变化
    , menuTemp = ''
    , $ = layui.$

    , temp = '标识'
    //打开标签页
    , APP_BODY = '#LAY_app_body', FILTER_TAB_TBAS = 'layadmin-layout-tabs'
    , $ = layui.$, $win = $(window);

  //监听浏览器事件
  window.onbeforeunload = function (e) {
    var e = window.event || e;
    //e.returnValue=("确定离开当前页面吗？");
  }

  //初始
  if (admin.screen() < 2) admin.sideFlexible();

  //将模块根路径设置为 controller 目录
  layui.config({
    base: setter.base + 'modules/'
  });
  layui.config({
    version: false //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    //   ,clock: '/modules/clock' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
  }).use([], function () {
    // var clock = layui.clock
    // clock.now()
  })

  //扩展 lib 目录下的其它模块
  layui.each(setter.extend, function (index, item) {
    var mods = {};
    mods[item] = '{/}' + setter.base + 'lib/extend/' + item;
    layui.extend(mods);
  });
  // 设置名字，登入事件
  const initUser = () => {
    // if(!layui.data('user').data){
    //   console.log(location.href)
    //   // location.href='../../views/user/login.html'
    //   if(location.href === 'http://10.0.0.198:2214/views/'){
    //     location.href= '../../views/user/login.html'
    //   }else {
    //     return false
    //   }
    // }
    if (layui.data('user').data) {
      $('.user_name').text(layui.data('user').data.userName)
      let permissions = layui.data('user').data.permissions
      let arr = ["treatment_group", "rbrvs_data", "user_list", "hospital_department", "monitor_management", "thirdpart_department"];
      if (permissions.includes('all')) {
        return false
      } else {
        let a = permissions.concat(arr).filter((item, index, arr) => arr.indexOf(item) === arr.lastIndexOf(item))
        $.each(a, (index, item) => {
          $(`#${item}`).css({ 'display': 'none' })
        })
      }
    }else {
      return false;
    }
    // $('.user_name').text(layui.data('user').data.userName)
    // let permissions = layui.data('user').data.permissions
    // let arr = ["treatment_group", "rbrvs_data", "user_list", "hospital_department", "monitor_management", "thirdpart_department"];
    // if (permissions.includes('all')) {
    //   return false
    // } else {
    //   let a = permissions.concat(arr).filter((item, index, arr) => arr.indexOf(item) === arr.lastIndexOf(item))
    //   $.each(a, (index, item) => {
    //     $(`#${item}`).css({ 'display': 'none' })
    //   })
    // }
  }
  initUser()
  $('.user_name_icon').click(function () {
    $(this).find('i').toggleClass('layui-icon-down')
    $(this).find('i').toggleClass('layui-icon-up')
    if ($(this).find('i').hasClass('layui-icon-up')) {
      $('.resert_or_out').toggleClass('resert_or_out_hidden')
      $('.resert_or_out').toggleClass('resert_or_out_show')
    }
    if ($(this).find('i').hasClass('layui-icon-down')) {
      $('.resert_or_out').toggleClass('resert_or_out_hidden')
      $('.resert_or_out').toggleClass('resert_or_out_show')
    }
  })
  $('#LAY-system-side-menu').find('li').click(function () {
    if ($(this).find('cite').text() == '监控管理') {
      $('.show_left_text').text('监控首页')
      $('.show_right_text').text('监控首页')
    } else {
      $('.show_left_text').text($(this).find('cite').text())
      $('.show_right_text').text($(this).find('cite').text())
    }
    $('#LAY-system-side-menu').find('li').eq(List_Index).css({ 'background': `url(${List_Img_Array[List_Index]}) no-repeat 10px center` })
    if ($(this).find('cite').text() == '监控管理') {
      $(this).css({ 'background': 'url(../layuiadmin/style/jiankong_checked.png) no-repeat 10px center' }).addClass('click_checked_this')
      $(this).parents('#LAY_app').find('iframe').attr({ 'src': 'home/console.html' })
      List_Index = 0
    } else if ($(this).find('cite').text() == '医疗组') {
      $(this).css({ 'background': 'url(../layuiadmin/style/medical_checked.png) no-repeat 10px center' }).addClass('click_checked_this')
      $(this).parents('#LAY_app').find('iframe').attr({ 'src': 'home/medicalTreatment.html' })
      List_Index = 5
    } else if ($(this).find('cite').text() == 'RBRVS数据表') {
      $(this).css({ 'background': 'url(../layuiadmin/style/data_checked.png) no-repeat 10px center' }).addClass('click_checked_this')
      $(this).parents('#LAY_app').find('iframe').attr({ 'src': 'home/RBRVSdataTable.html' })
      List_Index = 4
    } else if ($(this).find('cite').text() == '人员列表') {
      $(this).css({ 'background': 'url(../layuiadmin/style/person_checked.png) no-repeat 10px center' }).addClass('click_checked_this')
      $(this).parents('#LAY_app').find('iframe').attr({ 'src': 'home/personList.html' })
      List_Index = 3
    } else if ($(this).find('cite').text() == '医院科室对码') {
      $(this).css({ 'background': 'url(../layuiadmin/style/hospital_checked.png) no-repeat 10px center' }).addClass('click_checked_this')
      $(this).parents('#LAY_app').find('iframe').attr({ 'src': 'home/hospitalOfficeCode.html' })
      List_Index = 2
    } else if ($(this).find('cite').text() == '第三方科室对码') {
      $(this).css({ 'background': 'url(../layuiadmin/style/third_checked.png) no-repeat 10px center' }).addClass('click_checked_this')
      $(this).parents('#LAY_app').find('iframe').attr({ 'src': 'home/thirdPartyOfficeCode.html' })
      List_Index = 1
    }
  })
  $('.resert_or_out').click(function (e) {
    if (e.target.innerText == '重置密码') {
      $('.resert_or_out').toggleClass('resert_or_out_hidden')
      $('.resert_or_out').toggleClass('resert_or_out_show')
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
        content: `<div> 
          <form class="layui-form" action="" lay-filter="example">
          <div class="layui-form-item">
          <div class="layui-input-block">
            <input type="password" name="password" placeholder="请输入原始密码" autocomplete="off" class="layui-input oldPass">
          </div>
        </div>
          <div class="layui-form-item">
          <div class="layui-input-block">
            <input type="password" name="password" placeholder="请输入新密码" autocomplete="off" class="layui-input newPass1">
          </div>
        </div>
          <div class="layui-form-item">
          <div class="layui-input-block">
            <input type="password" name="password" placeholder="请再次确认新密码" autocomplete="off" class="layui-input newPass2">
          </div>
        </div>
        <div class="layui-form-item" style="display:flex;justify-content: center;margin-top:4%">
        <div class="layui-inline" style="margin-top:2%">
            <button type="button" class="layui-btn">取消</button>
            <button type="button" class="layui-btn userResetPasw" style="margin-left:80px;">确认</button>
          </div>
      </div>
        </form></div>`,
        success: function (layero) {
          $('.userResetPasw').click(() => {
            userReset()
            // console.log(layui.data('user'))
          })
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
          layero.find('.layui-input-block').css({ 'margin-left': '0', 'display': 'flex', 'justify-content': 'center', 'margin-top': '4%' })
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
  })

   // 改密码
   const userReset = () => {
    let oldPass = $('.oldPass').val()
    let newPass1 = $('.newPass1').val()
    let newPass2 = $('.newPass2').val()
    let account = layui.data('user').data.userCode
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


  view().autoRender();

  //加载公共模块
  layui.use('common');

  //对外输出
  exports('index', {
    //   openTabsPage: openTabsPage
  });
});
