    $(function(){
 	    var oTable = new TableInit();
 	    oTable.Init();
    })
    //富文本编辑框
    var editor1;
        KindEditor.ready(function(K) {
			editor1 = K.create('textarea[name="content"]', {
				cssPath : ctx + '/thirdlib/kindeditor/plugins/code/prettify.css',
				uploadJson : ctx + '/kindEditor/upload',
				fileManagerJson : ctx + '/kindEditor/manager',
				allowFileManager : true,
				allowImageUpload : true,
				resizeType : 0,
				afterCreate : function() {
					var self = this;
					K.ctrl(document, 13, function() {
						self.sync();
						//$("#createNews").submit();
					});
					K.ctrl(self.edit.doc, 13, function() {
						self.sync();
						//$("#createNews").submit();
					});
				}
			});
			editor1.sync('editor');
			prettyPrint();
		});
    
      //富文本编辑框
        var editor2;
            KindEditor.ready(function(K) {
    			editor2 = K.create('textarea[name="content1"]', {
    				cssPath : ctx + '/thirdlib/kindeditor/plugins/code/prettify.css',
    				uploadJson : ctx + '/kindEditor/upload',
    				fileManagerJson : ctx + '/kindEditor/manager',
    				allowFileManager : true,
    				allowImageUpload : true,
    				resizeType : 0,
    				afterCreate : function() {
    					var self = this;
    					K.ctrl(document, 13, function() {
    						self.sync();
    						//$("#createNews").submit();
    					});
    					K.ctrl(self.edit.doc, 13, function() {
    						self.sync();
    						//$("#createNews").submit();
    					});
    				}
    			});
    			editor2.sync('editor');
    			prettyPrint();
    		});
    
    var TableInit = function () {
	    var oTableInit = new Object();
	    //初始化Table
	    oTableInit.Init = function () {
	        $('#announceList').bootstrapTable({
	        	contentType : "application/x-www-form-urlencoded",
	            dataType:"json",
	            url: ctx + '/announce/findAnnounceList',         //请求后台的URL（*）
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
						 var pageSize=$("#announceList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
 	                	 var pageNumber=$("#announceList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
 	                     return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
					},
					width : '5%',
				},            
	            {
	                field: 'title',
	                title: '公告标题',
	                align: 'center',
			        valign: 'middle',
	            },
	            {
	                field: 'content',
	                title: '公告内容',
	                align: 'center',
			        valign: 'middle',
			        formatter : function(value, row, index) {
			        	//console.log(row.content.replace(/<[^>]*>|/g,""));
			        	if(row.content.indexOf("img") != -1){
			        		return "公告内容为图片，请点击【查看】按钮，查看公告详情！";
			        	}else{
			        		return row.content.replace(/<[^>]*>|/g,"").substring(0,15)+"...";
			        	}
					},
	            },
	            {
	            	field: 'issueDate',
	                title: '发布时间',
	                align: 'center',
			        valign: 'middle',
	                formatter : function(value, row, index) {
	                	if(value == null){
	                		return ''
	                	}else{
		                    return value.substring(0,19);
	                	}
					},
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
		        onLoadSuccess: function (data) {//表格加载成功
		        },
		        });
		    };
		
		    //得到查询的参数
		    oTableInit.queryParams = function (params) {
		        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		        	pageSize: params.limit,                         //页面大小
		            pageNumber: params.offset,   //页码
		        };
		        page = (params.offset / params.limit) + 1;
		        return temp;
		    };
		    return oTableInit;
	};
	
	function AddFunctionAlty(value, row, index) {//把需要创建的按钮封装在函数中
		var btn = "";
		if(row.isIssue == '1'){
			btn = '<button type="button" class="btn btn-primary" disabled = "disabled">发布</button>&nbsp;&nbsp;'
				+'<button type="button" class="btn btn-primary" disabled = "disabled">修改</button>&nbsp;&nbsp;' ;
		}else{
			btn = '<button id="001" type="button" class="btn btn-primary" >发布</button>&nbsp;&nbsp;'
				+'<button id="002" type="button" class="btn btn-primary">修改</button>&nbsp;&nbsp;';
		}
		btn += '<button id="003" type="button" class="btn btn-default" >查看</button>&nbsp;&nbsp;'
			+'<button id="004" type="button" class="btn btn-default">删除</button>';
		return [btn].join('');
		
	}
	var flag = '';
	var announce = null;
	window.operateEvents = {
		"click #001" : function(e, value, row, index) {
			$("#pText").text("确定要发布吗？");
			$("#confirm").modal("show");
			flag = 1;
			announce = row;
		},
		"click #002" : function(e, value, row, index) {
			$("#update").modal("show");
			announce = row;
			$("#title1").val(row.title);
			editor2.html(row.content);
		},
		"click #003" : function(e, value, row, index) {
			$("#detail").modal("show");
			announce = row;
			$("#detailTitle").text(row.title);
			$("#detailContent").html(row.content);
		},
		"click #004" : function(e, value, row, index) {
			$("#pText").text("确定要删除吗？");
			$("#confirm").modal("show");
			flag = 2;
			announce = row;
		},
	}
	
	
	function addOrUpdate(type) {
		var id = 0;
		var title = null;
		var content = null;//富文本内容
		var url = null;
		var data = {};
		
		if(type=="1"){
			title = $("#title").val();
			content = editor1.html();
			url = ctx + "/announce/addAnnounce";
			data = {
	        	title : title,
	        	content : content
	        }
		}else{
			title = $("#title1").val();
			content = editor2.html();
			url = ctx + "/announce/updateAnnounce";
			data = {
		        	title : title,
		        	content : content,
		        	id : announce.id
		        }
		}
		if(title == null || title == "") {
			dialogShow("公告标题不能为空");
			return;
		}
		if(content == null || content == ''){
			dialogShow("公告内容不能为空");
			return;
		}
	    $.ajax({
	        url: url,
	        type: 'POST',
	        data: data,
	        async: true,
	        dataType: 'json',
	        success: function (data) {
	        	if(type=="1"){
	        		$("#add").modal("hide");
	        	}else{
	        		$("#update").modal("hide");
	        	}
	        	
	            if (data.result){
	            	var dlg = BootstrapDialog.show({
	                    message: data.resultdesc
	                });
	                setTimeout(function(){
	                    dlg.close();
	                    window.location.reload();
	                },2000);
	            }else {
	            	dialogShow(data.resultdesc);
	            }
	        },
	        error: function (data) {
	        	dialogShow("系统出错！");
	        }
	    })

	}

	$('#new').on('click', function() {
		$("#title").val("");
		editor1.html("");
		$("#add").modal("show");
	});
	
	function update(){
		var url = null;
		var data = {};
		if(flag == 1){
			url = ctx + "/announce/issueAnnounce";
			data = {
				id : announce.id,
				isIssue : '1'
			};
		}else if(flag == 2){
			url = ctx + "/announce/delAnnounce";
			data = {
				id : announce.id,
				isValid : '0'
			};
		}
		
		$.ajax({
			url : url,
	        type: 'POST',
	        data: data,
	        async: true,
	        dataType: 'json',
	        success: function (data) {
	        	$("#confirm").modal("hide");
	            if (data.result){
	            	var dlg = BootstrapDialog.show({
	                    message: data.resultdesc
	                });
	                setTimeout(function(){
	                    dlg.close();
	                    window.location.reload();	
	                },2000);
	            }else {
	            	dialogShow(data.resultdesc);
	            }
	        },
	        error: function (data) {
	        	dialogShow("系统出错！");
	        }
	    })
		
		
	}


