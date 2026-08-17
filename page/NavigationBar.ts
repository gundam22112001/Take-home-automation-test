import {Locator, Page} from "@playwright/test"

export default class NavigationBar {
    page: Page;
    private cartBtn: Locator
    private loginBtn: Locator
    private signupBtn: Locator
    private logoutBtn: Locator
    private nameOfUser: Locator

    constructor(page: Page) {
        this.page = page
        this.loginBtn = this.page.locator('[id="login2"]')
        this.cartBtn = this.page.locator('[id="cartur"]')
        this.nameOfUser = this.page.locator('[id="nameofuser"]')
        this.signupBtn = this.page.locator('[id="signin2"]')
        this.logoutBtn = this.page.locator('[id="logout2"]')
    }

    getLoginBtn(): Locator { return this.loginBtn }
    getSignupBtn(): Locator { return this.signupBtn }
    getLogoutBtn(): Locator { return this.logoutBtn }
    getNameOfUserEl(): Locator { return this.nameOfUser }

    async clickLoginBtn() {
        await this.loginBtn.click()
    }

    async clickCartBtn() {
        await this.cartBtn.click()
    }

    async getNameOfUser(): Promise<string | null> {
        return this.nameOfUser.textContent();
    }
}
