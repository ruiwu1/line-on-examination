package com.iu.oleui.common.model;

public enum ExceptionMsg {
	
    CODE_ERROT("103","验证码验证失败"),
    SESSION_INVALID("104","session失效"),

	SUCCESS("000000", "操作成功"),
	FAILED("999999","操作失败"),
    ParamError("000001", "参数错误！"),
    
    LoginNameOrPassWordError("000100", "用户名或者密码错误！"),
    EmailUsed("000101","该邮箱已被注册"),
    UserNameUsed("000102","该登录名称已存在"),
    EmailNotRegister("000103","该邮箱地址未注册"), 
    LinkOutdated("000104","该链接已过期，请重新请求"),
    PassWordError("000105","密码输入错误"),
    UserNameLengthLimit("000106","用户名长度超限"),
    LoginNameNotExists("000107","该用户未注册"),
    UserNameSame("000108","新用户名与原用户名一致"),
	UserDisable("000109","用户被禁用"),
	/**
	 * 角色资源相关
	 */
    NewUserSuccess("000300","保存新用户成功"),
	NewUserFailure("000301","保存新用户失败"),
	UpadatePasswordSuccess("000302","修改密码成功"),
	UpadatePasswordFailure("000303","修改密码失败"),
	UpadateRoleSuccess("000304","修改用户角色成功"),
	UpadateRoleFailure("000305","修改用户角色失败"),
	UpadateRoleMenuSuccess("000306","角色资源添加成功"),
	UpadateRoleMenuFailure("000307","角色资源添加失败"),
	DelRoleMenuFailure("000308","该角色还在使用"),
	DelRoleMenuSuccess("000309","删除角色成功"),
	UpdateUserFailure("000310","更新用户信息失败"),
	UpdateUserSuccess("000311","更新用户信息成功"),
    /**
     * 短信 相关
     */
    SmsTemplateMiss("000200","缺少短信模板变量"),
	SmsBusinessLimit("000201","单日获取次数过多"),
	SmsMobileNumber("000202","手机号码不正确"),
	SmsSignatureIllegal("000203","短信模板不合法"),
	SmsOtherException("000204","发送短信出现未知异常"),

    ;
   private ExceptionMsg(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }
    private String code;
    private String msg;
    
	public String getCode() {
		return code;
	}
	public String getMsg() {
		return msg;
	}

    
}

