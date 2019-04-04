var index = -1;
$(function(){
	var oTable = new TableInit();
	oTable.Init();
})
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#jasperList').bootstrapTable({
        	contentType : "application/x-www-form-urlencoded",
            dataType:"json",
            url: ctx + '/jaspers/findJaspers',         //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,          	         //是否显示分页（*）
            sortable: true,                     //是否启用排序
            sortOrder: "desc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 20, 30],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: true,                  //是否显示所有的列
            showRefresh: false,                  //是否显示刷新按钮
            //minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: false,                //是否启用点击选中行
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            height:668,
            onClickRow : function(row,element){
                index = element.data('index');
                $('.info').removeClass('info');
                $(element).addClass('info');
            },
            columns: [
                {
                    title : '序号',//标题  可不加
                    formatter : function(value, row, index) {
                         var pageSize=$("#jasperList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
                         var pageNumber=$("#jasperList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
                         return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
                    },
                    width : '5%',
                },
                {
                    field: 'jasperNo',
                    title: '报告单编号',
                    align: 'center',
                    valign: 'middle',
                },
                {
                    field: 'jasperName',
                    title: '报告单名称',
                    align: 'center',
                    valign: 'middle',
                },
            ],
	        onLoadSuccess: function () {
	        },
	        });
	    };
	
	    //得到查询的参数
	    oTableInit.queryParams = function (params) {
	        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	        	pageSize: params.limit,                         //页面大小
	            pageNumber: params.offset,   //页码
                jasperNo: $("#jasperNo").val(),
                jasperName : $("#jasperName").val(),
	        };
	        page = (params.offset / params.limit) + 1;
	        return temp;
	    };
	    return oTableInit;
};

function query(){
	$("#jasperList").bootstrapTable('refresh');
}

// 模态框 初始化数据
$(function(){
    $('#addie').on('hide.bs.modal', function () {
        $("#idModel").val("");
        $("#jasperNameModal").val("");
        $("#file").val("");
        $("#jasperFrom").data('bootstrapValidator').resetForm();
    })

    $('#addie').on('show.bs.modal', function () {

    })
    $('#updie').on('hide.bs.modal', function () {
        //$("#jasperNoUpModal").val("");
        $("#jasperNameUpModal").val("");
        $("#jasperNameUpModal").val("");
        $("#jasperId").val("");
        $("#inputfile").val("");
        $("#jasperUpFrom").data('bootstrapValidator').resetForm();
    })

    $('#updie').on('show.bs.modal', function () {

    })
})
function saveAndUpdate() {
    $("#jasperFrom").bootstrapValidator('validate');//提交验证
    if ($("#jasperFrom").data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
        var file = document.getElementById('file').files[0];
        var jasperName = $("#jasperNameModal").val();
        upload(file,jasperName);
    }
}
function uodateJasper() {
    $("#jasperUpFrom").bootstrapValidator('validate');//提交验证
    if ($("#jasperUpFrom").data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
        var file = document.getElementById('inputfile').files[0];
        var jasperName = $("#jasperNameUpModal").val();
        var id = $("#jasperId").val();
        var formData = new FormData();
        if (file != null && file != '' && file != 'undefined'){
            formData.append('file', file); //添加图片信息的参数
        }
        formData.append("jasperName",jasperName);
        formData.append("id",id);
        $.ajax({
            url: ctx+"/jaspers/updateJasper",
            type: 'POST',
            cache: false, //上传文件不需要缓存
            data: formData,
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            success: function (data) {
                $("#updie").modal("hide");
                if (data.result){
                    var dlg = BootstrapDialog.show({
                        message: "修改成功"
                    });
                    setTimeout(function(){
                        dlg.close();
                        query();
                    },2000);
                }else {
                    dialogShow("修改失败");
                }
            },
            error: function (data) {
                dialogShow("系统出错！");
            }
        })
    }
}

function upload(file,jasperName) {
    var formData = new FormData();
    formData.append('file', file); //添加图片信息的参数
    formData.append("jasperName",jasperName);
    $.ajax({
        url: ctx+"/jaspers/addJasper",
        type: 'POST',
        cache: false, //上传文件不需要缓存
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success: function (data) {
            $("#addie").modal("hide");
            if (data.result){
                var dlg = BootstrapDialog.show({
                    message: "上传成功"
                });
                setTimeout(function(){
                    dlg.close();
                    query();
                },2000);
            }else {
                dialogShow("上传失败");
            }
        },
        error: function (data) {
            dialogShow("系统出错！");
        }
    })
}

