package com.iu.oleui.config.security.service;

import com.iu.oleui.config.security.model.MyUser;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService  implements UserDetailsService{

	//@Autowired
	//private PersonnemManagementMapper personnemManagementMapper;
	
	//@Autowired
	//private RoleManagementService roleManagementService;
	
	/**
	 * 
	 * <p>Title: loadUserByUsername</p>   
	 * <p>Description: 从数据库查询数据</p>   
	 * @param username
	 * @return
	 * @throws UsernameNotFoundException   
	 * @see UserDetailsService#loadUserByUsername(String)
	 */
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		String permissions = "";
		MyUser myUser = new MyUser();
		myUser.setUserLogin(username);
		BCryptPasswordEncoder bEncoder =new BCryptPasswordEncoder();
		//调用用户模块 此处简化
		String password = bEncoder.encode("123456");
		myUser.setAuthorities(AuthorityUtils.commaSeparatedStringToAuthorityList(permissions));
		myUser.setUsername(username);
		myUser.setPassword(password);
		return myUser;
	}
}
