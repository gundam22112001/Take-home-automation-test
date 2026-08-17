import { Locator, Page } from "@playwright/test"

export default class OrderConfirmationModal {
    page: Page
    private modal: Locator
    private title: Locator
    private body: Locator
    private okBtn: Locator

    constructor(page: Page) {
        this.page = page
        this.modal = this.page.locator('.sweet-alert')
        this.title = this.page.locator('.sweet-alert h2')
        this.body = this.page.locator('.sweet-alert p.lead')
        this.okBtn = this.page.locator('.sweet-alert .confirm')
    }

    getModal(): Locator { return this.modal }
    getTitle(): Locator { return this.title }
    getBody(): Locator { return this.body }
    getOkBtn(): Locator { return this.okBtn }

    async waitForModal() {
        await this.modal.waitFor({ state: 'visible' })
    }

    async getTitleText(): Promise<string> {
        return (await this.title.textContent()) ?? ''
    }

    async getBodyText(): Promise<string> {
        return (await this.body.textContent()) ?? ''
    }

    private async extractField(label: string): Promise<string> {
        const text = await this.getBodyText()
        const match = text.match(new RegExp(`${label}:\\s*([^\\n]+)`))
        return match ? match[1].trim() : ''
    }

    async getOrderId(): Promise<string> { return this.extractField('Id') }
    async getAmount(): Promise<string> { return this.extractField('Amount') }
    async getCardNumber(): Promise<string> { return this.extractField('Card Number') }
    async getName(): Promise<string> { return this.extractField('Name') }
    async getDate(): Promise<string> { return this.extractField('Date') }

    async clickOk() {
        await this.okBtn.click()
    }
}
