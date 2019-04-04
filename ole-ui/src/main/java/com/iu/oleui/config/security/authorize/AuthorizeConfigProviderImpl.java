package com.iu.oleui.config.security.authorize;

import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.stereotype.Component;


/**
 * 
 * @ClassName: AuthorizeConfigProviderImpl
 * @Description:安全配置 --> 身份验证
 * @author: ruiwu
 * @date: 2018年6月27日 下午5:59:46
 *
 */
@Component
@Order(Integer.MAX_VALUE)
public class AuthorizeConfigProviderImpl implements AuthorizeConfigProvider {
	
	@Override
	public void config(ExpressionUrlAuthorizationConfigurer<HttpSecurity>.ExpressionInterceptUrlRegistry config) {
		// 那些接口需要那些权限才能访问
		// config.antMatchers("/person/*").access("hasRole('ADMIN') or hasRole('USER')")
		// .antMatchers("/person/{id}").access("@rbacService.checkUserId(authentication,#id)")
		// .anyRequest()
		// .access("@rbacService.hasPermission(request,authentication)");
		// config.antMatchers("/perons").access("hasRole('ADMIN')").anyRequest().authenticated();
		// 所有请求需要身份认证
		config
		//.antMatchers("/demo/auth/task/*").access("hasRole('ROLE_ADMIN')")
				/* .antMatchers("/demo/auth/thirdlib/{path}").access("@rbacService.hasPermissionThirdlib(request,authentication)")
			*/	 .anyRequest().authenticated();
		// 添加一个过滤器 所有访问 /login 的请求交给 JWTLoginFilter 来处理 这个类处理所有的JWT相关内容
		// .addFilterBefore(new JWTLoginFilter(null),UsernamePasswordAuthenticationFilter.class)
	}

}
