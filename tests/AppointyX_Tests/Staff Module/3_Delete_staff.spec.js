// Delete staff from the System
require('dotenv').config();
const {test, expect } = require('@playwright/test')
const {LoginPageObject, StaffObject} = require("../../../pageObjects/pageObjects")


const url = "https://admin.appointy.com/account/login" 
const mySpaceURL = "https://admin.appointy.com/my-space"
let email = process.env.EMAIL; 
let password = process.env.PASSWORD; 

test("Delete Staff From System", async({page}) => {
    let lgnPgObj = new LoginPageObject(page);
    let staffObj = new StaffObject(page);

    // Login 
    await page.goto(url)
    console.log(await page.title())

    await lgnPgObj.email_locator.fill(email);
    await lgnPgObj.password_locator.fill(password);
    await lgnPgObj.btn_locator.click();

    await page.waitForURL(mySpaceURL);

    await test.step("Delete Employee", async()=>{
        await staffObj.settingBtn.click();
        await staffObj.staffButton.click();

        const searchBar = page.getByPlaceholder('Type to search...');
        await searchBar.click();
        await searchBar.fill("Staff@");
        await page.getByRole('option', { name: 'First Name matches "Staff@"' }).click()
        
        let empToDel = page.getByRole('cell',{name:'Staff@'}).last();
        const empToDelStr = await empToDel.textContent();
        console.log(empToDelStr);
        await empToDel.click();
        await staffObj.deleteEmployeeButton.click();

        await staffObj.deleteAllPastAppointments.check();
        await staffObj.deleteAllFutureAppointments.check();
        await staffObj.deleteAllAppointments.check();
        await staffObj.doNotDeleteAppointment.check();

        // Confirmation for Delete
        await staffObj.confirmDeleteButton.click();
        let snackbar = page.locator("[id='notistack-snackbar']");
        console.log(await snackbar.textContent());
        

        //assertion to confirm deletion
        //1: cature the employee name that was deleted
        //2: assert that the deleted employee name object is not present in  page
        
        let deletedEmployee = page.getByRole('cell', {name:empToDelStr})
        // const searchBar = page.getByPlaceholder('Type to search...');
        // await searchBar.fill(deletedEmployee);
        
        expect.soft(await deletedEmployee.isVisible()).toBeFalsy();
    })
})

