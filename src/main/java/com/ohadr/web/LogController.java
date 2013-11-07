package com.ohadr.web;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
public class LogController
{
    private static final Logger log = Logger.getLogger(LogController.class.getName());

	
	@RequestMapping(value = "/log", method = RequestMethod.POST)	
	protected void log(
			@RequestParam("context") String context,
			@RequestParam("level") String level,
			@RequestParam("message") String message,
			HttpServletRequest request,
			HttpServletResponse response) throws Exception
	{
		System.out.print( "/log, message: " + message );
		log.info( message + " , context: " + context );
		
		response.getWriter().println("got to /log");

	}
	
	@RequestMapping(value = "/testGet")	
	protected void log2(
			HttpServletRequest request,
			HttpServletResponse response) throws Exception
	{
		System.out.print( "testGet" );

	}
	
}
