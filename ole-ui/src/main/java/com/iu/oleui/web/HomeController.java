package com.iu.oleui.web;

import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * @ClassName HomeController
 * @Author ruiwu
 * @Description TODO 跳转页面集成类
 * @Date 20:15 2019\3\7 0007
 * @Version 1.0
 */
@Controller
@RequestMapping("/")
public class HomeController {

	@RequestMapping(value="/", method= RequestMethod.GET)
	public ModelAndView toIndex() {
		return new ModelAndView("login");
	}
	@RequestMapping(value="/index", method= RequestMethod.GET)
	public ModelAndView index() {
		return new ModelAndView("login");
	}

	@RequestMapping(value="/login", method= RequestMethod.GET)
	public ModelAndView login() {
		return new ModelAndView("login");
	}

	@RequestMapping(value="/loginOut", method= RequestMethod.POST)
	public ModelAndView loginOut() {
		return new ModelAndView("logout");
	}

}
