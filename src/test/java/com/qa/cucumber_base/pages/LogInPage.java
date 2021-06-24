package com.qa.cucumber_base.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class LogInPage {
	public static final String URL = "http://localhost:8082";
    private WebDriver driver;
	

	public LogInPage(WebDriver driver) {
		super();
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}
	
	

	@FindBy(xpath = "//*[@id=\"username\"]")
	private WebElement username;

	@FindBy(xpath = "//*[@id=\"password\"]")
	private WebElement password;

	@FindBy(xpath = "//*[@id=\"submit\"]")
	private WebElement sub;
	
	  
	 
	public void user(String useName) {
		username.sendKeys(useName);
		
	}
	
	public void pass(String passWord) {
		password.sendKeys(passWord);
	}
	
	public void makSubmit() {
		sub.click();
	}
}
