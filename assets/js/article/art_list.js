$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '年' + m + '月' + d + '日' + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义时间补零的函数

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发生错误！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发生错误！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    //通知layui重新渲染表单区
                form.render()
            }
        })
    }
    // 表单绑定submit方法
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // 通过属性选择器获取表单选中的值
            var cate_id = $('[cate_id]').val()
            var state = $('[state]').val()
                //下拉框所选的，赋值到q
            q.cate_id = cate_id
            q.state = state
                // 根据最新的渲染提交重新渲染表格数据
            initTable()
        })
        // 渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum, //默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8],
            // 分页发生切换时，触发jump回调

            // ！！！！触发jump回调的方式有两种
            // 1.点击页码的时候，会触发jump,first值为undefine
            // 2.只要调用了laypage.render()渲染分页方法，就会触发jump回调 first值为true
            //  
            jump: function(obj, first) {
                q.pagenum = obj.curr
                    // 切换条目也触发jump，使q.pagesize 等于当前所选每页显示几条数据
                q.pagesize = obj.limit
                    // 获取最新的q获取对应的数据列表，并渲染
                if (!first) {
                    initTable()
                }

            }
        })
    }

    // 代理方式，为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        // 拿到当前数据页面删除按钮的个数len
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                        // 当数据删除完后，需要判断当前这一页中，是否还要剩余的数据，如果没有剩余的数据，则让页码值-1之后再重新调用initTable()
                    if (len === 1) {
                        //如果len的值为1，证明删除完毕后，该页面上就没有任何数据了
                        // 页码值最小为1！
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        })

    })
})