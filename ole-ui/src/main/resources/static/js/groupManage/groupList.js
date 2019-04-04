    $(function(){
 	 	getNations('1','province',$("#province"));
 	    var oTable = new TableInit();
 	    oTable.Init();
 	   var oTable1 = new TableInit1();
	    oTable1.Init();
    })
    //富文本编辑框
    var editor1;
        KindEditor.ready(function(K) {
			editor1 = K.create('textarea[name="groupBrief"]', {
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
    
    
    var TableInit = function () {
	    var oTableInit = new Object();
	    //初始化Table
	    oTableInit.Init = function () {
	        $('#groupList').bootstrapTable({
	        	contentType : "application/x-www-form-urlencoded",
	            dataType:"json",
	            url: ctx + '/backGroup/findGroupList',         //请求后台的URL（*）
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
						 var pageSize=$("#groupList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
 	                	 var pageNumber=$("#groupList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
 	                     return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
					},
					width : '5%',
				},            
	            {
	                field: 'groupName',
	                title: '团队名称',
	                align: 'center',
			        valign: 'middle',
	            },
	            {
	                field: 'userName',
	                title: '团长',
	                align: 'center',
			        valign: 'middle',
	            },
	            {
	                title: '所属地区',
	                align: 'center',
			        valign: 'middle',
	                formatter : function(value, row, index) {
	                	if(row.province == null){
	                		return ''
	                	}else{
		                    return row.province+row.city+row.county
	                	}
					},
	            },
	            {
	                field: 'groupType',
	                title: '团队类型',
	                align: 'center',
			        valign: 'middle',
	            },
	            {
	                field: 'createDate',
	                title: '创建时间',
	                align: 'center',
			        valign: 'middle',
			        formatter : function(value, row, index) {
	                     return value.substring(0,10);
					},
	            },
	            {
	                field: 'memberSum',
	                title: '团队人数',
	                align: 'center',
			        valign: 'middle',
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
		        onLoadSuccess: function (data) {
		        	$("#groupCount").html(data.total)//团队人数
		        },
		        });
		    };
		
		    //得到查询的参数
		    oTableInit.queryParams = function (params) {
		        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		        	pageSize: params.limit,                         //页面大小
		            pageNumber: params.offset,   //页码
		            groupName : $("#groupName").val(),
		            province : $("#province").val(),
					city : $("#city").val(),
					county : $("#county").val(),
					groupType : $("#groupType").val(),
		        };
		        page = (params.offset / params.limit) + 1;
		        return temp;
		    };
		    return oTableInit;
	};
	
	function AddFunctionAlty(value, row, index) {//把需要创建的按钮封装在函数中
		return [
			'<button id="001" type="button" class="btn btn-primary">修改团队信息</button>&nbsp;&nbsp;'
			+'<button id="002" type="button" class="btn btn-default">查看详情</button>',
			].join('');
		
	}

	window.operateEvents = {
		"click #001" : function(e, value, row, index) {
			console.log(row.groupName);
			$("#gName").text(row.groupName);
			$("#updateGroup").modal("show");
			//$("#groupBrief").val("");
			editor1.html("");
			$(".input-file").val("");
			$("#groupImage").attr("src", ctx + "/img/qm.jpg");
			$("#largerImg").attr("src", ctx + "/img/qm.jpg");
			editor1.html(row.groupBrief);
			//$("#groupBrief").text(row.groupBrief);
			$("#groupIdUpdate").val(row.id);
			if(row.groupImage != null){
				$("#groupImage").attr("src", picUrl + row.groupImage);
				$("#largerImg").attr("src", picUrl + row.groupImage);
			}
			
		},
		"click #002" : function(e, value, row, index) {
			$("#groupMember").modal("show");
			$("#groupId").val(row.id);
			$("#userName").val("");
			console.log(row.id);
	 	    $("#groupMemberList").bootstrapTable('refresh');
		},
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
	
	function query(){
		$("#groupList").bootstrapTable('refresh');
	}
	
	var TableInit1 = function () {
	    var oTableInit1 = new Object();
	    //初始化Table
	    oTableInit1.Init = function () {
	        $('#groupMemberList').bootstrapTable({
	        	contentType : "application/x-www-form-urlencoded",
	            dataType:"json",
	            url: ctx + '/backGroup/findGroupMember',         //请求后台的URL（*）
	            method: 'post',                      //请求方式（*）
	            toolbar: '#toolbar',                //工具按钮用哪个容器
	            striped: true,                      //是否显示行间隔色
	            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            pagination: true,                   //是否显示分页（*）
	            sortable: true,                     //是否启用排序
	            sortOrder: "desc",                   //排序方式
	            queryParams: oTableInit1.queryParams,//传递参数（*）
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
						 var pageSize=$("#groupMemberList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
 	                	 var pageNumber=$("#groupMemberList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
 	                     return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
					},
					width : '5%',
				},            
	            {
	                field: 'userName',
	                title: '团队成员',
	                align: 'center',
			        valign: 'middle',
	            },
	            {
	                field: 'groupRoleName',
	                title: '团队权限',
	                align: 'center',
			        valign: 'middle',
	            },
	            {
	            	field: 'workUnit',
	                title: '工作单位',
	                align: 'center',
			        valign: 'middle',
	            },
	            {
	                field: 'telnum',
	                title: '联系电话',
	                align: 'center',
			        valign: 'middle',
	            },
	            {
	                field: 'createDate',
	                title: '入团时间',
	                align: 'center',
			        valign: 'middle',
			        formatter : function(value, row, index) {
	                     return value.substring(0,19);
					},
	            },
	            
	            ],
		        onLoadSuccess: function () {
		        },
		        });
		    };
		
		    //得到查询的参数
		    oTableInit1.queryParams = function (params) {
		        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
		        	pageSize: params.limit,                         //页面大小
		            pageNumber: params.offset,   //页码
		            userName : $("#userName").val(),
		            groupId : $("#groupId").val()
		        };
		        page = (params.offset / params.limit) + 1;
		        return temp;
		    };
		    return oTableInit1;
	};
	
	function queryMember(){
		$("#groupMemberList").bootstrapTable('refresh');
	}
	


	$('.input-file').on('change', function() {
		var file = this.files[0];
		var reads = new FileReader();
		reads.readAsDataURL(file);
	    reads.onload = function(e) {
	        $("#groupImage").attr("src", this.result);
	        $("#largerImg").attr("src", this.result);
	    };
	});

	function updateGroup() {
		var imgsrc = $("#groupImage")[0].src; 
		var imgSubstr = imgsrc.substring(imgsrc.lastIndexOf("/")+1);
		console.log(imgsrc.substring(imgsrc.lastIndexOf("/")+1));
		var file = document.getElementById("file").files[0];
		var groupId = $("#groupIdUpdate").val();
		if(file == null && imgSubstr == "qm.jpg") {
			dialogShow("请选择一张图片");
			return;
		}
		var groupBrief = editor1.html();//富文本内容
		if(groupBrief == null || groupBrief == ''){
			dialogShow("团队简介不能为空");
			return;
		}
	    var formData = new FormData();
	    formData.append('image', file); //添加图片信息的参数
	    formData.append("groupBrief",groupBrief);
	    formData.append("id",groupId);
	    $.ajax({
	        url: ctx+"/backGroup/updateGroup",
	        type: 'POST',
	        cache: false, //上传文件不需要缓存
	        data: formData,
	        processData: false, // 告诉jQuery不要去处理发送的数据
	        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
	        success: function (data) {
	        	$("#updateGroup").modal("hide");
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

	$('#groupImage').on('click', function() {
		$("#larger").modal("show");
	});

	
	function exportExcel(type){
		if(type == '1'){
			$('#form').attr('action', ctx + '/exportExcel/groupDetailExport');  
		}else if(type == '2'){
			$('#form').attr('action',  ctx + '/exportExcel/groupMemberExport');  
		}
		
		$("#groupName1").val($("#groupName").val());
		$("#province1").val($("#province").val());
		$("#city1").val($("#city").val());
        $("#county1").val($("#county").val());
        $("#groupType1").val($("#groupType").val());
        
		$("#form").submit();
	}
	
