package com.iu.oleui.common.model;

/**
 * @ClassName BaseModel
 * @Author ruiwu
 * @Description TODO
 * @Date 13:00 2019\3\9 0009
 * @Version 1.0
 */
public class BaseModel {

	private String createDate;
	private String createUser;
	private String updateUser;
	private String updateDate;
	private String remark;

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public String getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
}
