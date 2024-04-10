// Create Staff from Employee/Staff Section
require('dotenv').config();

const {test, expect } = require('@playwright/test')
const {LoginPageObject, StaffObject} = require("../../../pageObjects/pageObjects")
const { faker } = require('@faker-js/faker');

const url = "https://admin.appointy.com/account/login" 
const mySpaceURL = "https://admin.appointy.com/my-space"
const srvURL = "https://admin.appointy.com/settings/appointment-settings/services"
let email = process.env.EMAIL; 
let password = process.env.PASSWORD; 

/*

Test Cases : Add Staff From Employee Add Button

1. Failed Attempt : Employee name and email address not entered
2. Failed Attempt : Employee name not filled
3. Email Address not filled
4. Invalid Email Address
5. Employee name exceeding 100 character limit
6. Successful Staff Creation
7. Email Already exists

*/
test("Add Staff From Employee/Staff Section", async({page})=>{
    let lgnPgObj = new LoginPageObject(page);
    let staffObj = new StaffObject(page);


    // Login 
    await page.goto(url)
    console.log(await page.title())

    await lgnPgObj.email_locator.fill(email);
    await lgnPgObj.password_locator.fill(password);
    await lgnPgObj.btn_locator.click();

    await page.waitForURL(mySpaceURL);

    // Failed Attempt : Employee name, email address & location not entered
    await test.step("Employee name, email address & location not entered", async() => {
        await staffObj.settingBtn.click();
        await staffObj.staffButton.click();
        await staffObj.addNewStaffBtn.click();

        // Click on Finish or next
        await staffObj.finishBtn.click();
        

        // error validation
        await expect(page.getByText('Required').first()).toHaveText('Required');
        await expect(page.getByText('Required').nth(1)).toHaveText('Required');
        await expect(page.getByText('Required').last()).toHaveText('Required');

    })

    await test.step("Staff name is not entered", async()=>{

        await staffObj.empEmailTextBox.fill("xyz@gmail.com");
        await staffObj.finishBtn.click();

        // error validation
        await expect.soft(page.getByText('Required').first()).toHaveText('Required');
        await expect.soft(page.getByText('Required').last()).toHaveText('Required');

    })

    await test.step("Staff Email is not entered", async()=>{

        await staffObj.empNameTextBox.fill("Bharat")
        await staffObj.empEmailTextBox.fill("");
        await staffObj.finishBtn.click();

        // Error Validation
        await expect.soft(page.getByText('Required').first()).toHaveText('Required');
    })

    await test.step("Invalid email address", async()=>{
        await staffObj.empNameTextBox.fill("James");
        await staffObj.empEmailTextBox.fill("abc@def");
        await staffObj.empLocation.click();
        await page.getByRole('button', { name: 'Loc-1' }).getByRole('checkbox').click();
        await staffObj.nextButton.click();

        // error validation
        await expect.soft(page.getByText("Invalid Email")).toBeVisible();


    })

    // Employee name exceeding 100 Character limit
    await test.step("Employee name exceeding 100 character limit", async()=>{
        await staffObj.empNameTextBox.fill("James123".repeat(15));
        await staffObj.empEmailTextBox.fill('james@appointy.com');

        // error validation
        await expect.soft(staffObj.errorMsgCharLimit).toBeVisible();

    })

    
    // await test.step("Email Already exists", async()=>{
    //     await staffObj.empNameTextBox.fill("James");
    //     await staffObj.empEmailTextBox.fill("bharat@appointy.com");
        
        
    //     let snackBar = page.locator("[id='notistack-snackbar']");
    //     await staffObj.nextButton.click();
    //     console.log(await snackBar.textContent());
        

    //     //error validation
    //     await expect.soft(snackBar).toHaveText("Staff already exists with this email");

        
    // })


    // Successful Staff Creation

    await test.step("Successful Staff Creation", async() =>{

        let firstName = faker.person.firstName();
        await staffObj.empNameTextBox.fill("Staff@"+firstName);
        await staffObj.empEmailTextBox.fill(firstName+"#emp+appointy@gmail.com");
        
       
       
        let empName = await page.getByPlaceholder('Name').getAttribute('value');
        let empEmail = await page.locator('[name=email]').getAttribute('value');

        await staffObj.nextButton.click();

        await page.getByLabel('NO', { exact: true }).click();
        await staffObj.finishBtn.click();

        // assertions 
        const searchBar = page.getByPlaceholder('Type to search...');
        await searchBar.fill(empName);
        await page.getByRole('option', { name: 'First Name matches "' + empName + '"' }).click()
        
        await page.getByRole('cell',{name: empName}).click();
        await staffObj.employeeEditButton.click();

         // validate employee name
        console.log(await staffObj.employeeName.getAttribute('value'));
        await expect.soft(staffObj.employeeName).toHaveValue(empName)
        

        //validate employee email address
        console.log(await staffObj.employeeEmail.getAttribute('value'));
        await expect.soft(staffObj.employeeEmail).toHaveValue(empEmail.toLowerCase());
    })
})

