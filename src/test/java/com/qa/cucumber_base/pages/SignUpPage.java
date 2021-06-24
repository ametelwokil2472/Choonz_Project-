package com.qa.cucumber_base.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;




public class SignUpPage {
   
	private WebDriver driver;
	

 
	@FindBy(xpath = "//*[@id=\"username\"]") 
	private WebElement enterUserName;
	
	@FindBy(xpath = "//*[@id=\"password\"]")
	private WebElement enterPassWord;
	
	@FindBy(xpath = "//*[@id=\"confpassword\"]") 
	private WebElement enterComfPassWord;
	
	@FindBy(xpath = "//*[@id=\"submit\"]")
	private WebElement creatAcct;
	
	@FindBy(xpath = "//*[@id=\"logarea\"]/a")
	private WebElement logutbutton;
	

	@FindBy(xpath = "//*[@id=\"logarea\"]/a[1]")
	private WebElement signinbutton;
	
	public void signUp(String userName, String PassWord, String ComfPassWord) {
		enterUserName.sendKeys(userName);
		enterPassWord.sendKeys(PassWord);
		enterComfPassWord.sendKeys(ComfPassWord);
		
	}
	
	public void creatAccout() {
		creatAcct.click();
	}
	@FindBy(xpath = "/html/body/div[1]/h2")
	private WebElement welcomenote;

	public WebElement getwelcomenote() {
		return welcomenote;
	}

	public void clicksingin() {
		signinbutton.click();
	}

	public void clicklogout() {
		logutbutton.click();
	}
	public boolean singupcompleted() {
		if (welcomenote != null) {
			if (welcomenote.getText().equals("Welcome to Choonz")) {
				return true;
			}
		}
		return false;
	}

	
}





