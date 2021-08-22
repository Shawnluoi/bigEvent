$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击“去登录”的链接
    $('#link_login').on('click', function() {
            $('.login-box').show()
            $('.reg-box').hide()
        })
        //从layui中获取form对象
        // layui与$一样（因为在html页面导入了JQuery与Layout
    var form = layui.form
        //layer:弹出层
    var layer = layui.layer
        // 通过form.verify()函数自定义校验规则
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repwd: function(value) {
                // value是请再次确认密码的内容
                var pwd = $('.reg-box [name=password]').val()
                if (pwd !== value) {
                    return '两次密码不一致！'
                }
            }
        })
        //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            //1.e.preventDefault()阻止默认的submit提交事件
            e.preventDefault()
                //2.ajax的post请求
            var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.alert(res.message)
                }
                layer.alert('注册成功！')
                    //模拟人的点击事件（点击去登陆链接）
                $('#link_login').click()
            })
        })
        // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'post',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    //将登录成功得到的token字符串保留
                localStorage.setItem('token', res.token)
                    //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})