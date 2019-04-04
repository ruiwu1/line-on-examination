package com.iu.oleui.config.security;

import com.iu.oleui.config.security.authorize.AuthorizeConfigProvider;
import com.iu.oleui.config.security.properties.SecurityConstants;
import com.iu.oleui.config.security.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private AuthenticationSuccessHandler validationLoginSuccessHandler;

	@Autowired
	private AuthenticationFailureHandler validationAuthenticationfailureHandler;

	@Autowired
	private AuthorizeConfigProvider authorizeConfigProvider;

	@Autowired
	private MyUserDetailsService myUserDetailsService;

	/**
	 *
	 * <p>Title: configure</p>
	 * <p>authorizeRequests()配置路径拦截，表明路径访问所对应的权限，角色，认证信息。
	 formLogin()对应表单认证相关的配置
	 logout()对应了注销相关的配置
	 httpBasic()可以配置basic登录 </p>
	 * @param http
	 * @throws Exception
	 * @see WebSecurityConfigurerAdapter#configure(HttpSecurity)
	 */
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.headers().frameOptions().disable().and()
				// 使用表单登录，不再使用默认httpBasic方式
				.formLogin()
				// 如果请求的URL需要认证则跳转的URL
				.loginPage(SecurityConstants.DEFAULT_UNAUTHENTICATION_URL)
				// 处理表单中自定义的登录URL
				.loginProcessingUrl(SecurityConstants.DEFAULT_SIGN_IN_PROCESSING_URL_FORM)
				//登录成功处理器，返回JSON
				.successHandler(validationLoginSuccessHandler)
				//登录失败处理器
				.failureHandler(validationAuthenticationfailureHandler)
					.and()
				.logout()
					//默认退出地址/logout
					.logoutUrl("/logout")
					//退出之后跳转到注册页面
					.logoutSuccessUrl("/login")
					.and()
				.authorizeRequests()
				.antMatchers(SecurityConstants.DEFAULT_UNAUTHENTICATION_URL,
						SecurityConstants.DEFAULT_SIGN_IN_PROCESSING_URL_FORM,
						"/css/**","/img/**","/fonts/**","/js/**","/common/**","/include/**","/thirdlib/**")
				.permitAll()// 以上的请求都不需要认证
				.and()
				.csrf().disable();// 关闭csrd拦截
		// 安全模块单独配置
		authorizeConfigProvider.config(http.authorizeRequests());
	}

	/**
	 *
	 * <p>Title: configure</p>
	 * <p>Description: 添加 UserDetailsService， 实现自定义登录校验</p>
	 * @param auth
	 * @throws Exception
	 * @see WebSecurityConfigurerAdapter#configure(AuthenticationManagerBuilder)
	 */
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(myUserDetailsService).passwordEncoder(passwordEncoder());
	}

	/**
	 *
	 * @Title: passwordEncoder
	 * @Description: 密码加密
	 * @param: @return
	 * @return: PasswordEncoder
	 * @throws
	 */
	@Bean
	@ConditionalOnMissingBean(PasswordEncoder.class)
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
