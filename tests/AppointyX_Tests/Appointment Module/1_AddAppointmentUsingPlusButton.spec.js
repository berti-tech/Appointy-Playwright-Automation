const { test, expect } = require("@playwright/test");

const {MySpacePageObjects,AppointmentFormObjects} = require("../../../pageObjectsAppointy/PageObjects");

import { LoginTest } from "../../CommonModules/testfunctions";    
require('dotenv').config();

let url = "https://admin.appointy.com/account/login"

let email = process.env.EMAIL; 
let password = process.env.PASSWORD; 

test.describe("Appointy Automation", () => {
  test("Add appointment", async ({ page }) => {
    
    // Login using the LoginTest function from common module file
    await test.step("login", async () => {
      await LoginTest(page,url,email,password);
    });

    // My space add appointment
    const mySpaceObj = new MySpacePageObjects(page)
    await test.step("my-space add appointment", async () => {
      await mySpaceObj.addButton.click();
      await mySpaceObj.addAppointnentButton.click();
    });

    // Select catagory
    const categoryObj = new AppointmentFormObjects(page)
    await test.step("select catagory", async () => {
      await categoryObj.categoryComboBox.click();
      const categoryArray = await categoryObj.categoryArray.allTextContents();
      console.log(categoryArray);
      await page.pause();

      /**randomizing catagory selection
       * generate a random number using Math.random()
       * multiply the random number with Array length
       * use the random number generated above as index to call the Array elemnet
       * **/

      const i = Math.floor(Math.random() * (categoryArray.length - 1));
      // const i = 0
      console.log("catagory array index: ", i);
      await page
        .getByRole("option", { name: categoryArray[i], exact: true })
        .click();

      // 3-b assertion to verify the seleted category option is active

      await expect(page.locator("[placeholder = 'Category']")).toHaveValue(
        categoryArray[i]
      );
      console.log(
        await page.locator("[placeholder = 'Category']").getAttribute("value")
      );
      await page.pause()
    });

    // Select Service
    const booked_service = await test.step("Select Service", async () => {
      const service = page.locator("[placeholder='Game']");
      await service.click();
      const serviceArray = await page.getByRole("option").allTextContents();
      console.log(serviceArray);

      //randomizing service selection
      const i = Math.floor(Math.random() * (serviceArray.length - 1));
      // const i = 0
      console.log("Service array index: ", i);
      await page
        .getByRole("option", { name: serviceArray[i], exact: true })
        .click();

      //4-b assertion to verify the seleted game option is active
      await expect(page.locator("[placeholder='Game']")).toHaveValue(
        serviceArray[i]
      );
      console.log(
        await page.locator("[placeholder='Game']").getAttribute("value")
      );

      // Select service duration

      await page.locator("[id*='select-duration']").click();
      const serviceDurationArray = await page
        .getByRole("option")
        .allTextContents();
      console.log(serviceDurationArray);
      // randomizing duration selection
      const di = Math.floor(Math.random() * (serviceDurationArray.length - 1));
      console.log("duration array index: ", di);

      await page
        .getByRole("option")
        .getByText(serviceDurationArray[di])
        .click();
      console.log("service duration", serviceDurationArray[di]);

      return page.locator("[placeholder='Game']").getAttribute("value");
    });

    //5-a select Staff
    const bookedStaff = await test.step("Select Staff", async () => {
      const platform = page.locator("[placeholder*='Any Platform']");
      await platform.click();

      //Deley to populate the staff list
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(500);
      const staffArray = await page.getByRole("option").allTextContents();
      console.log(staffArray);

      //randomizing staff selection
      const i = Math.floor(Math.random() * (staffArray.length - 1));
      console.log("staff array index: ", i);
      await page
        .getByRole("option", { name: staffArray[i], exact: true })
        .click();

      // Assertion to verify the selected staff option is active
      await expect
        .soft(page.locator("[placeholder*='Any Platform']"))
        .toHaveValue(staffArray[i]);
      console.log(
        await page
          .locator("[placeholder*='Any Platform']")
          .getAttribute("value")
      );

      return await page
        .locator("[placeholder*='Any Platform']")
        .getAttribute("value");
    });

    // Select date

    const bookingDate = await test.step("Select date", async () => {
      const date = page.locator("[placeholder='Date']");
      await date.click();
      const dateArray = await page.getByRole("cell").allTextContents();

      console.log(dateArray);

      // 6-b  Randomizing date selection

      const i = Math.floor(Math.random() * (dateArray.length - 1));
      // const i = 28
      console.log("bookingDate array index: ", i);
      await page
        .getByRole("cell")
        .getByText(dateArray[i], { exact: true })
        .click();

      console.log(
        "booking_date: ",
        await page.locator("[placeholder='Date']").getAttribute("value")
      );

      return await page.locator("[placeholder='Date']").getAttribute("value");

      /** TODO:
       * - ADD appointments for different months
       *  Add appointments for different year
       */
    });

    //7-a select time

    const startTime = await test.step("Select Start Time", async () => {
      const startTime = page.locator("[placeholder='Start Time']");
      await startTime.click();
      const startTimeArray = await page
        .locator(".ui-timepicker-list")
        .getByRole("listitem")
        .allTextContents();

      console.log(startTimeArray);

      // 7-b randomizing start time selection

      const i = Math.floor(Math.random() * (startTimeArray.length - 1));
      const start_time = startTimeArray[i];
      console.log("start time array index: ", i);
      console.log("start time: ", start_time);
      await page
        .locator(".ui-timepicker-list")
        .getByRole("listitem")
        .getByText(start_time, { exact: true })
        .click();

      return startTimeArray[i];
    });

    // 8 conditional block to handle service Resource
    // it will execute when the resource is linked with the service
    // ptherwise move out of the if block

    if (await page.locator("[placeholder*='Resource']").isVisible()) {
      await page.locator("[placeholder*='Resource']").click();
      const resourceArray = await page.getByRole("option").allTextContents();
      console.log(resourceArray);
      const i = Math.floor(Math.random() * (resourceArray.length - 1));
      console.log("resource array index: ", i);
      const resourceItem = resourceArray[i];
      console.log("resource: ", resourceArray[i]);
      await page
        .getByRole("option", { name: resourceItem, exact: true })
        .click();
    }

    // conditional block for handling quantity booking
    // executes when services has associated group booking
    // returns the number of quantity

    const quantity = await test.step("quantity booking", async () => {
      if (await page.locator("[name='quantity']").isVisible()) {
        await page.locator("[name='quantity']").click();
        await page.locator("[name='quantity']").fill("4");

        await page.pause();

        //return (await page.locator("[name='quantity']").textContent())
      }
    });

    // 9-a Selecting a customer

    const bookedCustomer = await test.step("Selecting Customer", async () => {
      const customer = page.locator("[id='customer-search']");
      await customer.click();
      await customer.fill("cl");
      //9-b add delay to let the customer list popup
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1500);
      let customerArray = await page.getByRole("option").allTextContents();
      customerArray = customerArray.slice(0, customerArray.length - 1);
      console.log(customerArray);

      // 9-c randomize customer selection
      const i = Math.floor(Math.random() * (customerArray.length - 1));
      await page
        .getByRole("option")
        .getByText(customerArray[i], { exact: true })
        .click();
      const bookedClient = await page
        .locator("[id='customer-search']")
        .getAttribute("value");
      console.log("booked customer: ", bookedClient);
      await page.pause();
      return bookedClient;
    });

    // 9-d
    //conditional block for handeling intake form
    // it will execute when the Intake form is linked with the service
    // Otherwise move out of the if block

    await test.step("intake form", async () => {
      if (await page.locator("[placeholder*='Add additional']").isVisible()) {
        await page.locator("[placeholder*='Add additional']").click();
        // console.log(await page.getByRole('dialog').textContent())
        await page.getByRole("dialog").screenshot("screenshot/intake.png");
        await page.pause();
        await page
          .getByPlaceholder("[form*='intake-form']")
          .getByText("Save")
          .click();
      }
    });

    // 10 save appointment

    await page.locator("[type='submit']").click();
    await page.pause();

    console.log(booked_service);
    console.log(bookingDate);
    console.log(bookedStaff);
    console.log(startTime);
    console.log(bookedCustomer);
    console.log(quantity);

    // 10 booking validation

    /** TODO:
         * Add If conditons for fetching booking dates of differnt months and year
         * Add object screenshots at test steps
         * validate multiple bookings in a single day
    **/

    await test.step("Validations", async () => {
      //processing booked date in array form
      let validateDate = bookingDate.split(" ");
      validateDate[1] = validateDate[1].substring(0, 2);
      // console.log(validateDate)

      // processing local date in array form
      let localDate = await page
        .locator("button >> nth = 3 >> span>span:nth-child(2)")
        .textContent();
      console.log("currentDate: ", localDate);
      localDate = localDate.split(" ");
      localDate[1] = localDate[1].substring(0, 2);
      // console.log(localDate)

      if (validateDate[1] != localDate[1]) {
        const i = Number(validateDate[1]).toString();
        await page.locator("button >>nth=3>> span>span:nth-child(2)").click();
        // const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        // await delay(1000)

        await page.getByRole("cell").getByText(i, { exact: true }).click();


        console.log(
          await page
            .locator("button>>nth=3>>span>span:nth-child(2)")
            .textContent()
        );

        await page.pause();
      }
    });
  });
});
