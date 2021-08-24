$(function() {
    var form = layui.form
    form.verify({
        // 表单的nickname验证规则
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6之间'
            }
        }
    })
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 填充表单
                form.val('formUserInfo', res.data)
            }
        })
    }
    $('#btnReset').on('click', function(e) {
            e.preventDefault()
            initUserInfo()
        })
        // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})