const { test, expect } = require("@playwright/test");

class LoginPageObject {

    constructor(page){
        this.btn_locator = page.locator("button[type='submit']")
        this.email_locator = page.locator("input[placeholder='Email']")
        this.password_locator = page.locator("input[placeholder='Password']")
    }
}

class MySpacePageObject{
    constructor(page){
        this.addAppointnentButton = page.getByRole('menuitem',{name:'Appointment',exact:true});
        this.addButton = page.getByRole('button', { name: 'Add', exact: true });
        this.addEmployeeButton = page.getByRole("menuitem",{name:'Employee',exact:true});
        this.addCustomerButton = page.getByText('Customer', { exact: true });
        this.settingButton = page.getByRole('button', {name: 'Settings' });
        this.userProfileButton = page.getByRole('button', {name: 'B'});
        this.LogOutButton = page.getByRole('button', { name: 'Logout' });
        this.mySpaceButton = page.getByRole('button',{name: 'My Space'});
    }  
}

class ServiceObject {

    constructor(page){
        this.addServiceBtnMySpace = page.getByRole('button', {name:'Add', exact: true});
        this.settingBtn = page.getByRole('button',{name: 'Settings'});
        this.serviceBtn = page.getByRole('button', {name: 'Services'});
        this.addNewServiceBtn = page.getByRole('main').filter({ hasText: 'Organization SettingsBilling & SubscriptionCompaniesLocationsStaffRoles N Rights' }).getByRole('button', { name: 'Add' })
        this.createNewService = page.getByRole('button', { name: 'Create new service' })
        this.oneToOneSrvBtn = page.getByRole('button', { name: 'One to One Provide service to a single person' })

        this.groupSrvBtn = page.getByRole('button', { name: 'Group Provide service to a multiple persons at a time' })
        this.inLocationBtn = page.getByRole('button', { name: 'In-Location Provide Service at the location.' })
        this.srvTitleTextBox = page.locator('[placeholder=Title]');
        this.srvDuratnBox = page.locator('[aria-label=Duration]');
        this.setPriceBtn = page.getByRole('link',{name: 'Set Price'});
        this.priceTextBox = page.locator('[aria-label=Price]');
        this.nxtBtn = page.getByRole('button',{name : 'Next'});

        this.assignToAllBtn = page.getByRole('link',{name:'ASSIGN TO ALL'});
        this.deleteBtn = page.getByRole('button', { name: 'Delete' })
        this.confirmBtn = page.getByRole('button',{name: 'Confirm'});
        this.addNewDurationBtn = page.getByRole('button',{name : 'Add'});
        this.closeBtn = page.getByRole('button', { name: 'Close' });
        
    }
}


class StaffObject{

    constructor(page){
        this.settingBtn = page.getByRole('button',{name: 'Settings'});
        this.staffButton = page.getByRole('button', {name: 'Staff'});
        this.addNewStaffBtn = page.getByRole('button',{name:'Add'}).nth(1);
        this.finishBtn = page.getByRole('button', {name: 'Finish'});
        this.empNameTextBox = page.getByPlaceholder('Name');
        this.empEmailTextBox = page.getByPlaceholder('Email');
        this.empLocation = page.getByPlaceholder('Locations');
        // this.empNameTextBoxx = page.locator('[name = hasExtendedProfiles]');

        this.provideServiceCheckBox = page.locator('[name = hasExtendedProfiles]');
        this.enableLoginCheckBox = page.locator('[name = enableLogin]');
        this.activeCheckBox = page.locator('[name = active]');
        this.nextButton = page.getByRole('button', {name: 'Next'});
        this.employeeEditButton = page.getByRole('button',{name:'Update',exact:true});
        this.employeeName = page.locator('[name=name]');
        this.employeeEmail = page.locator('[name=email]');
        this.sendInvitationMail = page.getByRole('button',{name:'Send invitation email'});
        this.sendVerificationtionMail = page.getByRole('button',{name:'Send verification email'});

        this.saveButton = page.getByRole('button',{name:'Save'});
        this.updateBookingProfileButton = page.getByRole('button',{name:'Update Booking Profile',exact:true});
    
        this.closeButton = page.getByRole('button',{name:'Close',exact:true});
        
        this.deleteEmployeeButton = page.getByRole('button',{name:'delete'});
        this.doNotDeleteAppointment = page.getByLabel("Do not Delete");
        this.deleteAllAppointments = page.getByLabel("Delete All Appointments");
        this.deleteAllPastAppointments = page.getByLabel("Delete All Past");
        this.deleteAllFutureAppointments = page.getByLabel("Delete All Future");
        this.confirmDeleteButton = page.getByRole('button',{name:'Confirm'});
        this.errorMsgRequired = page.getByText('Required');
        this.errorMsgInvalidEmail = page.getByText("Invalid Email");
        this.errorMsgCharLimit = page.getByText('Max 100 characters allowed');
        this.errorMsgBioCharLimit = page.getByText('Max 2000 characters are allowed');
        this.errorMsgGMeetCharLimit = page.getByText("Max 300 characters are allowed");
    }
}


module.exports = {LoginPageObject, ServiceObject, StaffObject, MySpacePageObject};

