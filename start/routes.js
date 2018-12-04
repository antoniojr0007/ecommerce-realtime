'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Authentication Routes
Route.group(() => {
    Route.post('/register', 'AuthController.register')
        .as('auth.register')
        .validator('Clients/ClientRegister')

    Route.post('login', 'AuthController.login')
        .as('auth.login')
        .validator('Clients/ClientLogin')

    Route.post('refresh', 'AuthController.refresh')
        .as('auth.refresh')
        .validator('Clients/ClientRefreshToken')

    Route.post('logout', 'AuthController.logout')
        .as('auth.logout')
        .middleware(['auth'])
        .validator('Clients/ClientRefreshToken')
})
    .prefix('v1/auth')
    .namespace('Auth')

// Administration Routes
Route.group(() => {
    Route.resource('category', 'CategoryController')
        .apiOnly()
        .validator(
            new Map([
                [['category.store'], ['Category/Store']],
                [['category.update'], ['Category/Update']]
            ])
        )
    Route.resource('product', 'ProductController').apiOnly()
    Route.resource('coupon', 'CouponController').apiOnly()
    Route.resource('order', 'OrderController')
        .apiOnly()
        .validator(new Map([['order.store'], ['Order/Store']]))
    Route.resource('image', 'ImageController').apiOnly()
    Route.post('image/bulkUpload', 'ImageController.bulkUpload').as(
        'image.bulkUpload'
    )

    Route.resource('user', 'UserController')
        .apiOnly()
        .validator(
            new Map([
                [['user.store'], ['User/StoreUser']],
                [['user.update'], ['User/StoreUser']]
            ])
        )
})
    .prefix('v1/admin')
    .namespace('Admin')
    .middleware(['auth', 'is:(admin || manager)'])
