Feature:  user sign up to Choonz

  Scenario Outline: User create account
    Given the user click on home page logout button
    When the click on signup button
    And  the user insert 'mita' , password 'mita1' and comformation password'mita1'
    And  the user click create account button
    Then the user is in his account page
    
   Scenario: Login successfully 
    Given I visit login
  When I enter "mita" in the user name field
    And I enter "mita1" in the password field
    And I press the login button
  Then I should see the welcome page

