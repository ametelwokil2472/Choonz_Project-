package com.qa.cucumber_base.step_definitions;

import static org.junit.Assert.assertEquals;

import org.openqa.selenium.WebDriver;

import com.qa.cucumber_base.hooks.Hooks;
import com.qa.cucumber_base.pages.ChoonzPOMRepository;


import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class Choonz_steps {

	private ChoonzPOMRepository pom;
	
	private WebDriver webDriver;
	private boolean accountExpected;
	
	
	
	public Choonz_steps(Hooks hooks) {
		this.webDriver = hooks.getWebDriver();
		this.pom = new ChoonzPOMRepository(webDriver);
		this.accountExpected = true;
	
	}

	@Given("the user click on home page logout button")
	public void the_user_click_on_home_page_logout_button() throws InterruptedException {
	   webDriver.get(pom.landingPage.URL);
	   Thread.sleep(5000);
	  
	}



	@When("the click on signup button")
	public void the_click_on_signup_button() throws InterruptedException {
		  pom.landingPage.signUp();
		   Thread.sleep(5000);
	 
	}

	
	@When("the user insert {string} , password {string} and comformation password{string}")
	public void theUserInsertPasswordAndComformationPasswordHani1(String userName, String PassWord, String ComfPassWord) {
		pom.sinSignUpPage.signUp(userName, PassWord, ComfPassWord);
	}
	

	@When("the user click create account button")
	public void the_user_click_create_account_button() throws InterruptedException {
	   pom.sinSignUpPage.creatAccout();
	   Thread.sleep(5000);
	
	}

	@Then("the user is in his account page")
	public void the_user_is_in_his_account_page() {
	    pom.sinSignUpPage.getwelcomenote();
	    //assertEquals(webDriver, pom);
	}
	
	
	@Given("I visit login")
	public void iVisitLogin() throws InterruptedException {
		 webDriver.get(pom.landingPage.URL);
	    pom.landingPage.signIn();
	    Thread.sleep(5000);
	    
	}


	@When("I enter {string} in the user name field")
	public void iEnterInTheUserNameField(String useName) {
		 pom.logInPage.user(useName);
	    
	}
	
	@When("I enter {string} in the password field")
	public void iEnterInThePasswordField(String passWord) throws InterruptedException {
		 pom.logInPage.pass(passWord);
		 Thread.sleep(5000);
	}

		
	@When("I press the login button")
	public void i_press_the_login_button() throws InterruptedException {
	    pom.logInPage.makSubmit();
	    Thread.sleep(5000);
	}

	@Then("I should see the welcome page")
	public void i_should_see_the_welcome_page() {
		  pom.sinSignUpPage.getwelcomenote();
	   
	}


}
