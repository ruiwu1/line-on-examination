var index = -1;
var selectModalityModel = "";
var selectPartModel = "";
$(function(){
    queryExamModalityOptions();
    queryExamPartOptions();
	var oTable = new TableInit();
	oTable.Init();
})
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#templateList').bootstrapTable({
        	contentType : "application/x-www-form-urlencoded",
            dataType:"json",
            url: ctx + '/consultation/findPublicTemplates',         //请求后台的URL（*）
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
          //  showColumns: true,                  //是否显示所有的列
            showRefresh: false,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
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
					 var pageSize=$("#templateList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
                     var pageNumber=$("#templateList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
                     return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
				},
				width : '5%',
			},
			{
				field: 'examModality',
				title: '检查模式',
				align: 'center',
				valign: 'middle',
			},
            {
                field: 'examPart',
                title: '检查部位',
                align: 'center',
		        valign: 'middle',
            },
            {
            	field: 'diseaseName',
                title: '疾病名称',
                align: 'center',
		        valign: 'middle',
            },
			{
				field: 'modelName',
				title: '模板名称',
				align: 'center',
				valign: 'middle',
			},
            {
                field: 'createUserId',
                title: '创建人',
                align: 'center',
		        valign: 'middle',
            },
			{
				field: 'createTime',
				title: '创建时间',
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
                examModalityType: $("#examModalityType").val(),
                examPartType : $("#examPartType").val(),
                diseaseName: $("#diseaseName").val(),
                modelName: $("#modelName").val()
	        };
	        page = (params.offset / params.limit) + 1;
	        return temp;
	    };
	    return oTableInit;
};

function query(){
	$("#templateList").bootstrapTable('refresh');
}

function addTemplate() {
    
}

function updateTemplate() {
    $("#templateFrom").bootstrapValidator('validate');//提交验证
    var flag = $('#templateFrom').data("bootstrapValidator").isValid();

    setTimeout(function(){

        var flag2 = $('#templateFrom').data("bootstrapValidator").isValid();

        if(flag2){
            saveAndUpdate();
        }                
        }, 500);

    /*if ($("#templateFrom").data('bootstrapValidator').isValid()) {//获取验证结果，如果成功，执行下面代码
        saveAndUpdate();
    }*/
}

function saveAndUpdate() {
    var id = $("#idModel").val();
    $.ajax({
        url:ctx+"/consultation/saveAndUpdate",
        type:"post",
        data:$("#templateFrom").serialize(),
        success:function (res) {
            if (res.result){
                if (id == null || id == ""){
                    dialogShow("保存成功");
                }else {
                    dialogShow("已修改");
                }
                $("#templateList").bootstrapTable('refresh');
                $("#addie").modal("hide");
            }else {
                if (id == null || id == ""){
                    dialogShow("保存失败");
                }else {
                    dialogShow("修改失败");
                }
            }
        }
    })
}

function delTemplate() {
    if (index == -1){
        dialogShow("请选择一条数据");
        return false;
    }
    var selects=$("#templateList").bootstrapTable('getData')[index];
    BootstrapDialog.confirm({
        title: '提示',
        message: '确定要删除模板吗？',
        type: BootstrapDialog.TYPE_WARNING,
        closable: true,
        draggable: true,
        btnCancelLabel: '取消',
        btnOKLabel: '确定', // <-- Default value is 'OK',
        btnOKClass: 'btn-warning',
        callback: function (result) {
            if (result) {
                $.ajax({
                    url:ctx +"/consultation/saveAndUpdate",
                    type:"POST",
                    async:false,
                    data:{"id":selects.id,"deleted":"1"},
                    success:function (res) {
                        if (res.result){
                            index = "";
                            $("#templateList").bootstrapTable('refresh');
                            dialogShow("已删除");
                        }else {
                            dialogShow("删除失败");
                        }
                    }
                })
            }
        }
    })
}

