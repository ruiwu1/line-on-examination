

$(function(){
	initGroup("#consulGroupName");
	innitTable();
	
	initGroup("#m_consulGroupName");
	initGroup2("#g_consulGroupName");
	//initExamPart("#m_examBodyPart");
	//initUploadTime("#g_audiRepTime","#g_beginTime","#g_endTime");
	initUploadUnit("#g_applyHospitalName");
	$("#Modify").on('hidden.bs.modal',function(event){
		clearModiPatientInfo();
	})
	$("#generateReport").on('hidden.bs.modal',function(event){
		clearGenerateReport("#generateReportForm");
		$("#g_consulGroupName").val(null).trigger("change");
		$("#g_applyHospitalName").val(null).trigger("change");
		
	})
	
	/*$('.input').("input propertychange", function() {
		if($(this).val().trim()=='' || $(this).val()==null){
			$(this).css("borderColor","red");
		}else{
			$(this).css("borderColor","");
		}
	})*/
	$('#generateReport').find('.input').blur(function() {
		if($(this).val().trim()=='' || $(this).val()==null){
			//$(this).css("borderColor","red");
		}else{
			$(this).css("border","");
		}
	})
	/*$("#select2-g_consulGroupName-container").blur(function() {
		if($(this).val().trim()=='' || $(this).val()==null){
		}else{
			$(this).css("borderColor","");
		}
	})*/
	
})
//showAlert('warning')

//报告单回退
function reportCallBack(){
	var select = $('#reportTable').bootstrapTable('getSelections')[0];
	var clinicalDataUid = select.clinicalDataUid;
	$.ajax({
		url: ctx + '/consultationReport/reportCallback',
		type: 'post',
		aysnc: false,
		data:{clinicalDataUid: clinicalDataUid},
		success: function(msg){
			if(msg.result){
				showAlert('success',msg.resultdesc);
				$("#fallback").modal("hide");
				query();
			}else{
				showAlert('danger',msg.resultdesc);
			}
		}
	});
}

//生成报告单窗口
function generateReport(){
	var selects = $('#reportTable').bootstrapTable('getSelections');
	if(selects.length<1){
		showAlert('warning','请选择一条数据');
		return;
	}
	var select = selects[0];
	var clinicalDataUid = select.clinicalDataUid;
	$("#generateReport").modal('show');
	echoGenerateReport(clinicalDataUid);
}

//生成报告单
function saveGenerateReport(){
	if(!validateGenerateReport()){
		return;
	}
	$.ajax({
		url:ctx+'/consultationReport/printReport',
		type:'post',
		aysnc:false,
		data: $("#generateReportForm").serialize(),
		success:function(msg){
			showAlert('success','报告单生成成功');
			$("#generateReport").modal('hide');
			query();
		},
		error: function(jqXHR, textStatus, errorMsg){
			showAlert('success','报告单生成失败');
		}
	});
}

//清空报告单
function clearGenerateReport(obj){
	$(obj).find("input[type='text'],textarea,select").val('');
	$(obj).find("input[type='text'],textarea,select").css("borderColor","");
}

