$(function () {
    initTable();
    initListence();
    //加载需要缓存的数据
    initRole();
    addFormValidator();
    updateFormValidator();
    authorityFormValidator();
});

function initTable() {
    // 初始化Table
    var oTable = new TableInit();
    oTable.Init();
}

//事件监听
function initListence(){
    $("#btn_search").off("click").on("click",tab_search);
    $("#btn_sumitPassword").off("click").on("click",sumitPassword);
    $("#btn_sumitAddPerrsonnel").off("click").on("click",sumitAddPerrsonnel);
    $("#btn_sumitAuthority").off("click").on("click",sumitAuthority);
}

function tab_search() {
    $("#personnel_table").bootstrapTable('refresh');
}

//提交修改密码操作
function sumitPassword() {
    if (validatorModel("updatePasswordModel")){
        $.ajax({
            url : ctx + "/auth/personnel/personnelManagement/updatePassword",
            type : "post",
            dataType : "json",
            data:{
                userLogin:$("#userLogin").val(),
                passWord:$("#passwordValue").val(),
                token:$("#userLogin").val()
            },
            async : false,
            success : function(data) {
                if (data.rspCode=="000302") {
                    dialogShow(data.rspMsg) ;
                    $("#updatePasswordModel").modal("hide");
                }

            },
            error : function(data){
                dialogShow('保存用户失败，请联系管理员！') ;
            }
        });
    }
}

function sumitAddPerrsonnel(){
    if ($("#roleType option:selected").val ()=="resetVal"){
        dialogShow("请选择一个权限");
        return;
    }
    if (validatorModel("addPerrsonnelModel")){
        $.ajax({
            url : ctx + "/auth/personnel/personnelManagement/",
            type : "post",
            dataType : "json",
            data:{
                userLogin:$("#model_userLogin").val(),
                userName:$("#userName").val(),
                roleId:$('#roleType option:selected').val(),
                passWord:$("#passWord").val(),
                token:$("#model_userLogin").val()
            },
            async : false,
            success : function(data) {
                if (data.rspCode=="000300") {
                    dialogShow(data.rspMsg) ;
                    $("#addPerrsonnelModel").modal("hide");
                    tab_search();
                }

            },
            error : function(data){
                dialogShow('保存用户失败，请联系管理员！') ;
            }
        });
    }
}

function sumitAuthority(){
    if ($("#authorityRoleMenu option:selected").val ()=="resetVal"){
        dialogShow("请选择一个权限");
        return;
    }
    if (validatorModel("authorityManagementModel")){
        $.ajax({
            url : ctx + "/auth/personnel/personnelManagement/updateRole",
            type : "post",
            dataType : "json",
            data:{
                userLogin:$("#userLogin").val(),
                token:$("#userLogin").val(),
                roleId:$('#authorityRoleMenu option:selected') .val()
            },
            async : false,
            success : function(data) {
                if (data.rspCode=="000304") {
                    dialogShow(data.rspMsg) ;
                    $("#authorityManagementModel").modal("hide");
                    tab_search();
                }

            },
            error : function(data){
                dialogShow('保存用户失败，请联系管理员！') ;
            }
        });
    }
}

