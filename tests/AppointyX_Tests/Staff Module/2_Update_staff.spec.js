// Update Staff from Employee/Staff Section
require('dotenv').config();

const {test, expect } = require('@playwright/test')
const {LoginPageObject, StaffObject} = require("../../../pageObjects/pageObjects")
const { faker } = require('@faker-js/faker');

const url = "https://admin.appointy.com/account/login" 
const mySpaceURL = "https://admin.appointy.com/my-space"
let email = process.env.EMAIL; 
let password = process.env.PASSWORD; 

test("Update Existing Staff", async({page}) => {
    let lgnPgObj = new LoginPageObject(page);
    let staffObj = new StaffObject(page);

    // Login
    await page.goto(url)
    console.log(await page.title())

    await lgnPgObj.email_locator.fill(email);
    await lgnPgObj.password_locator.fill(password);
    await lgnPgObj.btn_locator.click();

    await page.waitForURL(mySpaceURL);

    // Update staff details
    // Fail attempt: employee name field blank
    await test.step("Employee name field blank", async () => {

        await staffObj.settingBtn.click();
        await staffObj.staffButton.click();

        await page.getByRole('cell',{name:'Staff@'}).nth(0).click();
        await staffObj.employeeEditButton.click();
        await staffObj.employeeName.fill('');

        await staffObj.saveButton.click();

        // error message validation
        await expect.soft(staffObj.errorMsgRequired).toBeVisible();
    })

    await test.step("Update Staff Profile Name", async()=>{
        await staffObj.employeeEditButton.click();
        await staffObj.employeeName.fill("Staff@ " + faker.person.firstName() + "(Updated)");
        let updatedName = staffObj
        await staffObj.saveButton.click();

        // Assertions
        await staffObj.employeeEditButton.click();
        await expect.soft(staffObj.employeeName).toHaveValue(updatedName);
        await staffObj.closeButton.click();
    })

    await test.step("Update Booking Profile: Staff Name Validation", async()=>{
        await staffObj.updateBookingProfileButton.click();
        await staffObj.employeeName.fill('')
        await staffObj.saveButton.click();

        // error message validation
        await expect.soft(staffObj.errorMsgRequired).toBeVisible();
    })

    // Booking profile email validations
    await test.step("Update Booking Profile: Staff Email validation", async()=>{
        await staffObj.employeeEmail.fill("adb@tyu");
        await staffObj.saveButton.click();


        // error message validation
        await expect.soft(staffObj.errorMsgInvalidEmail).toBeVisible();
        
    })

    await test.step("Update Staff Successfully", async()=>{
        let profileName = faker.person.firstName();
        await staffObj.employeeName.fill("ProfileName@ "+ profileName);
        await staffObj.employeeEmail.fill("booking."+profileName+"appointy@gmail.com");


        let updatedProfileName = await staffObj.employeeName.getAttribute("value");
        let updatedEmail = await staffObj.employeeEmail.getAttribute("value");

        console.log(updatedProfileName);
        console.log(updatedEmail);
       

        // save updated details
        await staffObj.saveButton.click();

        // assertions
        await staffObj.updateBookingProfileButton.click();

        //1: validate profile name
        await expect.soft(staffObj.employeeName).toHaveValue(updatedProfileName);

        //3: validate email
        await expect.soft(staffObj.employeeEmail).toHaveValue(updatedEmail);


    })
})