//验证报告单信息
function validateGenerateReport(){
	var reportJson = {//'g_applyDocName':'申请医生',
		'g_applyHospitalName':'上传单位',
		'g_firstRepDocName':'报告医生',
		'g_studyUid':'studyUid',
		'g_examBodyPart':'检查部位',
		'g_patientCheckDate':'检查日期',
		'g_examUid':'examUid',
		'g_audiRepDocName':'审核医生', 
		'g_consulGroupName':'会诊团队',
		'g_audiRepTime':'审核时间',
		'g_audiExamFindings':'检查所见',
		'g_audiExamImpression':'检查印象', 
		'g_patientId':'patientId', 
		'g_patientName':'病人姓名', 
		'g_patientSex':'病人性别', 
		'g_patientAge':'病人年龄', 
		'g_modality':'模式',
		'g_reportType':'报告单类型'
	};
	for(var key in reportJson){
		var obj = $("#"+key);
		if(obj.val()=='' || obj.val()==null){
			if(key == 'g_consulGroupName' || key == 'g_applyHospitalName'){
				$("#select2-"+key+"-container").parent().css("border","1px solid #ff0000");
			}else{
				obj.css("border","1px solid #ff0000");
			}
			//obj.css("borderColor","red");
			showAlert('warning',reportJson[key]+'不能为空');
			return false;
		}else{
			obj.css("border","");
		}
	}
	return true;
}
//回显报告单信息
function echoGenerateReport(clinicalDataUid){
	$.ajax({
		type : 'post',
		async : false,
		url : ctx + "/consultationReport/queryByClinicalUid",
		data : {
			clinicalDataUid:clinicalDataUid
		},
		dataType : 'json',
		success : function(data) {
			if(data.length>0){
				var row = data[0];
				$("#g_patientId").val(row.patientId);
				$("#g_patientName").val(row.patientName);
				$("#g_patientSex").val(row.patientSex);
				$("#g_patientAge").val(row.patientAge);
				$("#g_modality").val(row.modality);
				$("#g_examBodyPart").val(row.examBodyPart);
				$("#g_patientCheckDate").val(row.patientCheckDate.substr(0,19));
				$("#g_examUid").val(row.examUID);
				$("#g_audiRepDocId").val(row.audiRepDocId);
				$("#g_audiRepDocName").val(row.audiRepDocName);
				//$("#g_consulGroupName").val(row.consulGroupName);
				$("#g_consulGroupName").val(row.consulGroupId).trigger("change");
				$("#g_audiRepTime").val(row.audiRepTime.substr(0,19));
				$("#g_audiExamFindings").val(row.audiExamFindings);
				$("#g_audiExamImpression").val(row.audiExamImpression);
				$("#g_applyDocName").val(row.applyDocName);
				//$("#g_applyHospitalName").val(row.applyHospitalName);
				$("#g_applyHospitalName").val(row.applyHospitalName).trigger("change");
				$("#g_firstRepDocId").val(row.firstRepDocId);
				$("#g_firstRepDocName").val(row.firstRepDocName);
				$("#g_studyUid").val(row.studyUid);
				$("#g_clinicalDataUid").val(clinicalDataUid);
				$("#g_reportType").val(row.reportType);
				//$("#g_reportType").val(row.);
			}
		}
	})
}


//初始化上传单位
function initUploadUnit(obj) {
	$.ajax({
		type : 'post',
		url : ctx + "/consultationReport/queryAllHospitalName",
		//url : ctx + "/consultationReport/queryUploadUnitList",
		sync : false,
		data : {
		},
		dataType : 'json',
		success : function(data) {
			for (var i = 0; i < data.length; i++) {
				data[i].id = data[i].hospitalName;
				data[i].text = data[i].hospitalName;
			}
			$(obj).select2({
				data : data,
				placeholder : '请选择',
				allowClear : true
			})
			$(obj).val(null).trigger("change");
		}
	})
}


