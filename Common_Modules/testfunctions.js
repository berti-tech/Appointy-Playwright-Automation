const {LoginPageObject, MySpacePageObject} = require("../pageObjects/pageObjects")


const LoginTest = async function (page,url,email,password){
        
  await page.goto(url);
  const LoginPage = new LoginPageObjects(page);
  await LoginPage.emailBox.fill(email);
  await LoginPage.passwordBox.fill(password);
  await LoginPage.submitButton.click();
};  


const opensetting = async function(page){
  const mySpaceObj = new MySpacePageObjects(page)
  await mySpaceObj.settingButton.click()
}


const userprofile = async function(page){
 await page.getByRole('button', { name: 'Bharat' }).click();
}
module.exports = {LoginTest,opensetting,userprofile};