import { test, expect } from '../common/fixture'
import { allureId, description, feature, story, step } from 'allure-js-commons';
import Login from '../page/Login'
import NavigationBar from '../page/NavigationBar'
import { Account, SymbleAccount } from '../common/common-data'

test.describe('Login', () => {

    test.describe('Functional', () => {

        test('TC-LOG-001 Login modal opens on click', async ({ guessPage }) => {
            await allureId('TC-LOG-001')
            await description('The Login modal appears with a Username field, Password field, and a Log in button.')
            await feature('Login')
            await story('Functional')

            const nav = new NavigationBar(guessPage)
            const login = new Login(guessPage)

            await step('Open home page', async () => {
                await guessPage.goto('/')
            })
            await step("Click 'Log in' in the navigation bar", async () => {
                await nav.clickLoginBtn()
            })
            await step('Verify login modal is visible with all required elements', async () => {
                await expect(login.getUsernameInput()).toBeVisible()
                await expect(login.getPasswordInput()).toBeVisible()
                await expect(login.getSubmitBtn()).toBeVisible()
            })
        })

        test('TC-LOG-002 Successful login with valid credentials', async ({ guessPage }) => {
            await allureId('TC-LOG-002')
            await description("Modal closes. Nav bar shows 'Welcome <username>'. Log in and Sign up links are replaced by Log out.")
            await feature('Login')
            await story('Functional')

            const nav = new NavigationBar(guessPage)
            const login = new Login(guessPage)

            await step('Open home page', async () => {
                await guessPage.goto('/')
            })
            await step("Click 'Log in' in the navigation bar", async () => {
                await nav.clickLoginBtn()
            })
            await step('Enter valid username and password, then click Log in', async () => {
                await login.loginWithAccount(Account.userName, Account.password)
            })
            await step('Verify welcome message and Log out link are visible', async () => {
                await expect(nav.getNameOfUserEl()).toBeVisible()
                await expect(nav.getNameOfUserEl()).toContainText(`Welcome ${Account.userName}`)
                await expect(nav.getLogoutBtn()).toBeVisible()
            })
        })

        test('TC-LOG-003 Welcome message shows correct username after login', async ({ userPage }) => {
            await allureId('TC-LOG-003')
            await description('The nav bar displays Welcome <username> where <username> exactly matches the credential used.')
            await feature('Login')
            await story('Functional')

            const nav = new NavigationBar(userPage)

            await step('Verify welcome message contains the exact username used to log in', async () => {
                const nameText = await nav.getNameOfUser()
                expect(nameText).toContain(`Welcome ${Account.userName}`)
            })
        })

        test('TC-LOG-004 Login modal closes via X button', async ({ guessPage }) => {
            await allureId('TC-LOG-004')
            await description('Modal closes without performing any login. User remains logged out.')
            await feature('Login')
            await story('Functional')

            const nav = new NavigationBar(guessPage)
            const login = new Login(guessPage)

            await step('Open home page', async () => {
                await guessPage.goto('/')
            })
            await step("Click 'Log in' to open the modal", async () => {
                await nav.clickLoginBtn()
                await expect(login.getUsernameInput()).toBeVisible()
            })
            await step('Click the X (close) button in the top-right corner', async () => {
                await login.clickXBtn()
            })
            await step('Verify modal is closed and user remains logged out', async () => {
                await expect(login.getUsernameInput()).not.toBeVisible()
                await expect(nav.getLoginBtn()).toBeVisible()
            })
        })

        test('TC-LOG-005 Login modal closes via Close button', async ({ guessPage }) => {
            await allureId('TC-LOG-005')
            await description('Modal closes without performing any login. User remains logged out.')
            await feature('Login')
            await story('Functional')

            const nav = new NavigationBar(guessPage)
            const login = new Login(guessPage)

            await step('Open home page', async () => {
                await guessPage.goto('/')
            })
            await step("Click 'Log in' to open the modal", async () => {
                await nav.clickLoginBtn()
                await expect(login.getUsernameInput()).toBeVisible()
            })
            await step("Click the 'Close' button at the bottom of the modal", async () => {
                await login.clickCloseBtn()
            })
            await step('Verify modal is closed and user remains logged out', async () => {
                await expect(login.getUsernameInput()).not.toBeVisible()
                await expect(nav.getLoginBtn()).toBeVisible()
            })
        })

        // This test is failed for the purpose of having a fail case
        test('TC-LOG-006 Fields are cleared when modal is reopened', async ({ guessPage }) => {
            await allureId('TC-LOG-006')
            await description('Username and password fields are empty when the modal is reopened. Prevents credential leakage.')
            await feature('Login')
            await story('Functional')

            const nav = new NavigationBar(guessPage)
            const login = new Login(guessPage)

            await step('Open home page', async () => {
                await guessPage.goto('/')
            })
            await step('Open login modal and enter data in both fields', async () => {
                await nav.clickLoginBtn()
                await login.fillUsername('someuser')
                await login.fillPassword('somepass')
            })
            await step('Close the modal via X button', async () => {
                await login.clickXBtn()
            })
            await step("Reopen the modal by clicking 'Log in'", async () => {
                await nav.clickLoginBtn()
            })
            await step('Verify both fields are empty', async () => {
                await expect(login.getUsernameInput()).toHaveValue('')
                await expect(login.getPasswordInput()).toHaveValue('')
            })
        })

        test('TC-LOG-007 Log in and Sign up nav links hidden while logged in', async ({ userPage }) => {
            await allureId('TC-LOG-007')
            await description("'Log in' and 'Sign up' links are NOT visible. Only 'Welcome <username>' and 'Log out' are shown.")
            await feature('Login')
            await story('Functional')

            const nav = new NavigationBar(userPage)

            await step('Navigate to home page', async () => {
                await userPage.goto('/')
            })
            await step("Verify 'Log in' and 'Sign up' links are not visible", async () => {
                await expect(nav.getLoginBtn()).not.toBeVisible()
                await expect(nav.getSignupBtn()).not.toBeVisible()
            })
            await step("Verify 'Welcome <username>' and 'Log out' are visible", async () => {
                await expect(nav.getNameOfUserEl()).toBeVisible()
                await expect(nav.getLogoutBtn()).toBeVisible()
            })
        })
    })

    test.describe('Edge Case', () => {

        test('TC-LOG-008 Login with username containing leading and trailing spaces', async ({ guessPage }) => {
            await allureId('TC-LOG-008')
            await description('Shows a clear error message. Must not silently create or match a different account.')
            await feature('Login')
            await story('Edge Case')

            const nav = new NavigationBar(guessPage)
            const login = new Login(guessPage)

            await step('Open home page', async () => {
                await guessPage.goto('/')
            })
            await step('Open login modal', async () => {
                await nav.clickLoginBtn()
            })
            await step('Enter padded username and valid password, then click Log in', async () => {
                const dialogPromise = guessPage.waitForEvent('dialog')
                await login.loginWithAccount(`  ${Account.userName}  `, Account.password)
                const dialog = await dialogPromise
                expect(dialog.message()).toBeTruthy()
                await dialog.accept()
            })
            await step('Verify user is not logged in', async () => {
                await expect(nav.getNameOfUserEl()).not.toBeVisible()
            })
        })

        test('TC-LOG-009 Login with special characters in username', async ({ guessPage }) => {
            await allureId('TC-LOG-009')
            await description('Login succeeds without error. Requires a pre-registered account with username user!@#.')
            await feature('Login')
            await story('Edge Case')

            const nav = new NavigationBar(guessPage)
            const login = new Login(guessPage)

            await step('Open home page', async () => {
                await guessPage.goto('/')
            })
            await step("Click 'Log in' in the navigation bar", async () => {
                await nav.clickLoginBtn()
            })
            await step('Enter username with special characters and password, then click Log in', async () => {
                await login.loginWithAccount(SymbleAccount.userName, SymbleAccount.password)
            })
            await step('Verify welcome message and Log out link are visible', async () => {
                await expect(nav.getNameOfUserEl()).toBeVisible()
                await expect(nav.getNameOfUserEl()).toContainText(`Welcome ${SymbleAccount.userName}`)
                await expect(nav.getLogoutBtn()).toBeVisible()
            })
        })

        test('TC-LOG-010 Password field masks input', async ({ guessPage }) => {
            await allureId('TC-LOG-010')
            await description("Characters entered in the password field are displayed as dots/asterisks, not plain text.")
            await feature('Login')
            await story('Edge Case')

            const nav = new NavigationBar(guessPage)
            const login = new Login(guessPage)

            await step('Open home page', async () => {
                await guessPage.goto('/')
            })
            await step('Open login modal', async () => {
                await nav.clickLoginBtn()
            })
            await step("Verify password input type attribute is 'password'", async () => {
                await expect(login.getPasswordInput()).toHaveAttribute('type', 'password')
            })
        })

        test('TC-LOG-011 Login session persists after page refresh', async ({ userPage }) => {
            await allureId('TC-LOG-011')
            await description("After refresh, the user remains logged in and the nav bar still shows 'Welcome <username>'.")
            await feature('Login')
            await story('Edge Case')

            const nav = new NavigationBar(userPage)

            await step('Verify user is logged in before refresh', async () => {
                await expect(nav.getNameOfUserEl()).toBeVisible()
            })
            await step('Refresh the page', async () => {
                await userPage.reload()
            })
            await step('Verify user is still logged in after refresh', async () => {
                await expect(nav.getNameOfUserEl()).toBeVisible()
                const nameText = await nav.getNameOfUser()
                expect(nameText).toContain(`Welcome ${Account.userName}`)
            })
        })
    })
})
