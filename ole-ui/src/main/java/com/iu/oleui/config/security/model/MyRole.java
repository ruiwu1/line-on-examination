package com.iu.oleui.config.security.model;

import java.io.Serializable;


/**
 * @author Administrator
 * 角色类
 *
 */
public class MyRole implements Serializable  {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 
	 */
	private Integer id;
	private String userid;
	private String roleid;
	private String rolename;
	private String createUser;
	private String createDate;
	private String updateUser;
	private String updateDate;
	
	
	/**
	 * @Title:  getCreateUser <BR>  
	 * @Description: please write your description <BR>  
	 * @return: String <BR>  
	 */
	public String getCreateUser() {
		return createUser;
	}

	/**
	 * @Title:  setCreateUser <BR>  
	 * @Description: please write your description <BR>  
	 * @return: String <BR>  
	 */
	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	/**
	 * @Title:  getCreateDate <BR>  
	 * @Description: please write your description <BR>  
	 * @return: String <BR>  
	 */
	public String getCreateDate() {
		return createDate;
	}

	/**
	 * @Title:  setCreateDate <BR>  
	 * @Description: please write your description <BR>  
	 * @return: String <BR>  
	 */
	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	/**
	 * @Title:  getUpdateUser <BR>  
	 * @Description: please write your description <BR>  
	 * @return: String <BR>  
	 */
	public String getUpdateUser() {
		return updateUser;
	}

	/**
	 * @Title:  setUpdateUser <BR>  
	 * @Description: please write your description <BR>  
	 * @return: String <BR>  
	 */
	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	/**
	 * @Title:  getUpdateDate <BR>  
	 * @Description: please write your description <BR>  
	 * @return: String <BR>  
	 */
	public String getUpdateDate() {
		return updateDate;
	}

	/**
	 * @Title:  setUpdateDate <BR>  
	 * @Description: please write your description <BR>  
	 * @return: String <BR>  
	 */
	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getRoleid() {
		return roleid;
	}

	public void setRoleid(String roleid) {
		this.roleid = roleid;
	}

	public String getRolename() {
		return rolename;
	}

	public void setRolename(String rolename) {
		this.rolename = rolename;
	}

}