//时间初始化
function initUploadTime(dateTimeRange,beginTime,endTime) {
	// 加载初标时间插件
	$(dateTimeRange)
			.daterangepicker(
					{
						applyClass : 'btn-sm btn-success',
						cancelClass : 'btn-sm btn-default',
						locale : {
							applyLabel : '确认',
							cancelLabel : '取消',
							fromLabel : '起始时间',
							toLabel : '结束时间',
							customRangeLabel : '自定义',
							firstDay : 1
						},
						ranges : {
							// '最近1小时': [moment().subtract('hours',1),
							// moment()],
							'今日' : [ moment().startOf('day'), moment() ],
							'昨日' : [
									moment().subtract('days', 1).startOf('day'),
									moment().subtract('days', 1).endOf('day') ],
							'最近7日' : [ moment().subtract('days', 6), moment() ],
							'最近30日' : [ moment().subtract('days', 29), moment() ],
							'本月' : [ moment().startOf("month"),
									moment().endOf("month") ],
							'上个月' : [
									moment().subtract(1, "month").startOf(
											"month"),
									moment().subtract(1, "month")
											.endOf("month") ]
						},
						opens : 'right', // 日期选择框的弹出位置
						separator : ' 至 ',
						showWeekNumbers : true, // 是否显示第几周
						// timePicker: true,
						// timePickerIncrement : 10, // 时间的增量，单位为分钟
						// timePicker12Hour : false, // 是否使用12小时制来显示时间
						// maxDate : moment(), // 最大时间
						format : 'YYYY-MM-DD'

					}, function(start, end, label) { // 格式化日期显示框
						$(beginTime).val(start.format('YYYY-MM-DD'));
						$(endTime).val(end.format('YYYY-MM-DD'));
					}).next().on('click', function() {
				$(this).prev().focus();
			});
}

//弹出修改病例窗口
function showModify(){
	var selects = $('#reportTable').bootstrapTable('getSelections');
	if(selects.length<1){
		showAlert('warning','请选择一条数据');
		return;
	}
	$("#Modify").modal('show');
	echoModiPatientInfo();
}

//修改报告状态窗口
function showModifyReport(){
	var selects = $('#reportTable').bootstrapTable('getSelections');
	if(selects.length<1){
		showAlert('warning','请选择一条数据');
		return;
	}
	var select = selects[0];
	var optState = select.optState;
	if(optState == '0'){
		showAlert('warning','当前报告无人操作，无法更改');
		return;
	}
	$("#ModifyReport").modal('show');
}

//保存报告状态修改
function saveModifyReport(){
	var select = $('#reportTable').bootstrapTable('getSelections')[0];
	var clinicalDataUid = select.clinicalDataUid;
	$.ajax({
		type : 'post',
		async : false,
		url : ctx + "/consultationReport/updateClinicalInfo",
		data : {
			optState:0,
			clinicalDataUid:clinicalDataUid
		},
		dataType : 'json',
		success : function(data) {
			showAlert('success','修改成功');
		},
		error: function(jqXHR, textStatus, errorMsg){
			showAlert('warning','修改失败');
		}
	})
	$("#ModifyReport").modal('hide');
	query();
}

//保存修改病人信息
function saveModi(){
	var select = $('#reportTable').bootstrapTable('getSelections')[0];
	var clinicalDataUid = select.clinicalDataUid;
	var patientId = $("#m_patientId").val();
	var patientName = $("#m_patientName").val();
	var patientSex = $("#modityForm").find('input:radio[name="sex"]:checked').val();
	if(patientSex == '0'){
		patientSex = '男';
	}else{
		patientSex = '女';
	}
	var patientAge = $("#m_patientAge").val();
	var briefHistory = $("#m_briefHistory").val();
	var consulGroupId = $("#m_consulGroupName").val();
	var consulGroupName = $("#m_consulGroupName option:selected").text();
	var examBodyPart = $("#m_examBodyPart").val();
	$.ajax({
		type : 'post',
		async : false,
		url : ctx + "/consultationReport/updatePatient",
		data : {
			patientId:patientId,
			patientName:patientName,
			patientSex:patientSex,
			patientAge:patientAge,
			briefHistory:briefHistory,
			consulGroupId:consulGroupId,
			consulGroupName:consulGroupName,
			examBodyPart:examBodyPart,
			clinicalDataUid:clinicalDataUid
		},
		dataType : 'json',
		success : function(data) {
			showAlert('success','修改成功');
		},
		error: function(jqXHR, textStatus, errorMsg){
			showAlert('warning','修改失败');
		}
	})
	$("#Modify").modal('hide');
	query();
}

