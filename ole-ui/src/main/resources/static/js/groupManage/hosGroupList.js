    $(function(){
    	queryHospital(0);
 	    var oTable = new TableInit();
 	    oTable.Init();
    })
    var flag = -1;
    var TableInit = function () {
	    var oTableInit = new Object();
	    //初始化Table
	    oTableInit.Init = function () {
	        $('#hosGroupList').bootstrapTable({
	        	contentType : "application/x-www-form-urlencoded",
	            dataType:"json",
	            url: ctx + '/backGroup/findHosGroupList',         //请求后台的URL（*）
	            method: 'post',                      //请求方式（*）
	            toolbar: '#toolbar',                //工具按钮用哪个容器
	            striped: true,                      //是否显示行间隔色
	            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            pagination: true,                   //是否显示分页（*）
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
	            clickToSelect: true,                //是否启用点击选中行
	            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
	            cardView: false,                    //是否显示详细视图
	            detailView: false,                   //是否显示父子表
	            height:650,
	            onClickRow : function(row,element){
			    	 flag = element.data('index');
			  	  	 $('.info').removeClass('info');
	              	 $(element).addClass('info');
			    },
	            columns: [
				{
					title : '序号',//标题  可不加  
					align: 'center',
			        valign: 'middle',
					formatter : function(value, row, index) {
						 var pageSize=$("#hosGroupList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
 	                	 var pageNumber=$("#hosGroupList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
 	                     return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
					},
					width : '5%',
				},            
	            {
	                field: 'hospitalId',
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
	                field: 'groupName',
	                title: '团队名称',
	                align: 'center',
			        valign: 'middle',
	            },
	            {
	                field: 'hospitalCode',
	                title: '医疗机构代码',
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
		            groupName : $("#groupName").val(),
		            hospitalCode : $("#hospitalCode").val(),
		        };
		        page = (params.offset / params.limit) + 1;
		        return temp;
		    };
		    return oTableInit;
	};
	
	
	function query(){
		$("#hosGroupList").bootstrapTable('refresh');
	}
	
	function groupList(){
		/*var options = '';
		$.ajax({
			url: ctx + "/backGroup/findAllGroup",
			type: 'POST',
			async: true,
			dataType : "json",
			success : function(data) {
				console.log(data);
				options += '<option value="">请选择</option>';
				for (var i = 0; i < data.length; i++) {
					options += '<option value="' + data[i].id + '">' + data[i].groupName + '</option>';
				}
				$("#groupId").html(options);
			},
			error: function(data){
				var dlg = BootstrapDialog.show({
	      		    message: '系统出错！'
	      		});
	      		setTimeout(function(){
	      		    dlg.close();
	      		},1000);
			}
		});
		*/
		var groupId =  $("#groupId");
		groupId.empty();
		groupId.select2({
			 //data: d,
			 placeholder:'请选择',
			 allowClear:true,
			 language: "zh-CN",
			 ajax: {
				 url: ctx + "/backGroup/findAllGroup",
				 dataType: 'json',
				 delay: 200,
				 data: function (params) {
					 return {
						 groupName : params.term,
					 };
				 },
				 processResults: function (data) {
					 for(var i=0;i<data.length;i++){
						 data[i].id=data[i].id;
						 data[i].text=data[i].groupName;
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
	
	function add(){
		$("#add").modal("show");
		groupList();
		queryHospital(1);
	}
	
	function commit(){
		var hospitalCode1 = $("#hospitalCode1").val();
		var groupId = $("#groupId").val();
		if(hospitalCode1 == "" || hospitalCode1 == null){
			dialogShow("请选择医院");
			return;
		}
		if(groupId == "" || groupId == null){
			dialogShow("请选择团队");
			return;
		}
		
		$.ajax({
			url: ctx + "/backGroup/addHosToGroup",
			type: 'POST',
			data : {
				groupId : groupId,
				hospitalCode : hospitalCode1
			},
			async: true,
			dataType : "json",
			success : function(data) {
				if(data.result){
					$("#add").modal("hide");
					var dlg = BootstrapDialog.show({
		      		    message: data.resultdesc
		      		});
		      		setTimeout(function(){
		      		    dlg.close();
		      		    query();
		      		},1000);
				}else{
					var dlg = BootstrapDialog.show({
		      		    message: data.resultdesc
		      		});
		      		setTimeout(function(){
		      		    dlg.close();
		      		},2000);
				}
			},
			error: function(data){
				var dlg = BootstrapDialog.show({
	      		    message: '系统出错！'
	      		});
	      		setTimeout(function(){
	      		    dlg.close();
	      		},1000);
			}
		});
	}
	
	function deleteLink(){
		if(flag==-1){
			  BootstrapDialog.alert("请选择一条数据！");
			  return;
		  }
		  var selects=$("#hosGroupList").bootstrapTable('getData')[flag];
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
						url: ctx + "/backGroup/deleteHosToGroup",
						type: 'POST',
						data : {
							id : selects.id
						},
						async: true,
						dataType : "json",
						success : function(data) {
							if(data.result){
								var dlg = BootstrapDialog.show({
					      		    message: '删除成功'
					      		});
					      		setTimeout(function(){
					      		    dlg.close();
					      		    query();
					      		},1000);
							}else{
								var dlg = BootstrapDialog.show({
					      		    message: '删除失败'
					      		});
					      		setTimeout(function(){
					      		    dlg.close();
					      		},1000);
							}
						},
						error: function(data){
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

	//初始化上传单位
	function queryHospital(type){
		var hospitalCode = null;
		if(type == 0){
			hospitalCode = $("#hospitalCode");
		}else{
			hospitalCode = $("#hospitalCode1");
		}
		hospitalCode.empty();
		hospitalCode.select2({
			 //data: d,
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