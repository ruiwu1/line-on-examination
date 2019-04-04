package com.iu.oleui.common.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Response {
	/** 返回信息码*/
	private String rspCode="000000";
	/** 返回信息内容*/
	private String rspMsg="操作成功";
	/** 时间戳*/
	private Long data=System.currentTimeMillis();
	public Response(ExceptionMsg msg){
		this.rspCode=msg.getCode();
		this.rspMsg=msg.getMsg();
	}

	public Response(String rspCode) {
		this.rspCode = rspCode;
		this.rspMsg = "";
	}

	public Response(String rspCode, String rspMsg) {
		this.rspCode = rspCode;
		this.rspMsg = rspMsg;
	}

}
