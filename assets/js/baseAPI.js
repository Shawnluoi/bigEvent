//注意：每次调用get、post、或者$ajax()的时候会先调用$.ajaxPrefilter函数，这个函数可以拿到ajax中的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})