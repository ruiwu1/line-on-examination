package com.iu.oleui.config.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iu.oleui.common.model.Response;
import org.apache.commons.lang.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 
 * @ClassName:  ValidationSuccessHandler   
 * @Description: 退出成功--拦截器
 * @author: ruiwu
 * @date:   2018年6月27日 下午5:00:07   
 *
 */
public class ValidationLogoutSuccessHandler implements LogoutSuccessHandler {

    private String signOutSuccessUrl;

    private ObjectMapper objectMapper = new ObjectMapper();

    public ValidationLogoutSuccessHandler(String signOutSuccessUrl) {
        this.signOutSuccessUrl = signOutSuccessUrl;
    }

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    	//logger.debug("退出成功");
    	
        if (StringUtils.isBlank(signOutSuccessUrl)) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString(new Response()));
        } else {
            response.sendRedirect(signOutSuccessUrl);
        }
    }
}
