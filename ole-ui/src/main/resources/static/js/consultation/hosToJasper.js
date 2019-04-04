var index = -1;
$(function(){
    getNations('1','province',$("#province"));
	var oTable = new TableInit();
	oTable.Init();
})
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#hosToJasperList').bootstrapTable({
        	contentType : "application/x-www-form-urlencoded",
            dataType:"json",
            url: ctx + '/hosToJasper/queryHosJapers',         //请求后台的URL（*）
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
                         var pageSize=$("#hosToJasperList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
                         var pageNumber=$("#hosToJasperList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
                         return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
                    },
                    width : '5%',
                },
                {
                    field: 'scenceID',
                    title: '医院编号',
                    align: 'center',
                    valign: 'middle',
                },
                {
                    field: 'hospitalName',
                    title: '医院名称',
                    align: 'center',
                    valign: 'middle',
                },
                {
                    field: 'hospitalAddress',
                    title: '医院地址',
                    align: 'center',
                    valign: 'middle',
                },
                {
                    field: 'hospitalCode',
                    title: '医疗机构代码',
                    align: 'center',
                    valign: 'middle',
                },
                {
                    field: 'jasperName',
                    title: '报告模板',
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
                county : $("#county").val(),
                city : $("#city").val(),
                province : $("#province").val(),
                hospitalName : $("#hospitalName").val(),
                scenceID : $("#scenceID").val(),
	        };
	        page = (params.offset / params.limit) + 1;
	        return temp;
	    };
	    return oTableInit;
};

function query(){
	$("#hosToJasperList").bootstrapTable('refresh');
}

// 模态框 初始化数据
$(function(){
    $('#addie').on('hide.bs.modal', function () {
        $("#hosToJasperFrom").data('bootstrapValidator').resetForm();
    })

    $('#addie').on('show.bs.modal', function () {

    })
    $('#updie').on('hide.bs.modal', function () {
        $("#hosToJasperId").val("");
        $("#hosToJasperUpFrom").data('bootstrapValidator').resetForm();
    })

    $('#updie').on('show.bs.modal', function () {

    })
})
function saveAndUpdate() {
    $("#hosToJasperFrom").bootstrapValidator('validate');//提交验证
    if ($("#hosToJasperFrom").data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
        var hospitalCode =  $("#hospitalNameModal").val();
        var jasperNo = $("#jasperNo").val();
        save(hospitalCode,jasperNo);
    }
}

function save(hospitalCode,jasperNo) {
    $.ajax({
        url: ctx+"/hosToJasper/saveAndUpdate",
        type: "POST",
        async: false,
        data: {"hospitalCode":hospitalCode,"jasperNo":jasperNo},
        success: function (res) {
            if (res.result){
                $('#addie').modal("hide");
                dialogShow("新增成功");
                $("#hosToJasperList").bootstrapTable('refresh');
            }else {
                dialogShow("新增失败");
            }
        }
    })
}

function updateHosJasper() {
    $("#hosToJasperUpFrom").bootstrapValidator('validate');//提交验证
    if ($("#hosToJasperUpFrom").data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
        var hospitalCode =  $("#hospitalNameUpModal").val();
        var jasperNo = $("#jasperNoUp").val();
        var hosToJasperId = $("#hosToJasperId").val();
        update(hospitalCode,jasperNo,hosToJasperId);
    }
}

function update(hospitalCode,jasperNo,hosToJasperId) {
    $.ajax({
        url: ctx+"/hosToJasper/saveAndUpdate",
        type: "POST",
        async: false,
        data: {"hospitalCode":hospitalCode,"jasperNo":jasperNo,"id":hosToJasperId},
        success: function (res) {
            if (res.result){
                $('#updie').modal("hide");
                dialogShow("修改成功");
                $("#hosToJasperList").bootstrapTable('refresh');
            }else {
                dialogShow("修改失败");
            }
        }
    })
}

$(function () {
    $("#hosToJasperFrom").bootstrapValidator({
        live: 'enabled',//验证时机，enabled是内容有变化就验证（默认），disabled和submitted是提交再验证
        excluded: [':disabled', ':hidden', ':not(:visible)'],//排除无需验证的控件，比如被禁用的或者被隐藏的
        submitButtons: '#btnSave',//指定提交按钮，如果验证失败则变成disabled，但我没试成功，反而加了这句话非submit按钮也会提交到action指定页面
        message: '通用的验证失败消息',//好像从来没出现过
        fields: {
            hospitalNameModal: {
                threshold: 2,//有1字符以上才发送ajax请求
                validators: {
                    notEmpty: {//检测非空
                        message: '医院不能为空'
                    },
                    remote: {//ajax验证。server result:{"valid",true or false}
                        url: ctx + "/hosToJasper/checkHos",
                        message: '医院已添加，请选择其他医院',
                        delay: 1000,//ajax刷新的时间是1秒一次
                        type: 'POST', //自定义提交数据，默认值提交当前input value
                        /*data: function(validator) {
                            return {
                                userName : $("input[name=userName]").val(),
                                method : "checkUserName"//UserServlet判断调用方法关键字。 }; } }*/
                    },
                }
            },
            jasperNo: {
                validators: {
                    notEmpty: {//检测非空
                        message: '报告模板不能为空'
                    },
                }
            },
        }
    });
});


