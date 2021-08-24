$(function() {
    getUserInfo()
    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        layer.confirm('是否退出？', { icon: 3, title: '提示' }, function(index) {
            //do something
            localStorage.removeItem('token')
            location.href = '/login.html'
                // 关闭confirm弹出框组件
            layer.close(index)
        });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败!')
            }
            // 调用renderAvatar来渲染用户头像
            renderAvatar(res.data)
        },
        // complete: function(res) {
        //     // console.log('1');
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 清空token（防止手动输入token已达到登录后台的假操作）
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}


function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;$nbsp;' + name)
    if (user.user_pic !== null) {
        // 渲染头像图片
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        firstname = name[0].toUpperCase()
        $('.text-avatar').html(firstname).show()
    }
}