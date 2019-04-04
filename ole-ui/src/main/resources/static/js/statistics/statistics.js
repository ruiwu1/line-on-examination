
$(function(){
	getNations('1','province',$("#province"));
	
	locationConsultChangedata();
	
	changeByDate();
	
	showProvince()
})


function query(){
	
	var province=$('#province').val();
	var city=$('#city').val();
	var county=$('#county').val();
	var dateTimeRange=$('#dateTimeRange').val()
	
	
	//查询加载远程会诊总量
	locationConsultChangedata(province,city,county,dateTimeRange);
	
	//查询加载医院会诊量
	loadHospitalDiagnosis(province,city,county,dateTimeRange);
	
	//查询加载团队会诊量
	loadGroupDiagnosis(province,city,county,dateTimeRange);
	
	
	initCount(province,city,county,dateTimeRange);
}



//远程会诊总量统计
function locationConsultChangedata(province,city,county,dateTimeRange){
	
	var timeSpan=$("input[name='timeIntervalRadio']:checked").val();
	
	
	var xtime=[];
	var ycount=[];
	var xAxisInterval = 1;
	$.ajax({
		type:'post',
		async : false, 
		 url : ctx+'/statistics/queryDiagnosis',
		 data:{
			 'province':province,
			 'city':city,
			 'county':county,
			 'dateTimeRange':dateTimeRange,
			 'timeInterval':timeSpan
		 },
		dataType:'json',
		success:function(data){
			for(var i=0;i<data.length;i++){
				
				xtime.push(data[i].xtime);
				ycount.push(data[i].ycount);
			}
			
			if (xtime != null && xtime.length > 0) {
				if (xtime.length > 30) {
					xAxisInterval = parseInt(xtime.length / 8);
				} else if (10 < xtime.length < 30) {
					xAxisInterval = parseInt(xtime.length / 6);
				} else if (5 < xtime.length < 10) {
					xAxisInterval = 2;
				}
			}
			
		}
		
	})
	
	
	var bbusinessChangeChart = echarts.init(document
			.getElementById("line"));
	bbusinessChangeChart.showLoading({
		text : "图表数据正在努力加载..."
	});
	var option = {
		backgroundColor : '#FFFFFF',
		tooltip : {
			trigger : 'axis',
		},
		calculable : true,
		xAxis : [ {
			axisLabel : {
				rotate : 30,
				textStyle : {
					color : '#5d6970'
				},
				interval : xAxisInterval,
			},
			splitLine : {
				show : false
			},
			type : 'category',
			axisLine : {
				lineStyle : {
					color : '#A4ABB9'
				}
			},
			axisTick : {
				show : true
			},
		    data:xtime
		} ],
		yAxis : [ {
			type : 'value',
			axisLabel : {
				textStyle : {
					color : '#5d6970'
				},
				formatter : '{value}'
			},
			axisLine : {
				show : false,
				lineStyle : {
					color : '#A4ABB9'
				}
			}
		} ],
		
	};

	option.series = [ {
		name : '服务量',
		type : 'line',
		smooth:true,
		markPoint : {
			data : [ {
				type : 'max',
				name : '最大值'
			}, {
				type : 'min',
				name : '最小值'
			} ]
		},
		itemStyle : {
			normal : {
				color : '#4C84FF',
				borderWidth : 1,
				lineStyle : {
					color : '#4C84FF'
				}
			}
		},
		symbolSize : 0,
		data :ycount
	} ]
	// 为echarts对象加载数据
	bbusinessChangeChart.setOption(option);
	bbusinessChangeChart.hideLoading();
}

//逐日逐月逐年按钮点击事件
function changeByDate(){
	

	 $(":radio").click(function(){
			var province=$('#province').val();
			var city=$('#city').val();
			var county=$('#county').val();
			var dateTimeRange=$('#dateTimeRange').val()
			
		 locationConsultChangedata(province,city,county,dateTimeRange);
		  });
}



