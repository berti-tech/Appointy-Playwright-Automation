
require('dotenv').config();
let email = process.env.EMAIL; 
let password = process.env.PASSWORD; 

async function login_appointyX(email, password)
{
    const url = "https://admin.appointy.com/account/login" 
    const mySpaceURL = "https://admin.appointy.com/my-space"
    let lgnPgObj = new LoginPageObject(page);

    await page.goto(url)
    console.log(await page.title())

    await lgnPgObj.email_locator.fill(email);
    await lgnPgObj.password_locator.fill(password);
    await lgnPgObj.btn_locator.click();
    
    await page.waitForURL(mySpaceURL);
}

