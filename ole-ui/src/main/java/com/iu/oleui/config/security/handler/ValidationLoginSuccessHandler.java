package com.iu.oleui.config.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iu.oleui.common.model.ExceptionMsg;
import com.iu.oleui.common.model.ResponseData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 
 * @ClassName:  ValidationLoginSuccessHandler   
 * @Description:登录成功处理器  
 * @author: ruiwu
 * @date:   2018年6月27日 下午6:31:37   
 *
 */
@Component("validationLoginSuccessHandler")
public class ValidationLoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler{

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SecurityProperties securityProperties;

    /**
     * 登录成功处理器
     * @param request
     * @param response
     * @param authentication
     * @throws ServletException
     * @throws IOException
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
    	logger.info("登录成功");
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString( new ResponseData(ExceptionMsg.SUCCESS, authentication.getName())));
    }
}
