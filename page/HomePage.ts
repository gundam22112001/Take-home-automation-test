import { Locator, Page } from "@playwright/test"

export default class HomePage {
    page: Page
    private productLinks: Locator
    private phonesCategory: Locator
    private laptopsCategory: Locator
    private monitorsCategory: Locator

    constructor(page: Page) {
        this.page = page
        this.productLinks = this.page.locator('.card-title a')
        this.phonesCategory = this.page.locator('a.list-group-item:has-text("Phones")')
        this.laptopsCategory = this.page.locator('a.list-group-item:has-text("Laptops")')
        this.monitorsCategory = this.page.locator('a.list-group-item:has-text("Monitors")')
    }

    getProductLinks(): Locator { return this.productLinks }
    getPhonesCategory(): Locator { return this.phonesCategory }
    getLaptopsCategory(): Locator { return this.laptopsCategory }
    getMonitorsCategory(): Locator { return this.monitorsCategory }

    async navigate() {
        await this.page.goto('/')
    }

    async waitForProducts() {
        await this.productLinks.first().waitFor({ state: 'visible' })
    }

    async clickFirstProduct() {
        await this.waitForProducts()
        await this.productLinks.first().click()
    }

    async clickProductByIndex(index: number) {
        await this.waitForProducts()
        await this.productLinks.nth(index).click()
    }

    async clickPhones() {
        await this.phonesCategory.click()
        await this.waitForProducts()
    }

    async clickLaptops() {
        await this.laptopsCategory.click()
        await this.waitForProducts()
    }

    async clickMonitors() {
        await this.monitorsCategory.click()
        await this.waitForProducts()
    }

    async getProductNameByIndex(index: number): Promise<string> {
        await this.waitForProducts()
        return (await this.productLinks.nth(index).textContent()) ?? ''
    }
}
