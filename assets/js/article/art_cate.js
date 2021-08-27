$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
        // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var closeAddIndex = null
        // 添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function() {
            closeAddIndex = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            })
        })
        // 通过代理的方式，为弹出层的form-add表单添加绑定事件submit
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('添加新分类不成功！')
                    }
                    layer.msg('添加新分类成功！')
                    layer.close(closeAddIndex)
                    initArtCateList()
                }
            })
        })
        // 编辑按钮
    var closeEditIndex = null
    $('tbody').on('click', '#btn-edit', function() {
            closeEditIndex = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '编辑文章分类',
                content: $('#dialog-edit').html()
            })
            var id = $(this).attr('data-id')
            console.log(id);
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    console.log(res.data);
                    form.val('form-edit', res.data)
                }

            })
        })
        // 修改分类表单的submit
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('修改失败！')
                    }
                    layer.msg('修改成功！')
                    layer.close(closeEditIndex)
                    initArtCateList()
                }
            })
        })
        // 通过代理的方式，为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index)
                    initArtCateList()
                }
            })
        });
    })
})