var TableInit = function () {
    var oTableInit = new Object();
    // 初始化Table
    oTableInit.Init = function() {
        $('#personnel_table').bootstrapTable({
            url : ctx + '/auth/personnel/personnelManagement/', // 请求后台的URL（*）
            method : 'get', // 请求方式（*）
            striped : true, // 是否显示行间隔色
            cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination : true, // 是否显示分页（*）
            sortable : false, // 是否启用排序
            sortOrder : "desc", // 排序方式
            queryParams : oTableInit.queryParams,// 传递参数（*）
            sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber : 1, // 初始化加载第一页，默认第一页
            pageSize : 10, // 每页的记录行数（*）
            pageList : [ 10, 25, 50, 100 ], // 可供选择的每页的行数（*）
            search : false, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch : true,
            showColumns : false, // 是否显示所有的列
            showRefresh : false, // 是否显示刷新按钮
            minimumCountColumns : 2, // 最少允许的列数
            clickToSelect : true, // 是否启用点击选中行
            height : 500, // 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId : "ID", // 每一行的唯一标识，一般为主键列
            showToggle : false, // 是否显示详细视图和列表视图的切换按钮
            cardView : false, // 是否显示详细视图
            detailView : false, // 是否显示父子表
            responseHandler : function(res) {
                return {
                    "total" : res.total,// 总页数
                    "rows" : res.list
                };
            },
            columns: [
                {
                    title : '序号',//标题  可不加
                    formatter : function(value, row, index) {
                        return index + 1;
                    },
                    width : '15%',
                    align :'center'
                },
                {
                    field: 'userLogin',
                    title: '用户名',
                    width : '15%',
                    align :'center'
                },
                {
                    field: 'userName',
                    title: '姓名',
                    width : '15%',
                    align :'center'
                },{
                    field: 'roleId',
                    title: '角色id',
                    visible: false
                },{
                    field: 'roleName',
                    title: '角色类型',
                    width : '15%',
                    align :'center'
                },{
                    field: 'isValid',
                    title: '启用/禁用',
                    width : '15%',
                    align :'center',
                    formatter : function(value, row, index) {
                        if (row.isValid == "1") {
                            return "<div class=\"switch\"><input id=\"switch_iOS"+index+"\" onclick=\"changeStatus("+index+")\"  type=\"checkbox\" checked=\"checked\" class=\"switch_iOS\">\n" +
                                "<label for=\"switch_iOS"+index+"\"><i></i></label></div>";
                        } else {
                            return "<div class=\"switch\"><input id=\"switch_iOS"+index+"\" onclick=\"changeStatus("+index+")\" type=\"checkbox\"  class=\"switch_iOS\">\n" +
                                "<label for=\"switch_iOS"+index+"\"><i></i></label></div>";
                        }
                    }
                },{
                    field : 'Button',
                    title : '操作',
                    align: 'center',
                    formatter: actionFormatter,
                    events:actionEvents
                }
            ]
        });
    };

    // 得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = {
            limit : params.limit, // 页面大小
            offset : params.offset,   //页码
            userLogin:$("#userLogins").val()
        };
        return temp;
    };

    function actionFormatter(value, row, index) {
        return ['<button  id="btn_updatePassword" type="button" class="btn btn-primary" >修改密码</button>&nbsp',
            '<button  id="btn_authorityManagement" type="button" class="btn btn-primary" >权限管理</button>&nbsp'
        ].join('');
    }

    window.actionEvents = {
        'click #btn_updatePassword':function(e,value,row,index){
            $("#userLogin").val(row.userLogin);
            $("#updatePasswordModel").modal("show");

        },
        'click #btn_authorityManagement':function(e,value,row,index){
            $("#userLogin").val(row.userLogin);
            $("#authorityManagementModel").modal("show");
        }
    };
    return oTableInit;
};

function changeStatus(index) {
    var isValid = '0';
    var rowValue =  $("#personnel_table").bootstrapTable('getData')[index];
    var userLogin=rowValue.userLogin;
    if($('#switch_iOS'+index).is(':checked')) {
        isValid = '1';
        //判断该角色是否还在使用
        if (whetherUser(userLogin)) {
            $('#switch_iOS'+index).removeAttr("checked");
        }else{
            submitStatus(userLogin,isValid);
        }
    }else{
        submitStatus(userLogin,isValid);
    }

}

function submitStatus(userLogin,isValid) {
    $.ajax({
        url: ctx + '/auth/personnel/personnelManagement/' + userLogin,
        type: "post",
        data:{isValid:isValid},
        dataType: "json",
        async: false,
        success: function (data) {
            dialogShow(data.rspMsg) ;
            if (data.rspCode=="000311") {
                tab_search();
            }
        }
    });
}

