import { Locator, Page } from "@playwright/test"

export default class ProductPage {
    page: Page
    private productName: Locator
    private productPrice: Locator
    private addToCartBtn: Locator

    constructor(page: Page) {
        this.page = page
        this.productName = this.page.locator('h2.name')
        this.productPrice = this.page.locator('h3.price-container')
        this.addToCartBtn = this.page.locator('a.btn-success:has-text("Add to cart")')
    }

    getProductName(): Locator { return this.productName }
    getProductPrice(): Locator { return this.productPrice }
    getAddToCartBtn(): Locator { return this.addToCartBtn }

    async getProductNameText(): Promise<string> {
        return (await this.productName.textContent()) ?? ''
    }

    async getProductPriceText(): Promise<string> {
        return (await this.productPrice.textContent()) ?? ''
    }

    async addToCart(): Promise<string> {
        const dialogPromise = this.page.waitForEvent('dialog')
        await this.addToCartBtn.click()
        const dialog = await dialogPromise
        const message = dialog.message()
        await dialog.accept()
        return message
    }
}
