package com.iu.oleui.config.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iu.oleui.common.model.ExceptionMsg;
import com.iu.oleui.common.model.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 
 * @ClassName:  validationAuthenticationfailureHandler   
 * @Description:自定义登录失败处理 
 * @author: ruiwu
 * @date:   2018年6月27日 下午4:48:29   
 *
 */
@Component(value = "validationAuthenticationfailureHandler")
public class ValidationAuthenticationfailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    private ObjectMapper objectMapper;


    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
    	logger.info("登录失败");
        response.setContentType("application/json;charset=UTF-8");
        if(exception instanceof BadCredentialsException){
        	logger.info("用户名或密码错误");
            response.getWriter().write(objectMapper.writeValueAsString(new Response(ExceptionMsg.LoginNameOrPassWordError)));
        }else if(exception instanceof DisabledException){
            logger.info("用户被禁用");
            response.getWriter().write(objectMapper.writeValueAsString(new Response(ExceptionMsg.UserDisable.getCode(),exception.getMessage())));
        }else{
            response.getWriter().write(objectMapper.writeValueAsString(new Response(ExceptionMsg.FAILED.getCode(),exception.getMessage())));
        }

    }
}
