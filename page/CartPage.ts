import { Locator, Page, expect } from "@playwright/test"

export default class CartPage {
    page: Page
    private cartRows: Locator
    private totalPrice: Locator
    private placeOrderBtn: Locator
    private orderModal: Locator

    constructor(page: Page) {
        this.page = page
        this.cartRows = this.page.locator('#tbodyid tr')
        this.totalPrice = this.page.locator('#totalp')
        this.placeOrderBtn = this.page.locator('button[data-target="#orderModal"]')
        this.orderModal = this.page.locator('#orderModal')
    }

    getCartRows(): Locator { return this.cartRows }
    getTotalPrice(): Locator { return this.totalPrice }
    getPlaceOrderBtn(): Locator { return this.placeOrderBtn }
    getOrderModal(): Locator { return this.orderModal }

    async navigate() {
        await this.page.goto('/cart.html')
    }

    async waitForItem() {
        await this.cartRows.first().waitFor({ state: 'visible' })
    }
        
    async waitForItems(itemCounts: number): Promise<void> {
        await expect(this.cartRows).toHaveCount(itemCounts);
    }

    async getRowCount(): Promise<number> {
        return this.cartRows.count()
    }

    async getTotalText(): Promise<string> {
        return (await this.totalPrice.textContent()) ?? '0'
    }

    async getProductNameAtRow(index: number): Promise<string> {
        return (await this.cartRows.nth(index).locator('td').nth(1).textContent()) ?? ''
    }

    async getProductPriceAtRow(index: number): Promise<string> {
        return (await this.cartRows.nth(index).locator('td').nth(2).textContent()) ?? ''
    }

    getProductImageAtRow(index: number): Locator {
        return this.cartRows.nth(index).locator('td img')
    }

    getDeleteBtnAtRow(index: number): Locator {
        return this.cartRows.nth(index).locator('td a')
    }

    async deleteItemAtRow(index: number) {
        await this.getDeleteBtnAtRow(index).click()
        await this.page.waitForTimeout(800)
    }

    async clickPlaceOrder() {
        await this.placeOrderBtn.click()
    }

    async ready() {
        await this.page.waitForLoadState("load")
    }
}
