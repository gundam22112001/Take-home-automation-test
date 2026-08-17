import { Locator, Page } from "@playwright/test"

export default class PlaceOrderModal {
    page: Page
    private modal: Locator
    private nameInput: Locator
    private countryInput: Locator
    private cityInput: Locator
    private cardInput: Locator
    private monthInput: Locator
    private yearInput: Locator
    private purchaseBtn: Locator
    private closeBtnFooter: Locator
    private xBtnHeader: Locator

    constructor(page: Page) {
        this.page = page
        this.modal = this.page.locator('#orderModal')
        this.nameInput = this.page.locator('#name')
        this.countryInput = this.page.locator('#country')
        this.cityInput = this.page.locator('#city')
        this.cardInput = this.page.locator('#card')
        this.monthInput = this.page.locator('#month')
        this.yearInput = this.page.locator('#year')
        this.purchaseBtn = this.page.locator('button[onclick="purchaseOrder()"]')
        this.closeBtnFooter = this.page.locator('#orderModal button:has-text("Close")')
        this.xBtnHeader = this.page.locator('#orderModal button.close')
    }

    getModal(): Locator { return this.modal }
    getNameInput(): Locator { return this.nameInput }
    getCountryInput(): Locator { return this.countryInput }
    getCityInput(): Locator { return this.cityInput }
    getCardInput(): Locator { return this.cardInput }
    getMonthInput(): Locator { return this.monthInput }
    getYearInput(): Locator { return this.yearInput }
    getPurchaseBtn(): Locator { return this.purchaseBtn }
    getCloseBtnFooter(): Locator { return this.closeBtnFooter }
    getXBtnHeader(): Locator { return this.xBtnHeader }

    async waitForModal() {
        await this.modal.waitFor({ state: 'visible' })
    }

    async fillOrderForm(name: string, country: string, city: string, card: string, month: string, year: string) {
        await this.nameInput.fill(name)
        await this.countryInput.fill(country)
        await this.cityInput.fill(city)
        await this.cardInput.fill(card)
        await this.monthInput.fill(month)
        await this.yearInput.fill(year)
    }

    async clickPurchase() {
        await this.purchaseBtn.click()
    }

    async clickCloseBtn() {
        await this.closeBtnFooter.click()
    }

    async clickXBtn() {
        await this.xBtnHeader.click()
    }
}
