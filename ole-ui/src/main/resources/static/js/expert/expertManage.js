$(function(){
	queryHospital();
	var oTable = new TableInit();
	oTable.Init();
})
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#expertList').bootstrapTable({
        	contentType : "application/x-www-form-urlencoded",
            dataType:"json",
            url: ctx + '/expertManage/findExpertList',         //请求后台的URL（*）
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
					 var pageSize=$("#expertList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
	                	 var pageNumber=$("#expertList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
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
                title: '姓名',
                align: 'center',
		        valign: 'middle',
            },
            {
            	field: 'sex',
                title: '性别',
                align: 'center',
		        valign: 'middle',
		        formatter : function(value, row, index) {
		        	if(row.sex == '0'){
		        		return '女';
		        	}else{
		        		return '男';
		        	}
				},
            },
			{
				field: 'roleName',
				title: '角色',
				align: 'center',
				valign: 'middle',
			},
            {
                field: 'workUnit',
                title: '工作单位',
                align: 'center',
		        valign: 'middle',
		        formatter : function(value, row, index) {
		        	var hospitalName = null;
		        	if (row.roleId == '1'){
                        return "";
					}else {
                        return row.workUnit;
					}
				},
            },
			{
				field: 'telnum',
				title: '手机号',
				align: 'center',
				valign: 'middle',
			},
			{
				field: 'createDate',
				title: '注册时间',
				align: 'center',
				valign: 'middle',
			},
            ],
	        onLoadSuccess: function () {
        		$("#countSpan").text($("#expertList").bootstrapTable('getOptions').totalRows)
	        },
	        });
	    };
	
	    //得到查询的参数
	    oTableInit.queryParams = function (params) {
	        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	        	pageSize: params.limit,                         //页面大小
	            pageNumber: params.offset,   //页码
                userLogin: $("#userLogin").val(),
	            userName : $("#userName").val(),
	            workUnit: $("#workUnit").val(),
	            telnum: $("#telnum").val(),
                beginTime: $("#beginTime").val(),
                endTime: $("#endTime").val(),
	        };
	        page = (params.offset / params.limit) + 1;
	        return temp;
	    };
	    return oTableInit;
};



function query(){
    var dateTimeRange = $("#dateTimeRange").val();
    if (dateTimeRange == null || dateTimeRange == ""){
        $("#beginTime").val("");
        $("#endTime").val("");
    }
	$("#expertList").bootstrapTable('refresh');
}

function refresh(){
	$("#userName").val("");
	$("#workUnit").val("");
	$("#telnum").val("");
	$("#expertList").bootstrapTable('refresh');
}

function queryHospital(){
	var workUnit = $("#workUnit");
	workUnit.empty();
	workUnit.select2({
		 // data: data,
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