//安徽省联网机构统计地图
function showProvince() {
	var mapChart = echarts.init(document.getElementById("mapload"));
    var name = 'anhui';


    $.get(ctx+'/js/anhui/anhui.json', function (geoJson) {


        echarts.registerMap(name, geoJson);

        mapChart.setOption(option = {
            title: {
		        text : '',
		        link : '',
		        subtext : ''
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter:function(params){
	            	if(!params.value)
	            		return params.name+':0';
	            	return params.name+':'+params.value;
	            }
	            },
            
             dataRange:{  
		    	itemWidth:5,
		    	itemGap:2,
	        	min: 0,
	            orient:'horizontal',
	            x:'left',
	            y:'bottom',
	            color:['#3F6985','#EBF0F2'],
	            text: ['高', '低'], // 文本，默认为数值文本
	            calculable: false,
	            show: true,
	        },
            
            series: [
                {
                    type: 'map',
                    mapType: name,
                     selectedMode : 'single',
		            geoIndex : 0,
					aspectScale : 0.75, //长宽比
					roam : true,
					itemStyle: {
	                    normal: {
	                        borderWidth: 1,
	                        borderColor: '#CBD9E2',
	                        color: '#EBF0F2',
	                        areaStyle:{
	                        	color:'#EBF0F2',type:'default'
	                        },
	                        label: {
	                            show: false,
	                            /*formatter:function(params){
	                            	debugger;
	                            	if(!params.value)
	                            		return params;
	                            	return params.name+'\n'+params.value;
	                            },*/
	                            textStyle:{
	                            	color:'black',
	                            	fontSize:12
	                            }
	                        }
	                    },
	                    emphasis: {                 // 也是选中样式
	                        borderWidth: 1,
	                        //borderColor: '#fff',
	                        color: '#4A90E2',
	                        label: {
	                            show: true,
	                            textStyle: {
	                                color: '#101010',
	                                fontSize:12
	                            }
	                        }
	                    }
	                },
	                data:[],
	                
                    // animationDurationUpdate: 1000,
                    // animationEasingUpdate: 'quinticInOut'
                }
            ]
        });
        
          var array;
		$.ajax({
			
	    	url: ctx+'/statistics/queryNetWork',
	        type: 'get',
	        async: false,
	        success: function (data) {
				array=data;
	        }
	    });
		option.series[0].data=getMapShowData(array);
		option.dataRange.max = 10;
		if(array && array.length > 0){
			option.dataRange.max = array[0].count;
		}
		mapChart.setOption(option, true);
    });
    var cityName = '';
    mapChart.on('click', function (params) {
				if(cityName!=params.name){
					cityName = params.name;
					$.ajax({
				    	url: ctx+ "/statistics/queryNetWorkByCity",
				        type: 'post',
				        async: false,
				        data:{'city':cityName},
				        success: function (datas) {
				        	$("#tbody").empty();
				        	var text = '';
				        	for(var i=0;i<datas.length;i++){
				        		text += '<tr><td>'+(i+1)+'</td><td>'+datas[i].city+'</td><td>'+datas[i].count+'</td></tr>';
				        	}
				        	$("#tbody").append(text);
				        }
				    });
					
				}else{
					cityName = '';
					$.ajax({
				    	url: ctx+ "/ylGetData/queryTopNetWork",
				        type: 'post',
				        async: false,
				       // data:{cityName:params.name},
				        success: function (datas) {
				        	$("#tbody").empty();
				        	var text = '';
				        	for(var i=0;i<datas.length;i++){
				        		text += '<tr><td>'+(i+1)+'</td><td>'+datas[i].city+'</td><td>'+datas[i].count+'</td></tr>';
				        	}
				        	$("#tbody").append(text);
				        }
				    });
					
				}
		    	
			
		
    });
    
    
    
}

