package com.iu.oleui.common.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @ClassName BaseController
 * @Author ruiwu
 * @Description TODO
 * @Date 20:13 2019\3\7 0007
 * @Version 1.0
 */
public class BaseController {
	protected Logger logger =  LoggerFactory.getLogger(this.getClass());

	protected Response result(ExceptionMsg msg){
		return new Response(msg);
	}
	protected Response result(){
		return new Response();
	}
}
