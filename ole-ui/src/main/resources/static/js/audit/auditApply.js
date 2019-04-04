
var auditStatus = '1';
$(function(){
	queryHospital(0);
    var oTable = new TableInit();
    oTable.Init();
})
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#auditList').bootstrapTable({
        	contentType : "application/x-www-form-urlencoded",
            dataType:"json",
            url: ctx + '/auditDoctor/findAuditApply',         //请求后台的URL（*）
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
				align: 'center',
		        valign: 'middle',
				formatter : function(value, row, index) {
					 var pageSize=$("#auditList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
	                	 var pageNumber=$("#auditList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
	                     return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
				},
				width : '5%',
			},            
            {
                field: 'userLogin',
                title: '用户名',
                align: 'center',
		        valign: 'middle',
            },
            {
                field: 'userName',
                title: '医生姓名',
                align: 'center',
		        valign: 'middle',
            },
            {
            	field: 'hospitalName',
                title: '工作单位',
                align: 'center',
		        valign: 'middle',
		        /*formatter : function(value, row, index) {
		        	var hospitalName = null;
		        	 $.ajax({
				    		type:'post',
				    		url: ctx + "/auditDoctor/queryWorkUnit",
				    		async:false,
				    		data:{
				    			  'hospitalCode': row.workUnit
				    			  },
				    		dataType:'json',
				    		success:function(data){
				    			hospitalName = data[0].hospitalName;
				    		}
				    	})
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
                field: 'createDate',
                title: '申请时间',
                align: 'center',
		        valign: 'middle',
		        formatter : function(value, row, index) {
                     return value.substring(0,19);
				},
            },
            {
                field: 'auditStatus',
                title: '状态',
                align: 'center',
		        valign: 'middle',
		        formatter : function(value, row, index) {
		        	if(row.auditStatus == '2'){
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
				align: 'center',
		        valign: 'middle',
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
	            userName : $("#userName").val(),
	            workUnit: $("#workUnit").val(),
	            telnum: $("#telnum").val(),
	            auditStatus: auditStatus
	        };
	        page = (params.offset / params.limit) + 1;
	        return temp;
	    };
	    return oTableInit;
};

function AddFunctionAlty(value, row, index) {//把需要创建的按钮封装在函数中
	if(row.auditStatus == '1'){
		return [
				'<button id="001" type="button" class="btn btn-primary">审核</button>',
			].join('');
	}else if(row.auditStatus == '2'){
		return [
			'<button id="002" type="button" class="btn btn-primary">查看详情</button>&nbsp&nbsp'
			+'<button id="003" type="button" class="btn btn-default">修改</button>',
			
			].join('');
	}else{
		return [
			'<button id="002" type="button" class="btn btn-primary">查看详情</button>&nbsp&nbsp'
			+'<button id="003" type="button" class="btn btn-default" disabled="disabled">修改</button>',
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
		apply = row;
		showValue(row);
	},
	"click #003" : function(e, value, row, index) {
		apply = row;
		$("#alter").modal("show");
		queryHospital(1);

	},
}
function showValue(row){
	$("#userName1").val(row.userName);
	$("#telnum1").val(row.telnum);
	if(row.idcardFront != null){
		$("#idcardFront").attr("src",picUrl + row.idcardFront);
	}
	if(row.idcardBack != null){
		$("#idcardBack").attr("src", picUrl + row.idcardBack);
	}
	if(row.doctorLicence != null){
		$("#doctorLicence").attr("src",picUrl + row.doctorLicence);
	}
	$("#workUnit2").val(row.hospitalName);
//	$("#idcardFront").attr("src", picUrl + row.idcardFront);
//	$("#idcardBack").attr("src", picUrl + row.idcardBack);
//	$("#doctorLicence").attr("src",picUrl + row.doctorLicence);
	/*$.ajax({
		type:'post',
		url: ctx + "/auditDoctor/queryWorkUnit",
		async:false,
		data:{
			  'hospitalCode': row.workUnit
			  },
		dataType:'json',
		success:function(data){
			$("#workUnit2").val(data[0].hospitalName);
		}
	})*/
}

function switchTab(type){
	if(type == '0'){
		$("#auditList").bootstrapTable('hideColumn', "auditStatus");//隐藏某列
		auditStatus = '1';
		$("#status").hide();
		refresh();
	}else{
		$("#auditList").bootstrapTable('showColumn', "auditStatus");//隐藏某列
		auditStatus = '';
		$("#status").show();
		refresh();
	}
}

function query(){
	$("#auditList").bootstrapTable('refresh');
}

function refresh(){
	$("#userName").val("");
	$("#workUnit").val(null).trigger("change");
	$("#telnum").val("");
	$("#auditStatus").val("");
	$("#auditList").bootstrapTable('refresh');
}

function changeStatus(){
	auditStatus = $("#auditStatus").val();
}

//同意加入团队
function agreeCreate(){
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
                    url: ctx + "/auditDoctor/agreeCreate",
                    data: { 
                  	  id : apply.id,
                  	  auditStatus: "2",
                  	  createUser : apply.createUser,
                  	  applyType : "1",
                  	  token : apply.id,
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
      	             		var dlg = BootstrapDialog.show({
      	            		    message: '审核失败'
      	            		});
      	            		setTimeout(function(){
      	            		    dlg.close();
      	            		},1000);
                        }
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
        }
	  });
}