// 查询select
function queryExamModalityOptions() {
    $.ajax({
        url:ctx+"/consultation/queryExamModalityOptions",
        type:"POST",
        success:function (res) {
            $("#examModalityType").empty();
            $("#examModalityType").append("<option value=''>请选择检查模式</option>");
            for(var i = 0; i < res.length; i++){
                $("#examModalityType").append("<option value='"+res[i].examModalityType+"'>"+res[i].examModality+"</option>");
            }
        },
        error:function (res) {
            dialogShow("查询检查模式失败，请联系管理员");
        }
    })
}
// 查询select
function queryExamPartOptions() {
    $.ajax({
        url:ctx+"/consultation/queryExamPartOptions",
        type:"POST",
        success:function (res) {
            $("#examPartType").empty();
            $("#examPartType").append("<option value=''>请选择检查部位</option>");
            for(var i = 0; i < res.length; i++){
                $("#examPartType").append("<option value='"+res[i].examPartType+"'>"+res[i].examPart+"</option>");
            }
        },
        error:function (res) {
            dialogShow("查询检查部位失败，请联系管理员");
        }
    })
}
// 模态框查询select
function queryExamModalityModelOptions() {
    $.ajax({
        url:ctx+"/consultation/queryExamModalityOptions",
        type:"POST",
        success:function (res) {
            $("#examModalityModel").empty();
            $("#examModalityModel").append("<option value=''>请选择检查模式</option>");
            for(var i = 0; i < res.length; i++){
                $("#examModalityModel").append("<option value='"+res[i].examModalityType+"'>"+res[i].examModality+"</option>");
                if ( selectModalityModel != null && selectModalityModel != ''){
                    $("#examModalityModel").val(selectModalityModel);
                }
            }
        },
        error:function (res) {
            dialogShow("查询检查模式失败，请联系管理员");
        }
    })
}
// 模态框查询select
function queryExamPartModelOptions() {
    $.ajax({
        url:ctx+"/consultation/queryExamPartOptions",
        type:"POST",
        success:function (res) {
            $("#examPartModel").empty();
            $("#examPartModel").append("<option value=''>请选择检查部位</option>");
            for(var i = 0; i < res.length; i++){
                $("#examPartModel").append("<option value='"+res[i].examPartType+"'>"+res[i].examPart+"</option>");
                if ( selectPartModel != null && selectPartModel != ''){
                    $("#examPartModel").val(selectPartModel);
                }
            }
        },
        error:function (res) {
            dialogShow("查询检查部位失败，请联系管理员");
        }
    })
}

// 模态框 初始化数据
$(function(){
    $('#addie').on('hide.bs.modal', function () {
        $("#idModel").val("");
        $("#examModalityModel").val("");
        $("#examPartModel").val("");
        $("#diseaseNameModel").val("");
        $("#modelNameModel").val("");
        $("#examImpressionModel").val("");
        $("#examFindingsModel").val("");
        selectModalityModel = "";
        selectPartModel = "";
        $("#templateFrom").data('bootstrapValidator').resetForm();
    })

    $('#addie').on('show.bs.modal', function () {
        queryExamModalityModelOptions();
        queryExamPartModelOptions();
        //$('#templateFrom').data("bootstrapValidator").validate();
    })
})

function toUpdate() {
    if (index == -1){
        dialogShow("请选择一条数据");
        return false;
    }
    var selects=$("#templateList").bootstrapTable('getData')[index];
    $("#addie").modal("show");
    $("#idModel").val(selects.id);
    //$("#examModalityModel").val(selects.examModality);
    selectModalityModel = selects.examModality;
    //$("#examPartModel").val(selects.examPart);
    selectPartModel = selects.examPart;
    $("#diseaseNameModel").val(selects.diseaseName);
    $("#modelNameModel").val(selects.modelName);
    $("#examImpressionModel").val(selects.examImpression);
    $("#examFindingsModel").val(selects.examFindings);
    $("#spanId").text("修改");
}

$(function () {
    $("#templateFrom").bootstrapValidator({
        live: 'enabled',//验证时机，enabled是内容有变化就验证（默认），disabled和submitted是提交再验证
        excluded: [':disabled', ':hidden', ':not(:visible)'],//排除无需验证的控件，比如被禁用的或者被隐藏的
        submitButtons: '#btnSave',//指定提交按钮，如果验证失败则变成disabled，但我没试成功，反而加了这句话非submit按钮也会提交到action指定页面
        message: '通用的验证失败消息',//好像从来没出现过
        fields: {
            examModalityModel: {
                validators: {
                    notEmpty: {//检测非空
                        message: '请选择检查模式'
                    },
                }
            },
            examPartModel: {
                validators: {
                    notEmpty: {//检测非空
                        message: '请选择检查部位'
                    },
                }
            },
            diseaseNameModel: {
                validators: {
                    notEmpty: {//检测非空
                        message: '请输入疾病名称'
                    },
                }
            },
            modelNameModel: {
                threshold: 1,//有1字符以上才发送ajax请求
                validators: {
                    notEmpty: {//检测非空
                        message: '请输入模板名称'
                    },
                    remote: {//ajax验证。server result:{"valid",true or false}
                        url: ctx + "/consultation/checkModelName",
                        message: '模板名称已存在,请重新输入',
                        delay: 1000,//ajax刷新的时间是1秒一次
                        type: 'POST', //自定义提交数据，默认值提交当前input value
                        dataType: "json",
                        async: false,
                        data: {
                            //多参数传递,每个值需要用function返回,
                            examModality:function(){

                                return $("#examModalityModel").val();
                            },
                            examPart:function(){

                                return $("#examPartModel").val();
                            },
                            modelName:function(){

                                return $("#modelNameModel").val();
                            }
                        }
                    },
                }
            },
            examImpressionModel: {
                validators: {
                    notEmpty: {//检测非空
                        message: '请输入检查印象'
                    },
                }
            },
            examFindingsModel: {
                validators: {
                    notEmpty: {//检测非空
                        message: '请输入检查所见'
                    },
                }
            },
        }
    });
});