package com.iu.oleui.config.security.authorize;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;

/**
 * 
 * @ClassName:  AuthorizeConfigProvider   
 * @Description: 授权配置提供器，安全模块涉及的url的授权配置
 * @author: ruiwu
 * @date:   2018年6月27日 下午5:59:35   
 *
 */
public interface AuthorizeConfigProvider {

    void config(ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry configurer);
}
