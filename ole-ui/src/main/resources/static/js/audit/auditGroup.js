
var applyStatus = '0';
$(function(){
	    var oTable = new TableInit();
	    oTable.Init();
})
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#auditGroupList').bootstrapTable({
        	contentType : "application/x-www-form-urlencoded",
            dataType:"json",
            url: ctx + '/backGroup/findAuditGroup',         //请求后台的URL（*）
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
            height:650,
            columns: [
			{
				title : '序号',//标题  可不加  
				formatter : function(value, row, index) {
					 var pageSize=$("#auditGroupList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
	                	 var pageNumber=$("#auditGroupList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
	                     return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
				},
				width : '5%',
			},            
            {
                field: 'userName',
                title: '申请人',
                align: 'center',
		        valign: 'middle',
            },
            {
            	field:'workUnit',
                title: '工作单位',
                align: 'center',
		        valign: 'middle',
		        /*formatter : function(value, row, index) {
		        	var hospitalName = null;
		        	if(row.workUnit != null){
		        	    $.ajax({
				    		type:'post',
				    		url: ctx + "/auditDoctor/queryWorkUnit",
				    		async:false,
				    		data:{
				    			  'hospitalCode': row.workUnit
				    			  },
				    		dataType:'json',
				    		success:function(data){
				    			if(data.length > 0){
				    				hospitalName = data[0].hospitalName;
				    			}
				    		}
				    	})
		        	}
				   return hospitalName;
				},*/
            },
            {
            	field: 'telnum',
                title: '手机号',
                align: 'center',
		        valign: 'middle',
            },
            {
                field: 'groupName',
                title: '申请团队',
                align: 'center',
		        valign: 'middle',
            },
            {
                field: 'createDate',
                title: '申请时间',
                align: 'center',
		        valign: 'middle',
		        formatter : function(value, row, index) {
                     return value.substring(0,19);
				},
            },
            {
                field: 'applyStatus',
                title: '状态',
                align: 'center',
		        valign: 'middle',
		        formatter : function(value, row, index) {
		        	if(row.applyStatus == '1'){
		        		return "审核通过";
		        	}else{
		        		return "<span style='color:red'>拒绝通过</span>";
		        	}
				},
				visible: false
            },
            {
				field : 'Button',
				title : '操作',
				events : operateEvents,//给按钮注册事件
				formatter : AddFunctionAlty ,//表格中增加按钮
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
	            userName : $("#createUser").val(),
	            groupName: $("#groupName").val(),
	            groupType: $("#groupType").val(),
	            applyStatus: applyStatus
	        };
	        page = (params.offset / params.limit) + 1;
	        return temp;
	    };
	    return oTableInit;
};

function AddFunctionAlty(value, row, index) {//把需要创建的按钮封装在函数中
	if(row.applyStatus == '0'){
		return [
				'<button id="001" type="button" class="btn btn-primary">审核</button>',
			].join('');
	}else{
		return [
			'<button id="002" type="button" class="btn btn-primary">查看详情</button>',
			].join('');
	}
}

var apply = null;
window.operateEvents = {
	"click #001" : function(e, value, row, index) {
		$("#audit").modal("show");
		showValue(row);
		apply = row;
		$("#formBtn").show();
	},
	"click #002" : function(e, value, row, index) {
		$("#audit").modal("show");
		$("#formBtn").hide();
		showValue(row);
	},
}
function showValue(row){
	$("#userName").val(row.userName);
	$("#telnum").val(row.telnum);
	$("#applyReason").val(row.applyReason);
	$("#workUnit").val(row.workUnit);
	/*$.ajax({
		type:'post',
		url: ctx + "/auditDoctor/queryWorkUnit",
		async:false,
		data:{
			  'hospitalCode': row.workUnit
			  },
		dataType:'json',
		success:function(data){
			$("#workUnit").val(data[0].hospitalName);
		}
	})*/
}

function switchTab(type){
	if(type == '0'){
		$("#auditGroupList").bootstrapTable('hideColumn', "applyStatus");//隐藏某列
		applyStatus = '0';
		$("#status").hide();
		refresh();
	}else{
		$("#auditGroupList").bootstrapTable('showColumn', "applyStatus");//隐藏某列
		applyStatus = '';
		$("#status").show();
		refresh();
	}
}

function query(){
	$("#auditGroupList").bootstrapTable('refresh');
}

function refresh(){
	$("#createUser").val("");
	$("#applyStatus").val("");
	$("#groupType").val("");
	$("#groupName").val("");
	$("#auditGroupList").bootstrapTable('refresh');
}

function changeStatus(){
	applyStatus = $("#applyStatus").val();
}

//同意加入团队
function agreeCreate(){
	console.log(apply);
	BootstrapDialog.confirm({
        title: '',
        message: '确定要审核通过吗？',
        type: BootstrapDialog.TYPE_WARNING,
        closable: true,
        draggable: true,
        btnCancelLabel: '取消',
        btnOKLabel: '确定', // <-- Default value is 'OK',
        btnOKClass: 'btn-warning',
        callback: function (result) {
            if (result) {
          	  $.ajax({
                    type: "POST",
                    url: ctx + "/backGroup/agreeCreate",
                    data: { 
                  	  id : apply.id,
                  	  applyStatus: "1",
                  	  createUser : apply.createUser,
                  	  groupName : apply.groupName,
                  	  token : apply.createUser,
                  	  userName : apply.userName,
                  	  telnum : apply.telnum
                    },
                    dataType: "json",
                    success: function (data) {
                      $("#audit").modal('hide');
                  	  var message = null;
                        if (data.result) {
                        	 var dlg = BootstrapDialog.show({
                        		message: '审核通过'
      	          		 	});
                        	 setTimeout(function(){
                        		 dlg.close();
                        		 refresh();
                        	 },1000);
                        }else {
                        	dialogShow('审核失败') ;
                        }
                    },
                    error : function(data){
                    	dialogShow('系统出错！') ;
                    }
                });
            }
        }
	  });
}

function showModal(){
	$("#audit").modal('hide');
	$("#refuseCreate").modal('show');
}

//拒绝加入团队
function refuseCreate(){
	console.log(apply);
	var refuseReason = $("#refuseReason").val();
	$.ajax({
		url : ctx + "/backGroup/refuseCreate",
		type : "post",
		data : {
			id : apply.id,
			applyStatus : "2",
			refuseReason : $.trim(refuseReason),
			createUser : apply.createUser,
        	groupName : apply.groupName,
        	token : apply.createUser,
        	userName : apply.userName,
        	telnum : apply.telnum
		},
		dataType : "json",
		async : false,
		success : function(data) {
			$("#reject").modal('hide');
			$("#audit").modal('hide');
			if (data.result) {
				dialogShow('已拒绝通过') ;
			} else {
				dialogShow('拒绝失败') ;
			}
			refresh();
		},
		error : function(data){
			dialogShow('系统出错！') ;
        }
	});
}

function reject(){
	$("#audit").modal("hide");
	$("#reject").modal("show");
}

function cancel(){
	$("#reject").modal('hide');
	$("#audit").modal('show');
}
