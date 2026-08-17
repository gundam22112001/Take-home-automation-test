import {Locator, Page} from "@playwright/test"

export default class Login {
    page: Page;
    private InputUserName: Locator
    private InputPassword: Locator
    private SubmitBtn: Locator
    private closeBtn: Locator
    private xBtn: Locator

    constructor(page: Page) {
        this.page = page
        this.InputUserName = this.page.locator('input[id="loginusername"]');
        this.InputPassword = this.page.locator('input[id="loginpassword"]');
        this.SubmitBtn = this.page.locator('//button[text()="Log in"]');
        this.closeBtn = this.page.locator('//button[@onclick="logIn()"]/preceding-sibling::button')
        this.xBtn = this.page.locator('//h5[text()="Log in"]/following-sibling::button[@aria-label="Close"]')
    }

    getUsernameInput(): Locator { return this.InputUserName }
    getPasswordInput(): Locator { return this.InputPassword }
    getSubmitBtn(): Locator { return this.SubmitBtn }

    async openPage() {
        await this.page.goto('/login')
    }

    async fillUsername(userName: string) {
        await this.InputUserName.fill(userName)
    }

    async fillPassword(password: string) {
        await this.InputPassword.fill(password)
    }

    async clickSubmitBtn() {
        await this.SubmitBtn.click()
    }

    async loginWithAccount(userName: string, password: string) {
        await this.InputUserName.fill(userName);
        await this.InputPassword.fill(password);
        await this.SubmitBtn.click();
    }

    async clickCloseBtn() {
        await this.closeBtn.click()
    }

    async clickXBtn() {
        await this.xBtn.click()
    }
}
