// Update an existing service
require('dotenv').config();

import { LoginTest,opensetting } from "../../CommonModules/testfunctions";
const { test, expect } = require("@playwright/test");
const{MySpacePageObjects,EmployeeObject,ServiceObjects} = require("../../../pageObjectsAppointy/PageObjects");
const { faker } = require('@faker-js/faker');

let url = "https://admin.appointy.com/account/login";
let email = process.env.EMAIL; 
let password = process.env.PASSWORD; 

test.describe('Edit service', () => {
    test.describe.configure({ mode: 'serial' })
    /** @type {import('@playwright/test').Page} */
    let page;
    test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    });
    test('Edit Existing service', async({}) => {

        let myspaceObj = new MySpacePageObjects(page); 
        let serviceObj = new ServiceObjects(page);

        // 1 : LOGIN USING THE LOGINTEST FUNCTION FROM COMMON.JS FILE

        await test.step('login', async () =>{
            
            await LoginTest(page,url,emailAddress,password);
        })

        // SELECT SERVICE

        await opensetting(page);
        await serviceObj.serviceButton.click();
        await serviceObj.editService.click();
        await serviceObj.updateServiceButton.click();

        // EDIT DETAILS

        // SERVICE TITLE
        await serviceObj.serviceTitleTextBox.fill("editThisService#"+faker.finance.pin());

        //SERVICE DESCRIPTION
        await serviceObj.updateDescriptionButton.click();
        await serviceObj.descriptionTextBox.fill(faker.lorem.lines(2));


        // DURATION & PRICE

        await serviceObj.durationTextBox.fill(faker.random.numeric(2));
        await serviceObj.priceTextBox.fill(faker.random.numeric(2));




        // EDITED FIELDS

        let updatedTitle = await serviceObj.serviceTitleTextBox.getAttribute('value');
        let updatedDescription = await serviceObj.descriptionTextBox.textContent()
        let updatedDuration = await serviceObj.durationTextBox.getAttribute('value');
        await serviceObj.durationTextBox.click();
        let updatedPrice = await serviceObj.priceTextBox.getAttribute('value');

        console.log(updatedTitle,updatedDescription,updatedDuration,updatedPrice);

         // SAVE EDITS
        await serviceObj.saveButton.click();

        // VALIDATE EDITS

        await serviceObj.updateServiceButton.waitFor({state:'attached'});
        await serviceObj.closeButton.click();
        await serviceObj.editService.click();
        await serviceObj.updateServiceButton.click();

        // VALIDATE UPDATED TITLE

        await expect.soft(serviceObj.serviceTitleTextBox).toHaveValue(updatedTitle);

        // VALIDATE UPDATED DESCRIPTION

        await serviceObj.updateDescriptionButton.click();
        await expect.soft(serviceObj.descriptionTextBox).toHaveText(updatedDescription);

        //VALIDATE DURATION

        await expect.soft(serviceObj.durationTextBox).toHaveValue(updatedDuration);

        // VALIDATE UPDATED PRICE

        await expect.soft(serviceObj.priceTextBox).toHaveValue(updatedPrice);
    });      
});