//地图数据填充值
function getMapShowData(mapData){
	var result = [];
    for (var i = 0; i < mapData.length; i++) {
        var resLowObj = new Object();
        resLowObj.name = mapData[i].city;
        resLowObj.value = mapData[i].count;
        result.push(resLowObj);
    }
    return result;
}
		
//医院会诊详情折线图	
function openHospitalDialog(hospitalName,hospitalID){
	$("#myModalLabel").html(hospitalName+"会诊量趋势图")
	
	//0医院会诊量
	loadDetailLine(0,hospitalID)
}


function openGroupDialog(groupName,groupID){
	
	$("#myModalLabel").html(groupName,groupName+"会诊量趋势图")
	
	//1团队会诊量
	loadDetailLine(1,groupID)
	
}


//展示详情
function loadDetailLine(flag,paramID){
	
	var dateTimeRange=$('#dateTimeRange').val();
	
	var data = new Array();
	var dat=[];
	
	
	
	var xtime=[];
	var ycount=[];
	
	if(flag==0){
	
		$.ajax({
        			type:'post',
        			async : false, 
        			 url : ctx+'/statistics/queryDiagnosisDetail',
        			 data:{
        				 'hospitalID':paramID,
        				 'dateTimeRange':dateTimeRange
        				 
        			 },
        			dataType:'json',
        			success:function(data){
        				for(var i=0;i<data.length;i++){
        					xtime.push(data[i].xtime);
        					ycount.push(data[i].ycount);
        				}
        				
        			}
        			
        		})
	}else if(flag==1){
		
		$.ajax({
			type:'post',
			async : false, 
			 url : ctx+'/statistics/queryDiagnosisDetail',
			 data:{
				 'groupID':paramID,
				 'dateTimeRange':dateTimeRange
				 
			 },
			dataType:'json',
			success:function(data){
				for(var i=0;i<data.length;i++){
					xtime.push(data[i].xtime);
					ycount.push(data[i].ycount);
				}
				
			}
			
		})
		
		
		
		
	}		
	
	var myChart = echarts.init(document.getElementById("detailLine"));
	


option = {
color: ['#3398DB'],

tooltip : {
trigger: 'axis',
axisPointer : {            // 坐标轴指示器，坐标轴触发有效
type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
}
},
grid: {
left: '3%',
right: '4%',
bottom: '3%',
containLabel: true
},
xAxis : [
{
type : 'category',
data : xtime,
axisTick: {
    alignWithLabel: true
},
axisLabel :{  //X 轴信息全部显示
		 interval:0   
} 
}
],
yAxis : [
{
type : 'value'
}
],
series : [
{
name:'存储统计',
type:'bar',
barWidth: '60%',
data:ycount,
itemStyle: {
normal: {
label: {
show: true,
position: 'top',
textStyle: {
    color: '#615a5a'
},
formatter:function(params){
    if(params.value==0){
        return '';
    }else
    {
        return params.value;
    }
}
}
}
},
}
]
};
	
myChart.setOption(option);


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
		$("#county").html('<option value="">请选择</option>')
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



//按照时间省市区加载会诊医院统计
function loadHospitalDiagnosis(province,city,county,dateTimeRange){
	
		$.ajax({
			type:'post',
			async : false, 
			 url : ctx+'/statistics/loadHospitalDiagnosis',
			 data:{
				 'province':province,
				 'city':city,
				 'county':county,
				 'dateTimeRange':dateTimeRange
			 },
			dataType:'json',
			success:function(datas){
			
				$("#tbody2").empty();
				var text = '';
				for(var i=0;i<datas.length;i++){
					if(datas[i].address==null||datas[i].address==''){
						text += '<tr><td>'+(i+1)+'</td><td>'+datas[i].hospitalName+'</td><td>'+'无'+'</td>';
					}else{
						text += '<tr><td>'+(i+1)+'</td><td>'+datas[i].hospitalName+'</td><td>'+datas[i].address+'</td>';
					}
					text += '<td><div class="progress progress-striped"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+datas[i].prop+';">';
					text += ' <span class="sr-only" >'+datas[i].prop+'</span> </div>';
					text += '<p >'+datas[i].studyCount+'</p>';
					text +='</div>';
					text +='</td>';
					text +='<td >'+datas[i].prop+'</td>';
					text +='<td><i class="fa fa-line-chart" data-toggle="modal" data-target="#lineee" onclick="javascript:openHospitalDialog(\''+datas[i].hospitalName+'\',\''+datas[i].hospitalID+'\');"></i></td>'
				}
				$("#tbody2").append(text);
				
			}
	})
	
	
	
	
}



//按照时间省市区加载团队会诊统计
function loadGroupDiagnosis(province,city,county,dateTimeRange){
	
	
	$.ajax({
		type:'post',
		async : false, 
		 url : ctx+'/statistics/loadGroupDiagnosis',
		 data:{
			 'province':province,
			 'city':city,
			 'county':county,
			 'dateTimeRange':dateTimeRange
		 },
		dataType:'json',
		success:function(datas){
			
			$("#tbody3").empty();
			var text = '';
			for(var i=0;i<datas.length;i++){
				
				text += '<tr><td>'+(i+1)+'</td><td>'+datas[i].groupName+'</td>';
				
				text += '<td><div class="progress progress-striped"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+datas[i].prop+';">';
				text += ' <span class="sr-only" >'+datas[i].prop+'</span> </div>';
				text += '<p >'+datas[i].applyCount+'</p>';
				text +='</div>';
				text +='</td>';
				text +='<td >'+datas[i].prop+'</td>';
				text +='<td><i class="fa fa-line-chart" data-toggle="modal" data-target="#lineee" onclick="javascript:openGroupDialog(\''+datas[i].groupName+'\',\''+datas[i].groupID+'\');"></i></td>'
			}
			$("#tbody3").append(text);
			
		}
})

	
	
}


//搜索框加载每个列表左上数据
function initCount(province,city,county,dateTimeRange){
	
	$.ajax({
		type:'post',
		async : false, 
		 url : ctx+'/statistics/initCount',
		 data:{
			 'province':province,
			 'city':city,
			 'county':county,
			 'dateTimeRange':dateTimeRange
			 
		 },
		dataType:'json',
		success:function(data){
			$("#diagnosisCount").text(data.diagnosisCount);
			$("#hospitalDia").text(data.diagnosisCount);
			$("#groupDia").text(data.groupDiagnosisCount);
			
		}
		
	})
	
	
}

//地图导出
function exportMapExcel(){
/*	$.ajax({
		url: ctx+ "/statistics/excelMapExport",
		type: 'get',
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function (datas) {
				window.location.href=ctx+"/statistics/ylGetDownload?type=3";  
		}
	});*/
	
	window.location.href=ctx+"/statistics/excelMapExport";  
}
//清空查询框
function clearParam(){
	
	$('#province').val("");
	$('#city').val("");
	$('#county').val("");
	$('#dateTimeRange').val("")
}

//导出医院会诊详情
function exportHospitalDia(){

	var province=$('#province').val();
	var city=$('#city').val();
	var county=$('#county').val();
	var dateTimeRange=$('#dateTimeRange').val()
	
	window.location.href=ctx+"/statistics/exportHospitalDiagnosisExcel?province="+province+"&city="+city+"&county="+county+"&dateTimeRange="+dateTimeRange;  
	
	
}

//导出团队会诊详情
function exportGroupDia(){
	
	var province=$('#province').val();
	var city=$('#city').val();
	var county=$('#county').val();
	var dateTimeRange=$('#dateTimeRange').val()
	
	window.location.href=ctx+"/statistics/exportGroupDiagnosisExcel?province="+province+"&city="+city+"&county="+county+"&dateTimeRange="+dateTimeRange;  
	
}

