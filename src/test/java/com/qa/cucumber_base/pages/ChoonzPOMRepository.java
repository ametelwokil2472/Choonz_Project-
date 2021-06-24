package com.qa.cucumber_base.pages;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;

public class ChoonzPOMRepository {
private WebDriver webDriver;
public LandingPage landingPage;
public SignUpPage sinSignUpPage;
public LogInPage logInPage;

public ChoonzPOMRepository (WebDriver webDriver) {
	this.webDriver = webDriver;
	this.webDriver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
	this.webDriver.manage().timeouts().implicitlyWait(3000,TimeUnit.MILLISECONDS);
	this.landingPage = PageFactory.initElements(webDriver, LandingPage.class);
	this.sinSignUpPage = PageFactory.initElements(webDriver, SignUpPage.class);
	this.logInPage = PageFactory.initElements(webDriver, LogInPage.class);
}
}