$(function () {
    $("#hosToJasperUpFrom").bootstrapValidator({
        live: 'enabled',//验证时机，enabled是内容有变化就验证（默认），disabled和submitted是提交再验证
        excluded: [':disabled', ':hidden', ':not(:visible)'],//排除无需验证的控件，比如被禁用的或者被隐藏的
        submitButtons: '#btnSave',//指定提交按钮，如果验证失败则变成disabled，但我没试成功，反而加了这句话非submit按钮也会提交到action指定页面
        message: '通用的验证失败消息',//好像从来没出现过
        fields: {
            hospitalNameUpModal: {
                validators: {
                    notEmpty: {//检测非空
                        message: '医院不能为空'
                    },
                }
            },
            jasperNoUp: {
                validators: {
                    notEmpty: {//检测非空
                        message: '报告模板不能为空'
                    },
                }
            },
        }
    });
});

function toAdd() {
    $("#addie").modal("show");
    queryHospital(0,null);
    queryJaspers(0,null);
}

//修改
function updateHosToJasper() {
    if (index == -1){
        dialogShow("请选择一条数据")
        return false;
    }
    var selects=$("#hosToJasperList").bootstrapTable('getData')[index];
    $("#updie").modal("show");
    queryHospital(1,selects.hospitalCode);
    queryJaspers(1,selects.jasperNo);
    $("#hosToJasperId").val(selects.id);
}

//删除
function delHosToJasper() {
    if (index == -1){
        dialogShow("请选择一条数据")
        return false;
    }
    var selects=$("#hosToJasperList").bootstrapTable('getData')[index];
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
                    url:ctx +"/hosToJasper/saveAndUpdate",
                    type:"POST",
                    async:false,
                    data:{"id":selects.id,"isValid":"0"},
                    success:function (res) {
                        if (res.result){
                            index = "";
                            $("#hosToJasperList").bootstrapTable('refresh');
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

//初始化上传单位
function queryHospital(type,parm){
    var workUnit = null;
    var d = {};
    var f= [];
    if(type == 0){
        workUnit = $("#hospitalNameModal");
    }else{
        workUnit = $("#hospitalNameUpModal");
        $.ajax({
            type:'post',
            url: ctx + "/auditDoctor/queryWorkUnit",
            async:false,
            data:{
                'hospitalCode': parm
            },
            dataType:'json',
            success:function(data){
                d.id = data[0].hospitalCode;
                d.text = data[0].hospitalName;
                f.push(d);
            }
        })
    }

    workUnit.empty();
    workUnit.select2({
        data: f,
        placeholder:'请选择',
        allowClear:true,
        language: "zh-CN",
        ajax: {
            url: ctx + "/auditDoctor/queryWorkUnit",
            dataType: 'json',
            delay: 200,
            data: function (params) {
                return {
                    hospitalName : params.term,
                };
            },
            processResults: function (data) {
                for(var i=0;i<data.length;i++){
                    data[i].id=data[i].hospitalCode;
                    data[i].text=data[i].hospitalName;
                }
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: function formatRepo(data){
            return data.text ;
        }
    });
}

//初始化报告模板
function queryJaspers(type,parm){
    var workUnit = null;
    var d = {};
    var f= [];
    if(type == 0){
        workUnit = $("#jasperNo");
    }else{
        workUnit = $("#jasperNoUp");
        $.ajax({
            type:'post',
            url: ctx + "/hosToJasper/queryJaspers",
            async:false,
            data:{
                'jasperNo': parm
            },
            dataType:'json',
            success:function(data){
                d.id = data[0].jasperNo;
                d.text = data[0].jasperName;
                f.push(d);
            }
        })
    }

    workUnit.empty();
    workUnit.select2({
        data: f,
        placeholder:'请选择',
        allowClear:true,
        language: "zh-CN",
        ajax: {
            url: ctx + "/hosToJasper/queryJaspers",
            dataType: 'json',
            delay: 200,
            data: function (params) {
                return {
                    jasperNo : params.term,
                };
            },
            processResults: function (data) {
                for(var i=0;i<data.length;i++){
                    data[i].id=data[i].jasperNo;
                    data[i].text=data[i].jasperName;
                }
                return {
                    results: data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: function formatRepo(data){
            return data.text ;
        }
    });
}


//后台获取区域
function getNations(parent,flag,ele) {
    var options = '';
    $.ajax({
        type : "post",
        url : ctx + "/nation/queryNation",
        data : {
            parent : parent
        },
        dataType : "json",
        async : false,
        success : function(data) {
            options += '<option value="">请选择</option>';
            if (flag == 'province') {
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i].saleid + '">' + data[i].province + '</option>';
                }
            }
            if (flag == 'city') {
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i].saleid + '">' + data[i].city + '</option>';
                }
            }
            if (flag == 'county') {
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i].saleid + '">' + data[i].county + '</option>';
                }
            }
            ele.html(options);
        },
        error : function(data){
            var dlg = BootstrapDialog.show({
                message: '系统出错！'
            });
            setTimeout(function(){
                dlg.close();
            },1000);
        }
    });
}

function provinceChange() {
    var province = $("#province").val();
    if ($.trim(province) != '') {
        getNations(province,'city',$("#city"));
    }else{
        $("#city").html('<option value="">请选择</option>');
        $("#county").html('<option value="">请选择</option>');
    }
}

function cityChange() {
    var city = $("#city").val();
    if ($.trim(city) != '') {
        getNations(city,'county',$("#county"));
    } else {
        $("#county").html('<option value="">请选择</option>');
    }
}