//回显修改病人信息
function echoModiPatientInfo(){
	var select = $('#reportTable').bootstrapTable('getSelections')[0];
	$("#m_patientId").val(select.patientId);
	$("#m_patientName").val(select.patientName);
	if(select.patientSex == '男'){
		$("#m_man").prop('checked',true);
	}else if(select.patientSex == '女'){
		$("#m_woman").prop('checked',true);
	}
	$("#m_patientAge").val(select.patientAge);
	$("#m_briefHistory").val(select.briefHistory);
	$("#m_consulGroupName").val(select.consulGroupId).trigger("change");
	$("#m_examBodyPart").val(select.examBodyPart);
}

//清空修改病人信息
function clearModiPatientInfo(){
	$("#m_patientId").val('');
	$("#m_patientName").val('');
	$("#m_man").prop('checked',true);
	$("#m_patientAge").val('');
	$("#m_briefHistory").val('');
	$("#m_examBodyPart").val('');
	$("#m_consulGroupName").val(null).trigger("change");
}

//警告框
function showAlert(str,content){
	var obj = $(".alert-primary");
	if(str == 'danger'){
		obj = $(".alert-danger");
	}else if(str == 'primary'){
		obj = $(".alert-primary");
	}else if(str == 'warning'){
		obj = $(".alert-warning");
	}
	obj.show();
	obj.find("p").html(content);
	window.setTimeout(function(){
		obj.hide();
	},2000);
}

//查询
function query(){
	$('#reportTable').bootstrapTable('refresh');
}

function initExamPart(obj){
	$.ajax({
		type : 'post',
		async : false,
		url : ctx + "/template/queryExamPartOptions",
		data : {
		},
		dataType : 'json',
		success : function(data) {
			html = '<option value=""></option>';
			for(var i=0;i<data.length;i++){
				html += '<option value="'+data[i].examPart+'">'+data[i].examPart+'</option>';
			}
			$(obj).html(html);
		}
	})
}

//初始化团队
function initGroup(obj) {
	$.ajax({
		type : 'post',
		async : false,
		url : ctx + "/backGroup/findAllGroup",
		data : {
		},
		dataType : 'json',
		success : function(data) {
			//var data = data.rows;
			//var data = [{ 'id': 1, 'text': 'bug','parent':'enhancement' }, { 'id': 2, 'text': 'duplicate' ,'parent':'enhancement'}]
			for (var i = 0; i < data.length; i++) {
				data[i].id = data[i].id;
				data[i].text = data[i].groupName==null ? '' : data[i].groupName
			}
			$(obj).select2({
				data : data,
				placeholder : '请选择',
				//selectOnClose : true,
				closeOnSelect : true,
				allowClear : true
			})
			$(obj).val(null).trigger("change");
		}
	})
}

function initGroup2(obj) {
	$.ajax({
		type : 'post',
		async : false,
		url : ctx + "/backGroup/findAllGroupList",
		data : {
		},
		dataType : 'json',
		success : function(data) {
			
			var data = data.rows;
			for (var i = 0; i < data.length; i++) {
				data[i].id = data[i].groupName;
				data[i].text = data[i].groupName
			}
			$(obj).select2({
				data : data,
				placeholder : '请选择',
				//selectOnClose : true,
				closeOnSelect : true,
				allowClear : true
			})
			$(obj).val(null).trigger("change");
		}
	})
}

