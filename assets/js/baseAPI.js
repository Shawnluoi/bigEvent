//注意：每次调用get、post、或者$ajax()的时候会先调用$.ajaxPrefilter函数，这个函数可以拿到ajax中的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        //统一设置header请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空token（防止手动输入token已达到登录后台的假操作）
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})