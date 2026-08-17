import { test, expect } from '../common/fixture'
import { allureId, description, feature, story, step } from 'allure-js-commons'
import NavigationBar from '../page/NavigationBar'
import HomePage from '../page/HomePage'
import ProductPage from '../page/ProductPage'
import CartPage from '../page/CartPage'
import PlaceOrderModal from '../page/PlaceOrderModal'
import OrderConfirmationModal from '../page/OrderConfirmationModal'

const ORDER_DATA = {
    name: 'John Doe',
    country: 'Viet Nam',
    city: 'Ha Noi',
    card: '1111111111111111',
    month: '08',
    year: '2026'
}

const parsePrice = (text: string): number => parseInt(text.trim().replace(/[^0-9]/g, '')) || 0

test.describe('Cart', () => {

    test.describe('Functional', () => {

        test('TC-CRT-001 Add to cart button present on product detail page', async ({ guessPage }) => {
            await allureId('TC-CRT-001')
            await description("The product detail page displays an 'Add to cart' button.")
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)

            await step('Navigate to home page and open any product', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
            })
            await step("Verify 'Add to cart' button is visible on the product detail page", async () => {
                await expect(productPage.getAddToCartBtn()).toBeVisible()
            })
        })

        test('TC-CRT-002 Browser alert shown after adding product to cart', async ({ guessPage }) => {
            await allureId('TC-CRT-002')
            await description("A browser alert appears with a confirmation message such as 'Product added'.")
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)

            await step('Navigate to home page and open any product', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
            })
            await step("Click 'Add to cart' and verify browser alert appears", async () => {
                const alertMessage = await productPage.addToCart()
                expect(alertMessage).toBe("Product added")
            })
        })

        test('TC-CRT-003 Added product appears in cart', async ({ guessPage }) => {
            await allureId('TC-CRT-003')
            await description('The product added is listed in the cart with its title and price.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Navigate to home page and open any product', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
            })
            await step('Add product to cart', async () => {
                await productPage.addToCart()
            })
            await step('Navigate to cart', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItem()
            })
            await step('Verify at least one product row is listed in the cart', async () => {
                expect(await cartPage.getRowCount()).toBeGreaterThan(0)
            })
        })

        test('TC-CRT-004 Cart shows correct product name', async ({ guessPage }) => {
            await allureId('TC-CRT-004')
            await description('The name in the cart exactly matches the product name shown on the product detail page.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            let productName = ''

            await step('Navigate to home page and open any product', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
            })
            await step('Record product name from detail page, then add to cart', async () => {
                productName = await productPage.getProductNameText()
                await productPage.addToCart()
            })
            await step('Navigate to cart', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItem()
            })
            await step('Verify cart shows the same product name', async () => {
                const cartName = await cartPage.getProductNameAtRow(0)
                expect(cartName.trim()).toBe(productName.trim())
            })
        })

        test('TC-CRT-005 Cart shows correct product price', async ({ guessPage }) => {
            await allureId('TC-CRT-005')
            await description('The price in the cart matches the price displayed on the product detail page.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            let productPrice = 0

            await step('Navigate to home page and open any product', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
            })
            await step('Record product price from detail page, then add to cart', async () => {
                const priceText = await productPage.getProductPriceText()
                productPrice = parsePrice(priceText)
                await productPage.addToCart()
            })
            await step('Navigate to cart', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItem()
            })
            await step('Verify cart price matches product detail page price', async () => {
                const cartPrice = parsePrice(await cartPage.getProductPriceAtRow(0))
                expect(cartPrice).toBe(productPrice)
            })
        })

        test('TC-CRT-006 Cart displays product thumbnail image', async ({ guessPage }) => {
            await allureId('TC-CRT-006')
            await description('A thumbnail image of the product is displayed in the cart row.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Navigate to home page and open any product', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
            })
            await step('Add product to cart', async () => {
                await productPage.addToCart()
            })
            await step('Navigate to cart', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItem()
            })
            await step('Verify thumbnail image is visible in the cart row', async () => {
                await expect(cartPage.getProductImageAtRow(0)).toBeVisible()
            })
        })

        test('TC-CRT-007 Delete button removes item from cart', async ({ guessPage }) => {
            await allureId('TC-CRT-007')
            await description('The item is removed from the cart. The cart table no longer shows the deleted product.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Navigate to home page, open any product and add to cart', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
            })
            await step('Navigate to cart and verify item is present', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItem()
                expect(await cartPage.getRowCount()).toBeGreaterThan(0)
            })
            await step("Click 'Delete' on the first item", async () => {
                await cartPage.deleteItemAtRow(0)
            })
            await step('Verify the item is no longer listed in the cart', async () => {
                await expect(cartPage.getCartRows().first()).not.toBeVisible()
            })
        })

        test('TC-CRT-008 Cart total updates after deleting an item', async ({ guessPage }) => {
            await allureId('TC-CRT-008')
            await description('The Total price decreases by the deleted item price and reflects the remaining items sum.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            let totalBefore = 0

            await step('Add two products to cart', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await homePage.navigate()
                await homePage.clickProductByIndex(1)
                await productPage.addToCart()
            })
            await step('Navigate to cart and record current total', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItems(2)
                totalBefore = parsePrice(await cartPage.getTotalText())
                expect(totalBefore).toBeGreaterThan(0)
            })
            await step('Delete the first item', async () => {
                const deletedPrice = parsePrice(await cartPage.getProductPriceAtRow(0))
                await cartPage.deleteItemAtRow(0)
                await cartPage.waitForItem()
                const totalAfter = parsePrice(await cartPage.getTotalText())
                expect(totalAfter).toBe(totalBefore - deletedPrice)
            })
        })

        test("TC-CRT-009 'Place Order' button opens order modal", async ({ guessPage }) => {
            await allureId('TC-CRT-009')
            await description("The Place Order modal opens with input fields and a 'Purchase' button.")
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)

            await step('Add a product to cart and navigate to cart', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
            })
            await step("Click 'Place Order' button", async () => {
                await cartPage.clickPlaceOrder()
            })
            await step('Verify the Place Order modal is visible', async () => {
                await orderModal.waitForModal()
                await expect(orderModal.getModal()).toBeVisible()
            })
        })

        test('TC-CRT-010 Order modal contains all required fields', async ({ guessPage }) => {
            await allureId('TC-CRT-010')
            await description('Modal contains: Name, Country, City, Credit Card, Month, Year fields and a Purchase button.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)

            await step('Add a product to cart, navigate to cart, click Place Order', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
                await cartPage.clickPlaceOrder()
                await orderModal.waitForModal()
            })
            await step('Verify all required form fields are visible', async () => {
                await expect(orderModal.getNameInput()).toBeVisible()
                await expect(orderModal.getCountryInput()).toBeVisible()
                await expect(orderModal.getCityInput()).toBeVisible()
                await expect(orderModal.getCardInput()).toBeVisible()
                await expect(orderModal.getMonthInput()).toBeVisible()
                await expect(orderModal.getYearInput()).toBeVisible()
                await expect(orderModal.getPurchaseBtn()).toBeVisible()
            })
        })

        test('TC-CRT-011 Successful order placement with all fields filled', async ({ guessPage }) => {
            await allureId('TC-CRT-011')
            await description('A success confirmation appears showing order details. The cart is cleared afterward.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)
            const confirmation = new OrderConfirmationModal(guessPage)

            await step('Add a product to cart and navigate to cart', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
            })
            await step('Open Place Order modal and fill all fields', async () => {
                await cartPage.clickPlaceOrder()
                await orderModal.waitForModal()
                await orderModal.fillOrderForm(
                    ORDER_DATA.name, ORDER_DATA.country, ORDER_DATA.city,
                    ORDER_DATA.card, ORDER_DATA.month, ORDER_DATA.year
                )
            })
            await step("Click 'Purchase' and verify order confirmation modal appears", async () => {
                await orderModal.clickPurchase()
                await confirmation.waitForModal()
                await expect(confirmation.getModal()).toBeVisible()
                await expect(confirmation.getTitle()).toContainText('Thank you')
            })
            await step('Dismiss confirmation', async () => {
                await confirmation.clickOk()
            })
        })

        test('TC-CRT-012 Order confirmation displays correct amount', async ({ guessPage }) => {
            await allureId('TC-CRT-012')
            await description('The confirmation shows the correct total amount matching the cart total.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)
            const confirmation = new OrderConfirmationModal(guessPage)

            let cartTotal = ''

            await step('Add a product to cart and record cart total', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
                cartTotal = await cartPage.getTotalText()
            })
            await step('Place the order with all fields filled', async () => {
                await cartPage.clickPlaceOrder()
                await orderModal.waitForModal()
                await orderModal.fillOrderForm(
                    ORDER_DATA.name, ORDER_DATA.country, ORDER_DATA.city,
                    ORDER_DATA.card, ORDER_DATA.month, ORDER_DATA.year
                )
                await orderModal.clickPurchase()
            })
            await step('Verify order confirmation modal is visible and shows the correct amount', async () => {
                await confirmation.waitForModal()
                await expect(confirmation.getBody()).toBeVisible()
                const confirmAmount = await confirmation.getAmount()
                expect(confirmAmount).toContain(cartTotal)
            })
            await step('Dismiss confirmation', async () => {
                await confirmation.clickOk()
            })
        })

        test('TC-CRT-013 Cart is empty after successful order placement', async ({ guessPage }) => {
            await allureId('TC-CRT-013')
            await description('After confirming the order, the cart is empty — no items listed, total shows 0.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)
            const confirmation = new OrderConfirmationModal(guessPage)

            await step('Add a product, place a full order and dismiss confirmation', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
                await cartPage.clickPlaceOrder()
                await orderModal.waitForModal()
                await orderModal.fillOrderForm(
                    ORDER_DATA.name, ORDER_DATA.country, ORDER_DATA.city,
                    ORDER_DATA.card, ORDER_DATA.month, ORDER_DATA.year
                )
                await orderModal.clickPurchase()
                await confirmation.waitForModal()
                await expect(confirmation.getModal()).toBeVisible()
                await confirmation.clickOk()
            })
            await step('Navigate back to cart and verify it is empty', async () => {
                await cartPage.navigate()
                await expect(cartPage.getCartRows().first()).not.toBeVisible()
            })
        })

        test('TC-CRT-014 Multiple different products can be added to cart', async ({ guessPage }) => {
            await allureId('TC-CRT-014')
            await description('Cart shows both product A and product B as separate line items.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Add the first product to cart', async () => {
                await homePage.navigate()
                await homePage.clickProductByIndex(0)
                await productPage.addToCart()
            })
            await step('Go back to home and add a second different product', async () => {
                await homePage.navigate()
                await homePage.clickProductByIndex(1)
                await productPage.addToCart()
            })
            await step('Navigate to cart and verify two separate items are listed', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItems(2)
                expect(await cartPage.getRowCount()).toBe(2)
            })
        })

        test('TC-CRT-015 Cart total equals sum of all item prices', async ({ guessPage }) => {
            await allureId('TC-CRT-015')
            await description('The Total displayed equals the arithmetic sum of all individual item prices.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Add two different products to cart', async () => {
                await homePage.navigate()
                await homePage.clickProductByIndex(0)
                await productPage.addToCart()
                await homePage.navigate()
                await homePage.clickProductByIndex(1)
                await productPage.addToCart()
            })
            await step('Navigate to cart', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItems(2)
            })
            await step('Verify displayed total equals sum of individual prices', async () => {
                const rowCount = await cartPage.getRowCount()
                let sumOfPrices = 0
                for (let i = 0; i < rowCount; i++) {
                    sumOfPrices += parsePrice(await cartPage.getProductPriceAtRow(i))
                }
                const displayedTotal = parsePrice(await cartPage.getTotalText())
                expect(displayedTotal).toBe(sumOfPrices)
            })
        })

        test('TC-CRT-016 Cart accessible without login (guest user)', async ({ guessPage }) => {
            await allureId('TC-CRT-016')
            await description('Guest user can add items to cart and view the cart page without being required to log in.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Without logging in, navigate to home page and add a product to cart', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
            })
            await step('Click Cart in the navigation', async () => {
                await nav.clickCartBtn()
            })
            await step('Verify guest can view the cart page and item is listed', async () => {
                await expect(guessPage).toHaveURL(/cart\.html/)
                await cartPage.waitForItem()
                expect(await cartPage.getRowCount()).toBeGreaterThan(0)
            })
        })

        test('TC-CRT-017 Cart persists on navigation for logged-in user', async ({ userPage }) => {
            await allureId('TC-CRT-017')
            await description('Items added before navigation are still present in the cart after navigating away and back.')
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(userPage)
            const productPage = new ProductPage(userPage)
            const nav = new NavigationBar(userPage)
            const cartPage = new CartPage(userPage)

            await step('Add a product to cart while logged in', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
            })
            await step("Navigate away to 'Home'", async () => {
                await homePage.navigate()
            })
            await step("Navigate back to 'Cart'", async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItem()
            })
            await step('Verify items added before navigation are still present', async () => {
                expect(await cartPage.getRowCount()).toBeGreaterThan(0)
            })
        })

        test("TC-CRT-018 Place Order modal can be closed via X button", async ({ guessPage }) => {
            await allureId('TC-CRT-018')
            await description("Modal closes. Cart contents are unchanged. No order is placed.")
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)

            await step('Add a product, navigate to cart, open Place Order modal', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
                await cartPage.clickPlaceOrder()
                await orderModal.waitForModal()
            })
            await step("Click the X button in the modal header", async () => {
                await orderModal.clickXBtn()
            })
            await step('Verify modal is closed and cart items are unchanged', async () => {
                await expect(orderModal.getModal()).not.toBeVisible()
                expect(await cartPage.getRowCount()).toBeGreaterThan(0)
            })
        })

        test("TC-CRT-019 Place Order modal can be closed via Close button", async ({ guessPage }) => {
            await allureId('TC-CRT-019')
            await description("Modal closes. Cart contents are unchanged. No order is placed.")
            await feature('Cart')
            await story('Functional')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)

            await step('Add a product, navigate to cart, open Place Order modal', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
                await cartPage.clickPlaceOrder()
                await orderModal.waitForModal()
            })
            await step("Click the 'Close' button in the modal footer", async () => {
                await orderModal.clickCloseBtn()
            })
            await step('Verify modal is closed and cart items are unchanged', async () => {
                await expect(orderModal.getModal()).not.toBeVisible()
                expect(await cartPage.getRowCount()).toBeGreaterThan(0)
            })
        })
    })

    test.describe('Edge Case', () => {

        test('TC-CRT-020 Add the same product to cart twice', async ({ guessPage }) => {
            await allureId('TC-CRT-020')
            await description('Cart shows product X twice as separate rows. Total reflects both units.')
            await feature('Cart')
            await story('Edge Case')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Navigate to a product and add it to cart twice', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await productPage.addToCart()
            })
            await step('Navigate to cart', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItems(2)
            })
            await step('Verify product appears twice and total is doubled', async () => {
                expect(await cartPage.getRowCount()).toBe(2)
                const price0 = parsePrice(await cartPage.getProductPriceAtRow(0))
                const price1 = parsePrice(await cartPage.getProductPriceAtRow(1))
                const total = parsePrice(await cartPage.getTotalText())
                expect(total).toBe(price0 + price1)
            })
        })

        test('TC-CRT-021 Add products from all available categories', async ({ guessPage }) => {
            await allureId('TC-CRT-021')
            await description('All three products from Phones, Laptops, and Monitors appear in the cart.')
            await feature('Cart')
            await story('Edge Case')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Navigate to Phones category and add one product', async () => {
                await homePage.navigate()
                await homePage.clickPhones()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
            })
            await step('Navigate to Laptops category and add one product', async () => {
                await homePage.navigate()
                await homePage.clickLaptops()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
            })
            await step('Navigate to Monitors category and add one product', async () => {
                await homePage.navigate()
                await homePage.clickMonitors()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
            })
            await step('Navigate to cart and verify three products from all categories are listed', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItems(3)
                expect(await cartPage.getRowCount()).toBe(3)
            })
        })

        test('TC-CRT-022 Delete all items from cart one by one', async ({ guessPage }) => {
            await allureId('TC-CRT-022')
            await description('After each deletion the item disappears. After the last deletion, the cart is empty and total shows 0.')
            await feature('Cart')
            await story('Edge Case')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Add two products to cart', async () => {
                await homePage.navigate()
                await homePage.clickProductByIndex(0)
                await productPage.addToCart()
                await homePage.navigate()
                await homePage.clickProductByIndex(1)
                await productPage.addToCart()
            })
            await step('Navigate to cart', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItems(2)
            })
            await step('Delete first item and verify it disappears', async () => {
                const countBefore = await cartPage.getRowCount()
                await cartPage.deleteItemAtRow(0)
                await cartPage.waitForItem()
                expect(await cartPage.getRowCount()).toBe(countBefore - 1)
            })
            await step('Delete remaining item and verify cart is empty', async () => {
                await cartPage.deleteItemAtRow(0)
                await cartPage.ready()
                await expect(cartPage.getCartRows().first()).not.toBeVisible()
            })
        })

        test('TC-CRT-023 Place order with only Name and Credit Card filled', async ({ guessPage }) => {
            await allureId('TC-CRT-023')
            await description('System either accepts the order or shows a clear validation error. No crash occurs.')
            await feature('Cart')
            await story('Edge Case')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)
            const confirmation = new OrderConfirmationModal(guessPage)

            await step('Add a product and open Place Order modal', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
                await cartPage.clickPlaceOrder()
                await orderModal.waitForModal()
            })
            await step('Fill only Name and Credit Card, leave other fields blank', async () => {
                await orderModal.getNameInput().fill(ORDER_DATA.name)
                await orderModal.getCardInput().fill(ORDER_DATA.card)
            })
            await step('Click Purchase and verify system responds gracefully', async () => {
                const dialogPromise = guessPage.waitForEvent('dialog', { timeout: 4000 }).catch(() => null)
                await orderModal.clickPurchase()
                const dialog = await dialogPromise
                if (dialog) {
                    expect(dialog.message()).toBeTruthy()
                    await dialog.accept()
                } else {
                    await confirmation.waitForModal()
                    await expect(confirmation.getModal()).toBeVisible()
                    await confirmation.clickOk()
                }
            })
        })

        test('TC-CRT-024 Place order with very long Name input (100+ chars)', async ({ guessPage }) => {
            await allureId('TC-CRT-024')
            await description('Order is placed successfully or system shows a graceful validation error. No crash.')
            await feature('Cart')
            await story('Edge Case')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)
            const confirmation = new OrderConfirmationModal(guessPage)

            const longName = 'A'.repeat(105)

            await step('Add a product and open Place Order modal', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
                await cartPage.clickPlaceOrder()
                await orderModal.waitForModal()
            })
            await step('Fill all fields with a 105-character name', async () => {
                await orderModal.fillOrderForm(
                    longName, ORDER_DATA.country, ORDER_DATA.city,
                    ORDER_DATA.card, ORDER_DATA.month, ORDER_DATA.year
                )
            })
            await step('Click Purchase and verify order confirmation modal appears without any crash', async () => {
                await orderModal.clickPurchase()
                await confirmation.waitForModal()
                await expect(confirmation.getModal()).toBeVisible()
                await confirmation.clickOk()
            })
        })

        test('TC-CRT-025 Place order with special characters in Name field', async ({ guessPage }) => {
            await allureId('TC-CRT-025')
            await description('Order is placed. Confirmation displays the name with special characters rendered correctly.')
            await feature('Cart')
            await story('Edge Case')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)
            const orderModal = new PlaceOrderModal(guessPage)
            const confirmation = new OrderConfirmationModal(guessPage)

            const specialName = 'José García & Co.'

            await step('Add a product and open Place Order modal', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                await productPage.addToCart()
                await nav.clickCartBtn()
                await cartPage.waitForItem()
                await cartPage.clickPlaceOrder()
                await orderModal.waitForModal()
            })
            await step("Fill all fields with special character name 'José García & Co.'", async () => {
                await orderModal.fillOrderForm(
                    specialName, ORDER_DATA.country, ORDER_DATA.city,
                    ORDER_DATA.card, ORDER_DATA.month, ORDER_DATA.year
                )
            })
            await step('Click Purchase and verify order confirmation modal appears', async () => {
                await orderModal.clickPurchase()
                await confirmation.waitForModal()
                await expect(confirmation.getModal()).toBeVisible()
                await expect(confirmation.getTitle()).toContainText('Thank you')
            })
            await step('Verify confirmation body contains the name with special characters, then dismiss', async () => {
                const confirmedName = await confirmation.getName()
                expect(confirmedName).toContain(specialName)
                await confirmation.clickOk()
            })
        })

        test('TC-CRT-026 Cart total with large number of items (8+ items)', async ({ guessPage }) => {
            await allureId('TC-CRT-026')
            await description('All 8 items are listed. Total equals sum of items. No UI overflow or display issues.')
            await feature('Cart')
            await story('Edge Case')

            const homePage = new HomePage(guessPage)
            const productPage = new ProductPage(guessPage)
            const nav = new NavigationBar(guessPage)
            const cartPage = new CartPage(guessPage)

            await step('Navigate to a product and add it to cart 8 times', async () => {
                await homePage.navigate()
                await homePage.clickFirstProduct()
                for (let i = 0; i < 8; i++) {
                    await productPage.addToCart()
                }
            })
            await step('Navigate to cart', async () => {
                await nav.clickCartBtn()
                await cartPage.waitForItems(8)
            })
            await step('Verify 8 rows are listed and total equals sum of all prices', async () => {
                expect(await cartPage.getRowCount()).toBe(8)
                let sumOfPrices = 0
                for (let i = 0; i < 8; i++) {
                    sumOfPrices += parsePrice(await cartPage.getProductPriceAtRow(i))
                }
                const displayedTotal = parsePrice(await cartPage.getTotalText())
                expect(displayedTotal).toBe(sumOfPrices)
                await expect(cartPage.getTotalPrice()).toBeVisible()
            })
        })
    })
})