function showModal(){
	$("#audit").modal('hide');
	$("#refuseCreate").modal('show');
}

//拒绝加入团队
function refuseCreate(){
	var refuseReason = $("#refuseReason").val();
	$.ajax({
		url : ctx + "/auditDoctor/refuseCreate",
		type : "post",
		data : {
			id : apply.id,
			auditStatus : "3",
			refuseReason : $.trim(refuseReason),
			createUser : apply.createUser,
        	applyType : "1",
        	token : apply.id,
        	userName : apply.userName,
        	telnum : apply.telnum
		},
		dataType : "json",
		async : false,
		success : function(data) {
			$("#reject").modal('hide');
			$("#audit").modal('hide');
			if (data.result) {
				dialogShow("已拒绝通过") ;
			} else {
				dialogShow("拒绝失败") ;
			}
			refresh();
		},
		error : function(data){
			dialogShow('系统出错！') ;
        }
	});
}


function alterWorkUnit(){
	var workUnit = $("#workUnit1").val();
	if(workUnit == "" || workUnit == null){
		dialogShow('工作单位不能为空');
		return;
	}
	$.ajax({
		url : ctx + "/auditDoctor/updateWorkUnit",
		type : "post",
		data : {
			workUnit : workUnit,
			userLogin : apply.createUser,
			token : apply.createUser
		},
		dataType : "json",
		async : false,
		success : function(data) {
			$("#alter").modal('hide');
			if (data.result) {
				dialogShow('修改成功') ;
			} else {
				dialogShow('修改失败') ;
			}
			refresh();
		},
		error : function(data){
			dialogShow('系统出错！') ;
        }
	});
}

//初始化上传单位
function queryHospital(type){
	var workUnit = null;
	var d = {};
	var f = [];
	if(type == 0){
		workUnit = $("#workUnit");
	}else{
		workUnit = $("#workUnit1");
		d[0] = apply.workUnit;
		$.ajax({
			type:'post',
			url: ctx + "/auditDoctor/queryWorkUnit",
			async:false,
			data:{
				'hospitalCode': apply.workUnit
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

function showpimg(type){
	if(type == '1'){
		$("#pimgTitle").text("身份证正面");
		$("#pimgSrc").attr("src",picUrl + apply.idcardFront );
	}else if(type == '2'){
		$("#pimgTitle").text("身份证反面");
		$("#pimgSrc").attr("src",picUrl + apply.idcardBack );
	}else{
		$("#pimgTitle").text("医师资格证");
		$("#pimgSrc").attr("src",picUrl + apply.doctorLicence);
	}
	$("#pimg").modal("show");
}

function reject(){
	$("#audit").modal("hide");
	$("#reject").modal("show");
}

function cancel(){
	$("#refuseReason").val("");
	$("#reject").modal('hide');
	$("#audit").modal('show');
}


