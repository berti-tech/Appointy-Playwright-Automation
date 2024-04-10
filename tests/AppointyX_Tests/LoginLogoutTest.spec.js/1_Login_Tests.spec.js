// @ts-check
require('dotenv').config();
const {test, expect } = require('@playwright/test')
const {LoginPageObject} = require("../../../pageObjects/pageObjects")


const url = "https://admin.appointy.com/account/login" 
const logout_url = "https://admin.appointy.com/account"
const mySpaceURL = "https://admin.appointy.com/my-space"
let email = process.env.EMAIL; 
let password = process.env.PASSWORD; 



test('Click "NEXT" without entering credentials', async({page})=>{
    
    let lgnPgObj = new LoginPageObject(page);
    await page.goto(url)
    console.log(await page.title())


    await lgnPgObj.btn_locator.click();

    const requiredEmailPrompt = page.locator('.Mui-error').nth(1);
    const requiredPasswordPrompt = page.locator('.Mui-error').last();
    await expect(requiredEmailPrompt).toHaveText('Required');
    await expect(requiredPasswordPrompt).toHaveText('Required');
    
    
})

test('Enter invalid email and no password, then click "NEXT"', async({page})=> {

    let lgnPgObj = new LoginPageObject(page);
    await page.goto(url)
    console.log(await page.title())


    await lgnPgObj.email_locator.fill("abcd@abc.com")
    await lgnPgObj.btn_locator.click();

    const requiredPasswordPrompt = page.locator('.Mui-error').last();
    await expect(requiredPasswordPrompt).toHaveText('Required');

})


test('Enter valid email and invalid password, then click "NEXT"', async({page})=> {

    let lgnPgObj = new LoginPageObject(page);
    await page.goto(url)
    console.log(await page.title())


    // Enter valid email
    await lgnPgObj.email_locator.fill(email)
    // Enter invalid password
    await lgnPgObj.password_locator.fill("testPassword")
    await lgnPgObj.btn_locator.click();

    const SnackbarPrompt = page.locator('#notistack-snackbar')
    await expect(SnackbarPrompt).toHaveText('Login failed: Your username and / or password do not match')

})

test('Enter password and no email, then click "NEXT"',async({page})=>{

    let lgnPgObj = new LoginPageObject(page);
    await page.goto(url)
    console.log(await page.title())

  
    await lgnPgObj.password_locator.fill("9089")
    await lgnPgObj.btn_locator.click();

    const requiredEmailPrompt = page.locator('.Mui-error').nth(1);
    await expect(requiredEmailPrompt).toHaveText('Required');



})

test('Enter Incorrect email and password, then click "NEXT"', async({page})=>{

    let lgnPgObj = new LoginPageObject(page);
    await page.goto(url)
    console.log(await page.title())

    // Enter valid email
    await lgnPgObj.email_locator.fill(email)
    // Enter invalid password
    await lgnPgObj.password_locator.fill("testPassword")
    await lgnPgObj.btn_locator.click();

    const IncorrectCredenPrompt = page.locator('#notistack-snackbar')
    await expect(IncorrectCredenPrompt).toHaveText('Login failed: Your username and / or password do not match');

})


test('Enter valid email and password, then click "NEXT"', async ({page})=> {

    let lgnPgObj = new LoginPageObject(page);

    await page.goto(url)
    console.log(await page.title())

    await lgnPgObj.email_locator.fill(email);
    await lgnPgObj.password_locator.fill(password);
    await lgnPgObj.btn_locator.click();
    
    await page.waitForURL(mySpaceURL);

    await test.step('Successful Logout', async()=> {
        
        await page.getByRole('button', { name: 'B'}).click()
        
        // await page.locator(".MuiListItemIcon-root .MuiAvatar-root").click()
        await page.locator(".logout").click()
    
        // assert
        let url1 = page.url()
        console.log(url1)
        await page.waitForLoadState('networkidle');
        expect(url1).toContain(url1)
    })

})