$(function () {
    $("#jasperUpFrom").bootstrapValidator({
        live: 'enabled',//验证时机，enabled是内容有变化就验证（默认），disabled和submitted是提交再验证
        excluded: [':disabled', ':hidden', ':not(:visible)'],//排除无需验证的控件，比如被禁用的或者被隐藏的
        submitButtons: '#btnSave',//指定提交按钮，如果验证失败则变成disabled，但我没试成功，反而加了这句话非submit按钮也会提交到action指定页面
        message: '通用的验证失败消息',//好像从来没出现过
        fields: {
            /*jasperNoUpModal: {
                validators: {
                    notEmpty: {//检测非空
                        message: '报告单编号不能为空'
                    },
                }
            },*/
            jasperNameUpModal: {
                validators: {
                    notEmpty: {//检测非空
                        message: '报告单名称不能为空'
                    },
                }
            },
            /*inputfile: {
                validators: {
                    notEmpty: {//检测非空
                        message: '请上传文件'
                    },
                }
            },*/
        }
    });
});


$(function () {
    $("#jasperFrom").bootstrapValidator({
        live: 'enabled',//验证时机，enabled是内容有变化就验证（默认），disabled和submitted是提交再验证
        excluded: [':disabled', ':hidden', ':not(:visible)'],//排除无需验证的控件，比如被禁用的或者被隐藏的
        submitButtons: '#btnSave',//指定提交按钮，如果验证失败则变成disabled，但我没试成功，反而加了这句话非submit按钮也会提交到action指定页面
        message: '通用的验证失败消息',//好像从来没出现过
        fields: {
            jasperNameModal: {
                validators: {
                    notEmpty: {//检测非空
                        message: '报告单名称不能为空'
                    },
                }
            },
            file: {
                validators: {
                    notEmpty: {//检测非空
                        message: '请上传文件'
                    },
                }
            },
        }
    });
});
//浏览
function showJasper() {
    if (index == -1){
        dialogShow("请选择一条数据")
        return false;
    }
    var selects=$("#jasperList").bootstrapTable('getData')[index];
    if (selects.jasperJpgPic != null && selects.jasperJpgPic != ''){
        postOpenWindow(ctx + "/jaspers/seeJasper",{ jasperJpgPic: selects.jasperJpgPic });
    }else {
        postOpenWindow(ctx + "/jaspers/seeJasper",{ jasperAddress: selects.jasperAddress,id:selects.id});
    }
}
function postOpenWindow(URL, PARAMS) {
    var temp_form = document.createElement("form");
    temp_form.action = URL;
    temp_form.target = "_blank";
    temp_form.method = "post";
    temp_form.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp_form.appendChild(opt);
    }
    document.body.appendChild(temp_form);
    temp_form.submit();
}
//修改
function toupdateJasper() {
    if (index == -1){
        dialogShow("请选择一条数据")
        return false;
    }
    var selects=$("#jasperList").bootstrapTable('getData')[index];
    $("#updie").modal("show");
    //$("#jasperNoUpModal").val(selects.jasperNo);
    $("#jasperNameUpModal").val(selects.jasperName);
    $("#jasperId").val(selects.id);
}

//删除
function delJasper() {
    if (index == -1){
        dialogShow("请选择一条数据")
        return false;
    }
    var selects=$("#jasperList").bootstrapTable('getData')[index];
    BootstrapDialog.confirm({
        title: '提示',
        message: '确定要删除吗？',
        type: BootstrapDialog.TYPE_WARNING,
        closable: true,
        draggable: true,
        btnCancelLabel: '取消',
        btnOKLabel: '确定', // <-- Default value is 'OK',
        btnOKClass: 'btn-warning',
        callback: function (result) {
            if (result) {
                $.ajax({
                    url:ctx +"/jaspers/delJasper",
                    type:"POST",
                    async:false,
                    data:{"id":selects.id,"deleted":"0"},
                    success:function (res) {
                        if (res.result){
                            index = "";
                            $("#jasperList").bootstrapTable('refresh');
                            dialogShow("删除成功");
                        }else {
                            dialogShow("删除失败");
                        }
                    }
                })
            }
        }
    })
}