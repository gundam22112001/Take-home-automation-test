import { test as base, expect, type Page } from "@playwright/test"
import Login from "../page/Login"
import NavigationBar from "../page/NavigationBar"
import { Account } from "./common-data"

type AuthFixtures = {
    guessPage: Page
    userPage: Page
}

export const test = base.extend<AuthFixtures>({
    guessPage: async ({ browser }, use, testInfo) => {
        const context = await browser.newContext({
            recordVideo: {
                dir: 'test-results/videos/',
                size: {width: 1024, height: 768}
            }
        })
        const page = await context.newPage()
        await use(page)
        const video = page.video();
        await context.close()

    if (testInfo.status !== testInfo.expectedStatus && video) {
            const videoPath = await video.path();
            if (videoPath) {
                await testInfo.attach('video', { 
                    path: videoPath, 
                    contentType: 'video/webm' 
                });
            }
        }
    },

    userPage: async ({ browser }, use, testInfo) => {
        const context = await browser.newContext({
            recordVideo: {
                dir: 'test-results/videos/',
                size: {width: 1024, height: 768}
            }
        })
        const page = await context.newPage()
        const nav = new NavigationBar(page)
        const login = new Login(page)

        await page.goto('/')
        await nav.clickLoginBtn()
        await login.loginWithAccount(Account.userName, Account.password)
        await nav.getNameOfUserEl().waitFor({ state: 'visible' })

        await use(page)
        const video = page.video();
        await context.close()

        if (testInfo.status !== testInfo.expectedStatus && video) {
            const videoPath = await video.path();
            if (videoPath) {
                await testInfo.attach('video', { 
                    path: videoPath, 
                    contentType: 'video/webm' 
                });
            }
        }
    }
})

export { expect }
