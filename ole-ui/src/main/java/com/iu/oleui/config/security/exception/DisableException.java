package com.iu.oleui.config.security.exception;

import com.iu.oleui.common.model.ExceptionMsg;
import org.springframework.security.core.AuthenticationException;

/**
 * @ClassName DisableException
 * @Author ruiwu
 * @Description TODO 禁用异常
 * @Date 17:28 2019\3\11 0011
 * @Version 1.0
 */
public class DisableException extends AuthenticationException {
	private static final long serialVersionUID = -7525757620869234981L;

	private String code;

	public DisableException(ExceptionMsg extensions) {
		super(extensions.getMsg());
		this.code = extensions.getCode();
	}

	public DisableException(String code, String message) {
		super(message);
		this.code = code;
	}

	public DisableException(String msg) {
		super(msg);
	}
}
