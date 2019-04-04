
var auditStatus = '1';
$(function(){
	queryHospital();
	var oTable = new TableInit();
	oTable.Init();
})
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#doctorList').bootstrapTable({
        	contentType : "application/x-www-form-urlencoded",
            dataType:"json",
            url: ctx + '/expertManage/findDoctorList',         //请求后台的URL（*）
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
					 var pageSize=$("#doctorList").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
	                	 var pageNumber=$("#doctorList").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
	                     return pageSize * (pageNumber - 1) + index + 1;    //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
				},
				width : '5%',
			},            
            {
                field: 'userName',
                title: '医生姓名',
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
            	field: 'telnum',
                title: '手机号',
                align: 'center',
		        valign: 'middle',
            },
            {
                field: 'workUnit',
                title: '工作单位',
                align: 'center',
		        valign: 'middle',
		       /* formatter : function(value, row, index) {
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
				    			console.log(data[0].hospitalName);
				    			hospitalName = data[0].hospitalName;
				    		}
				    	})
				    	return hospitalName;
				},*/
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
	            userName : $("#userName").val(),
	            workUnit: $("#workUnit").val(),
	            telnum: $("#telnum").val()
	        };
	        page = (params.offset / params.limit) + 1;
	        return temp;
	    };
	    return oTableInit;
};

function AddFunctionAlty(value, row, index) {//把需要创建的按钮封装在函数中
	return [
		'<button id="001" type="button" class="btn btn-primary">查看上传签名</button>&nbsp&nbsp'
		+'<button id="002" type="button" class="btn btn-default">重新上传签名</button>',
		].join('');
}

var userLogin = null;
var signImage = null ; 
window.operateEvents = {
	"click #001" : function(e, value, row, index) {
		$("#look").modal("show");
		if(row.signImage != null){
			$("#exSign").attr("src", picUrl + row.signImage);
			signImage = row.signImage;
		}
	},
	"click #002" : function(e, value, row, index) {
		$("#again").modal("show");
		$("#userName1").val(row.userName);
		$(".input-file").val("");
		console.log(row.reSignImage);
		if(row.reSignImage != null){
			$("#preview").attr("src", picUrl + row.reSignImage);
		}
		
		userLogin = row.userLogin;
	}
}

function query(){
	$("#doctorList").bootstrapTable('refresh');
}

function refresh(){
	$("#userName").val("");
	$("#workUnit").val("");
	$("#telnum").val("");
	$("#doctorList").bootstrapTable('refresh');
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



$('.input-file').on('change', function() {
	var file = this.files[0];
	var reads = new FileReader();
	reads.readAsDataURL(file);
    reads.onload = function(e) {
        $("#preview").attr("src", this.result);
        //upload(id,f,pic);
    };
});

function upload() {
	var file = document.getElementById("file").files[0];
	if(file == null){
		dialogShow("请选择一张图片");
	}
    var formData = new FormData();
    formData.append('image', file); //添加图片信息的参数
    formData.append("userLogin",userLogin)
    $.ajax({
        url: ctx+"/expertManage/uploadImg",
        type: 'POST',
        cache: false, //上传文件不需要缓存
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success: function (data) {
        	$("#again").modal("hide");
            if (data.result){
            	var dlg = BootstrapDialog.show({
                    message: "上传成功"
                });
                setTimeout(function(){
                    dlg.close();
                    query();
                },2000);
            }else {
            	dialogShow("上传失败");
            }
        },
        error: function (data) {
        	dialogShow("系统出错！");
        }
    })

}

/*function download(){//$("#exSign")[0].src
	 $.ajax({
	        url: ctx + "/expertManage/downloadImg",
	        type: 'POST',
	        data: {
	        	signImage : signImage
	        },
	        success: function (data) {
	            
	        },
	        error: function (data) {
	        	//dialogShow("系统出错！");
	        }
	    })
}*/