function whetherUser(userLogin) {
    var status = true;
    $.ajax({
        url: ctx + '/auth/personnel/personnelManagement/userRole/' + userLogin,
        type: "get",
        dataType: "json",
        async: false,
        success: function (data) {
            debugger;
            if (data.isValid=="0") {
                dialogShow("该用户角色已删除，请重新分配角色！") ;
            }else{
                status = false;
            }
        }
    });
    return status;
}

function initRole() {
    $.ajax({
        url : ctx + "/auth/personnel/roleManagement/noPagination",
        type : "get",
        dataType : "json",
        async : false,
        success : function(data) {
            for(var p in data){
                $("#roleType").append ("<option value="+data[p].roleId+">"+data[p].roleName+"</option>");
                $("#authorityRoleMenu").append ("<option value="+data[p].roleId+">"+data[p].roleName+"</option>");
            }
        },
        error : function(data){
            dialogShow('加载角色列表出错，请联系管理员！') ;
        }
    });
}

$('#addPerrsonnelModel').on('hidden.bs.modal', function () {
    //重置输入框
    $("#model_userLogin").val('');
    $("#userName").val('');
    $("#roleType").val('');
    $("#passWord").val('');
    //validatorModel重置
    $("#addPerrsonnelModel").data('bootstrapValidator').destroy();
    $('#addPerrsonnelModel').data('bootstrapValidator',null);
    addFormValidator();
});

$('#updatePasswordModel').on('hidden.bs.modal', function () {
    $("#passwordValue").val('');
    $("#rePasswordValue").val('');
    //validatorModel重置
    $("#updatePasswordModel").data('bootstrapValidator').destroy();
    $('#updatePasswordModel').data('bootstrapValidator',null);
    updateFormValidator();
});

$('#authorityManagementModel').on('hidden.bs.modal', function () {
    $("#authorityRoleMenu  option[value='resetVal'] ").attr("selected",true)
    //validatorModel重置
    $("#authorityManagementModel").data('bootstrapValidator').destroy();
    $('#authorityManagementModel').data('bootstrapValidator',null);
    authorityFormValidator();
});

function validatorModel(modelName){
    var bootstrapValidator = $("#"+modelName).data('bootstrapValidator');
    bootstrapValidator.validate();
    if(bootstrapValidator.isValid()){
        return true;
    }
    return false;
}


function addFormValidator(){
    $("#addPerrsonnelModel").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            //普通字段不为空校验
            model_userLogin: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    remote: {
                        //ajax验证。服务器端返回的 result:{"valid",true or false} 向服务发送当前input name值，获得一个json数据。例表示正确：{"valid",true}
                        url: ctx+"/auth/personnel/personnelManagement/checkDiff",
                        message: '已存在用户名',
                        delay :  4000,
                        type: 'get'//请求方式
                    }
                }
            },
            userName: {
                validators: {
                    notEmpty: {
                        message: '姓名不能为空'
                    }
                }
            },
            roleType: {
                validators: {
                    notEmpty: {
                        message: '角色类型不能为空'
                    }
                }
            },
            passWord: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    }
                }
            }
        }
    });
}

function updateFormValidator(){
    $("#updatePasswordModel").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            //普通字段不为空校验
            passwordValue: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 16,
                        message: '密码长度在6到16之间'
                    }
                }
            },
            rePasswordValue: {
                message: '密码重复还没有验证',
                validators: {
                    notEmpty: {
                        message: '密码重复不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 16,
                        message: '密码长度在6到16之间'
                    },
                    identical: {
                        field: 'passwordValue',
                        message: '两次密码不同请重新输入'
                    }
                }
            }
        }
    });
}

function authorityFormValidator(){
    $("#authorityManagementModel").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            //普通字段不为空校验
            authorityRoleMenu: {
                validators: {
                    notEmpty: {
                        message: '角色类型不能为空'
                    }
                }
            }
        }
    });
}
