var tree,uptree;
/**
 * ztree 属性设置
 */

var setting = {
    data : {
        simpleData : {
            enable : true,
            idKey : "id",
            pIdKey : "pId"
        }
    },
    check: {
        enable: true
    },
    async : {
        enable : true,
        type:"get",
        url : ctx+"/auth/roleResource/"
    }
};

$(function () {
    initTable();
    initListence();
    formValidator();
    tree = $.fn.zTree.init($("#roleTree"), setting);
    uptree = $.fn.zTree.init($("#updateRoleTree"), setting);
});

function initTable() {
    // 初始化Table
    var oTable = new TableInit();
    oTable.Init();
}

//事件监听
function initListence(){
    $("#btn_sumitAddRoleModel").off("click").on("click",sumitAddRoleModel);
    $("#btn_sumitUpdateRoleModel").off("click").on("click",sumitUpdateRoleModel);
}

function checkAddRoleTree(checkbox){
    if (checkbox.checked == true){
        chooseAll("roleTree",true)
    }else{
        chooseAll("roleTree",false)
    }
}

function checkUpdateRoleTree(checkbox){
    if (checkbox.checked == true){
        chooseAll("updateRoleTree",true)
    }else{
        chooseAll("updateRoleTree",false)
    }
}

function chooseAll(ztreeName,status) {
    var zTree = $.fn.zTree.getZTreeObj(ztreeName);
    zTree.checkAllNodes(status);
}

function sumitAddRoleModel() {
    if (validatorModel("addRoleModel")){
        var sourceRefids = [];
        var CheckedNodes = tree.getCheckedNodes(true);
        for (var i=0;i<CheckedNodes.length;i++) {
            sourceRefids.push(CheckedNodes[i].nodeId);
        }
        if (isEmpty(sourceRefids)){
            dialogShow("请选择权限");
            return
        }
        $.ajax({
            url : ctx+"/auth/roleResource/",
            type : "post",
            dataType : "json",
            data : {
                "token":sourceRefids.join(""),
                "roleName":$("#roleName").val(),
                "resoureRefid":sourceRefids.join(",")},
            success : function(data) {
                if (data.rspCode=="000306") {
                    dialogShow(data.rspMsg);
                    $("#addRoleModel").modal("hide");
                    tab_search();
                }
            }
        });
    }

}
function sumitUpdateRoleModel() {
        var sourceRefids = [];
        var CheckedNodes = uptree.getCheckedNodes(true);
        for (var i=0;i<CheckedNodes.length;i++) {
            sourceRefids.push(CheckedNodes[i].nodeId);
        }
    if (isEmpty(sourceRefids)){
        dialogShow("请选择权限");
        return
    }
        $.ajax({
            url : ctx+"/auth/roleResource/"+$("#table_roleId").val(),
            type : "post",
            data:{"token":$("#table_roleId").val()},
            dataType : "json",
            data : {"resoureRefid":sourceRefids.join(",")},
            success : function(data) {
                if (data.rspCode=="000306") {
                    dialogShow(data.rspMsg);
                    $("#updateRoleModel").modal("hide");
                    tab_search();
                }
            }
        });
}

var TableInit = function () {
    var oTableInit = new Object();
    // 初始化Table
    oTableInit.Init = function() {
        $('#role_table').bootstrapTable({
            url : ctx + '/auth/personnel/roleManagement/', // 请求后台的URL（*）
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
                    field: 'roleName',
                    title: '角色类型',
                    width : '40%',
                    align :'center'
                },
                {
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
            userName:$("#userName").val()
        };
        return temp;
    };

    function actionFormatter(value, row, index) {
        return ['<button  id="btn_updatePassword" type="button" class="btn btn-primary" >权限设置</button>&nbsp',
            '<button  id="btn_authorityManagement" type="button" class="btn btn-primary" >删除</button>&nbsp'
        ].join('');
    }
    /**
     * 跳转讯飞浏览影像接口
     * @returns
     */
    window.actionEvents = {
        'click #btn_updatePassword':function(e,value,row,index){
            $("#table_roleId").val(row.roleId);
            $.ajax({
                url : ctx+'/auth/roleResource/'+row.roleId,
                type : "get",
                dataType : "json",
                async : false,
                success : function(data) {
                    debugger;
                    if(data == null || data == undefined){
                        dialogShow("树加载失败");
                    }else{
                        var zTreeObj = $.fn.zTree.getZTreeObj("updateRoleTree");
                        var zTree = zTreeObj.getCheckedNodes(false);
                        if (data.length==zTree.length) {
                            $("#updateTreeCheckAll").prop('checked','checked');
                        }
                        for (var j = 0; j < data.length; j++) {
                            for (var i = 0; i < zTree.length; i++) {
                                if (zTree[i].id==data[j].menuId) {
                                    zTreeObj.expandNode(zTree[i], true); //展开选中的
                                    zTreeObj.checkNode(zTree[i], true);
                                }
                            }
                        }
                        $("#updateRoleModel").modal("show");
                    }
                }
            });

        },
        'click #btn_authorityManagement':function(e,value,row,index){
            BootstrapDialog.confirm({
                title: '',
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
                            url: ctx + '/auth/personnel/roleManagement/' + row.roleId,
                            type: "post",
                            dataType: "json",
                            async: false,
                            success: function (data) {
                                dialogShow(data.rspMsg) ;
                                if (data.rspCode=="000309") {
                                    tab_search();
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    return oTableInit;
};

function tab_search() {
    $("#role_table").bootstrapTable('refresh');
}


$('#addRoleModel').on('hidden.bs.modal', function () {
    //重置输入框
    $("#roleName").val('');
    //validatorModel重置
    $("#addRoleModel").data('bootstrapValidator').destroy();
    $('#addRoleModel').data('bootstrapValidator',null);
    formValidator();
    //是否选中重置
    $("#addTreeCheckAll").removeAttr("checked");
    //ztree重置
    var zTree = $.fn.zTree.getZTreeObj("roleTree");
    zTree.checkAllNodes(false);
});

$('#updateRoleModel').on('hidden.bs.modal', function () {
    //ztree重置
    uptree.expandAll (false);
    var zTreeObj = $.fn.zTree.getZTreeObj("updateRoleTree");
    zTreeObj.checkAllNodes(false);
    //zTreeObj.refresh();
    //是否选中重置
    $("#updateTreeCheckAll").removeAttr("checked");
});

function validatorModel(modelName){
    var bootstrapValidator = $("#"+modelName).data('bootstrapValidator');
    bootstrapValidator.validate();
    if(bootstrapValidator.isValid()){
        return true;
    }
    return false;
}

function formValidator(){
    $("#addRoleModel").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            //普通字段不为空校验
            roleName: {
                validators: {
                    notEmpty: {
                        message: '角色名称不能为空'
                    },
                    remote: {
                        url: ctx+"/auth/personnel/roleManagement/checkDiff",
                        message: '已存在该角色名称',
                        delay :  4000,
                        type: 'get'//请求方式
                    }
                }
            }
        }
    });
}
