package com.qa.cucumber_base.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class LandingPage {

	public static final String URL = "http://localhost:8082/";
	private WebDriver driver;

	public LandingPage(WebDriver driver) {
		super();
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}
	
	
   @FindBy(xpath = "//*[@id=\"logarea\"]/a[1]")
    private WebElement signIn;
	
	@FindBy(xpath = "//*[@id=\"logarea\"]/a[2]")
	private WebElement signUp;

	
	
	public void signIn() {
		signIn.click();
		}
	
	public void signUp() {
	
		signUp.click();
	}
	
}
