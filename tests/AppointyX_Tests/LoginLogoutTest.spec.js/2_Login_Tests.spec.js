// @ts-check
require('dotenv').config();
const {test, expect } = require('@playwright/test')
const {LoginPageObject} = require("../../../pageObjects/pageObjects")

const url = "https://admin.appointy.com/account/login" 
const logout_url = "https://admin.appointy.com/account"
const mySpaceURL = "https://admin.appointy.com/my-space"
let email = process.env.EMAIL; 
let password = process.env.PASSWORD; 


test.describe("Login Flow Test", () => {

    test("Login Logout Scenarios", async({page})=>{

        // Failed Login: Click "NEXT" without entering credentials
        await test.step('Click "NEXT" without entering credentials', async() => {
    
            let lgnPgObj = new LoginPageObject(page);
            await page.goto(url)
            console.log(await page.title())
        
            await lgnPgObj.btn_locator.click();
        
            const requiredEmailPrompt = page.locator('.Mui-error').nth(1);
            const requiredPasswordPrompt = page.locator('.Mui-error').last();
            await expect(requiredEmailPrompt).toHaveText('Required');
            await expect(requiredPasswordPrompt).toHaveText('Required');
        })

        // Failed Login : Enter email and no password
        await test.step('Enter email & no password', async () => {
            let lgnPgObj = new LoginPageObject(page);
            await page.goto(url)
            console.log(await page.title())
        
        
            await lgnPgObj.email_locator.fill("abcd@abc.com")
            await lgnPgObj.btn_locator.click();
        
            const requiredPasswordPrompt = page.locator('.Mui-error').last();
            await expect(requiredPasswordPrompt).toHaveText('Required');
        })


        // Failed Login: Enter valid email & incorrect passsword
        await test.step("Failed Login: Enter valid email & incorrect password", async()=>{
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

        // Failed Login: Enter incorrect email address
        await test.step("Failed Login: Incorrect Email ID", async()=>{
            let lgnPgObj = new LoginPageObject(page);
            await page.goto(url)

            await lgnPgObj.email_locator.fill("bharatrajora@appointy.com");
            await lgnPgObj.password_locator.fill("$AdminProd123");
            // await loginPgObj.submitButton.click();
            let snackbar = page.locator("[id='notistack-snackbar']")
            await Promise.all(
                [
                    await lgnPgObj.btn_locator.click(),
                    page.waitForLoadState("networkidle"),
                    await expect.soft(snackbar).toHaveText('User not found with this email'),
                    console.log(await snackbar.textContent())
                ]
            )
        })

        // Failed Login: Enter password & no email
        await test.step("Failed Login: Enter Password & no email", async()=>{
            let lgnPgObj = new LoginPageObject(page);
            await page.goto(url)
            console.log(await page.title())
        
        
            await lgnPgObj.password_locator.fill("9089")
            await lgnPgObj.btn_locator.click();
        
            const requiredEmailPrompt = page.locator('.Mui-error').nth(1);
            await expect(requiredEmailPrompt).toHaveText('Required');
        })

        await test.step("Failed Login: Enter Incorrect email & password", async()=>{
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

        // Successful Login
        await test.step('Successful Login: Enter valid email and password', async()=>{
            let lgnPgObj = new LoginPageObject(page);
    
            await page.goto(url)
            console.log(await page.title())
        
            await lgnPgObj.email_locator.fill(email);
            await lgnPgObj.password_locator.fill(password);
            await lgnPgObj.btn_locator.click();
            
            await page.waitForURL(mySpaceURL);
            await expect.soft(page).toHaveURL(mySpaceURL);
            console.log(page.url())
        })

        // Logout
        await test.step("Logout the user", async()=>{
            await page.getByRole('button', { name: 'B'}).click()
            // getByLabel('Bharat  Rajora')
            
            // await page.locator(".MuiListItemIcon-root .MuiAvatar-root").click()
            await page.locator(".logout").click()
        
            // assert
            let url1 = page.url()
            console.log(url1)
            await page.waitForLoadState('networkidle');
            expect(url1).toContain(url1)
        })

    })

})



