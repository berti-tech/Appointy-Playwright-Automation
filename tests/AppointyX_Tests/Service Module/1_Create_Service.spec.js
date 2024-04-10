require('dotenv').config();
const {test, expect } = require('@playwright/test')
const {LoginPageObject, ServiceObject} = require("../../../pageObjects/pageObjects").default

const url = "https://admin.appointy.com/account/login" 
const mySpaceURL = "https://admin.appointy.com/my-space"
const srvURL = "https://admin.appointy.com/settings/appointment-settings/services"
let email = process.env.EMAIL; 
let password = process.env.PASSWORD; 

/*

Test Cases Covered :

1. Click directly to "NEXT" Button without entering title and duration of service
2. Create a multidurational service of same duration
3. Character Limit of service name exceeds 250 character
4. Create a one-one service successfully
5. Create a service Title with the same name
6. Create a multidurational service with any of the options : In-Location, In-Customers
*/




test('Character Limit of Service Name Exceeds 250 characters', async({page})=>{

})

test('Create a multidurational service of same duration', async({page})=>{
    let srvObj = new ServiceObject(page);
    let lgnPgObj = new LoginPageObject(page);

    await page.goto(url)
    await lgnPgObj.email_locator.fill(email);
    await lgnPgObj.password_locator.fill(password);
    await lgnPgObj.btn_locator.click();

    await page.waitForURL(mySpaceURL);
    await srvObj.settingBtn.click();
    await srvObj.serviceBtn.click();
    await srvObj.addNewServiceBtn.click();
    await srvObj.createNewService.click();
    await srvObj.oneToOneSrvBtn.click();
    await srvObj.inLocationBtn.click();

    await srvObj.srvTitleTextBox.fill("Playwright - Test Multidurational Service");
    
    // Set Duration
    await srvObj.srvDuratnBox.fill("120");
    
    // Set Price
    await srvObj.setPriceBtn.click();
    await srvObj.priceTextBox.fill("4000");

    // Click on Add Button
    await srvObj.addNewDurationBtn.click();

    // Add the same duration as previously entered
    await srvObj.srvDuratnBox.last().fill("120");

    // Click Next Button
    await srvObj.nxtBtn.click();

    await expect(page.getByText('Durations can not be same')).toHaveText('Durations can not be same')


})

test('Click directly to Next Button', async({page})=>{
    
    let srvObj = new ServiceObject(page);
    let lgnPgObj = new LoginPageObject(page);

    await page.goto(url)
    await lgnPgObj.email_locator.fill(email);
    await lgnPgObj.password_locator.fill(password);
    await lgnPgObj.btn_locator.click();

    await page.waitForURL(mySpaceURL);
    await srvObj.settingBtn.click();
    await srvObj.serviceBtn.click();
    await srvObj.addNewServiceBtn.click();
    await srvObj.createNewService.click();
    await srvObj.oneToOneSrvBtn.click();
    await srvObj.inLocationBtn.click();

    // Click Next Button directly
    await srvObj.nxtBtn.click();


    await expect(page.getByText('Required').first()).toHaveText('Required');
    await expect(page.getByText('Required').nth(1)).toHaveText('Required');

})


test.only('Create a one-to-one service successfully', async({page})=>{

    // 1. Click directly to Next Button. Handle the cases
    // 2. Create service with the same name. A error should come. Assert the error.
    // 3. Character limits on title - 250 characters
    // 4. Multidurational service logic


    let srvObj = new ServiceObject(page);
    let lgnPgObj = new LoginPageObject(page);

    await page.goto(url)
    console.log(await page.title())

    await lgnPgObj.email_locator.fill(email);
    await lgnPgObj.password_locator.fill(password);
    await lgnPgObj.btn_locator.click();

    await page.waitForURL(mySpaceURL);

    await srvObj.settingBtn.click();
    await srvObj.serviceBtn.click();
    await srvObj.addNewServiceBtn.click();
    await srvObj.createNewService.click();
    await srvObj.oneToOneSrvBtn.click();
    await srvObj.inLocationBtn.click();
    
    await srvObj.srvTitleTextBox.fill("Playwright - Test Create Service");
    
    // Set Duration
    await srvObj.srvDuratnBox.fill("60");
    
    // Set Price
    await srvObj.setPriceBtn.click();
    await srvObj.priceTextBox.fill("3000");

    // Click Next Button
    await srvObj.nxtBtn.click();

    // Select the staff who will perform this service
    await srvObj.assignToAllBtn.click();

    // Click Next Button
    await srvObj.nxtBtn.click();
    
    
    // await expect(page.locator('[role=row]').nth(-1))
    await expect(page.getByRole('cell', {name: 'Playwright - Test Create Service'}).isVisible()).toBeTruthy()
     
})

test('Create Service Title with the same name', async({page})=>{

    let srvObj = new ServiceObject(page);
    let lgnPgObj = new LoginPageObject(page);

    await page.goto(url)
    console.log(await page.title())

    await lgnPgObj.email_locator.fill(email);
    await lgnPgObj.password_locator.fill(password);
    await lgnPgObj.btn_locator.click();

    await page.waitForURL(mySpaceURL);

    await srvObj.settingBtn.click();
    await srvObj.serviceBtn.click();
    await srvObj.addNewServiceBtn.click();
    await srvObj.createNewService.click();
    await srvObj.oneToOneSrvBtn.click();
    await srvObj.inLocationBtn.click();
    
    await srvObj.srvTitleTextBox.fill("Playwright - Delete Service");
    
    // Set Duration
    await srvObj.srvDuratnBox.fill("120");
    
    // Set Price
    await srvObj.setPriceBtn.click();
    await srvObj.priceTextBox.fill("4000");

    // Click Next Button
    await srvObj.nxtBtn.click();

    await expect(page.getByText('service title already exists in location')).toHaveText('service title already exists in location');
})