function innitTable() {
	$('#reportTable')
			.bootstrapTable(
					{
						url : ctx + '/consultationReport/queryPage', // 请求后台的URL（*）
						method : "post",
						height : $(window).height() - 240,
						width : $(window).width(),
						dataType : "json",
						contentType : "application/x-www-form-urlencoded",
						striped : true,// 隔行变色
						cache : false, // 是否使用缓存
						showColumns : false,// 列
						toobar : '#toolbar',
						pagination : true, // 分页
						sortable : true, // 是否启用排序
						sortOrder : "patientCheckDate DESC",// 排序方式
						singleSelect : true,
						clickToSelect: true,
						search : false, // 显示搜索框
						buttonsAlign : "center", // 按钮对齐方式
						showRefresh : false,// 是否显示刷新按钮
						sidePagination : "server", // 服务端处理分页
						pageNumber : 1,
						pageSize : 10,
						pageList : [ 10, 25, 50, 100 ],
						undefinedText : '',
						uniqueId : "id", // 每一行的唯一标识，一般为主键列
						queryParamsType : '',
						queryParams : queryParams,// 传递参数（*）
						detailView : false,// 行内展开
						onClickRow : function(row, element) {
							if(row.audiRepDocId == '' || row.audiRepDocId == null){
								$("#generateBtn").prop('disabled',true);
								$("#callBackBtn").prop('disabled',true);
							}else{
								$("#generateBtn").prop('disabled',false);
								$("#callBackBtn").prop('disabled',false);
							}
						},
						columns : [{
		                    checkbox: true
		                },
								 {
									title : '序号',// 标题 可不加
									formatter : function(value, row, index) {
										var pageSize=$("#reportTable").bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
				                        var pageNumber=$("#reportTable").bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
				                        return pageSize * (pageNumber - 1) + index + 1;
										//return index + 1;
									},
									width : '5%',
									align : 'center'
								}, {
									field : 'patientId',
									title : '患者编号',
									width : '5%',
									align : 'center'
								}, {
									field : 'patientName',
									title : '姓名',
									width : '5%',
									align : 'center'
								}, {
									field : 'modality',
									title : '检查模式',
									width : '5%',
									align : 'center'
								}, {
									field : 'applyHospitalName',
									title : '上传单位',
									width : '15%',
									align : 'center'
								}, {
									field : 'patientCheckDate',
									title : '上传日期',
									width : '15%',
									align : 'center'
								}, {
									field : 'consulGroupName',
									title : '目标团队',
									width : '20%',
									align : 'center'
								}, {
									field : 'consultStatus',
									title : '会诊状态',
									width : '10%',
									formatter:function(value, row, index){
										if(row.audiRepDocId == '' || row.audiRepDocId == null){
											if(row.firstRepDocId == '' || row.firstRepDocId == null){
												value = '尚未报告';
											}else{
												value = '尚未审核';
											}
										}else{
											value = '已经审核';
										}
										return value;
									}
								}, {
									field : 'optState',
									title : '操作状态',
									width : '10%',
									align : 'center',
									formatter:function(value, row, index){
										if(value == '0'){
											value = '无人操作';
										}else if(value == '1'){
											value = '有人操作';
										}else{
											value = '无人操作';
										}
										return value;
									}
								}, {
									field : 'reportStatus',
									title : '是否生成报告单',
									width : '10%',
									align : 'center',
									formatter:function(value, row, index){
										if(row.reportPdfPath == '' || row.reportPdfPath == null){
											value = '未生成';
										}else{
											value = '已生成';
										}
										return value;
									}
								},
						/*
						 * { field : 'Button', title : '操作', events :
						 * operateEvents,//给按钮注册事件 formatter :
						 * AddFunctionAlty,//表格中增加按钮 },
						 */
						],
						onLoadSuccess : function() {
						},
					});
	// 得到查询的参数
	function queryParams(params) {
		var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			pageSize : params.pageSize, // 页面大小
			pageNum : params.pageNumber, // 页码
			sort : params.sort,
			sortOrder : params.sortOrder,
			patientId : $("#patientId").val(),
			patientName : $("#patientName").val(),
			consulGroupId : $("#consulGroupName").val(),
			consulGroupName : $("#consulGroupName option:checked").text(),
			consultStatus : $("#consultStatus").val(),
			optState : $("#optState").val(),
			reportStatus : $("#reportStatus").val()
		};
		return temp;
	}
	;
}

function change(obj){
	var id = $(obj).attr('id');
	if($(obj).val()==null||$(obj).val()==''){
	}else{
		$("#select2-"+id+"-container").parent().css("border","");
	}
}

