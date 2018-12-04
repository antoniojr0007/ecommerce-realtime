'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const OrderTransformer = use('App/Transformers/Order/OrderTransformer')
const Order = use('App/Models/Order')
const OrderService = use('App/Service/Order/OrderService')
const Database = use('Database')

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
    /**
     * Show a list of all orders.
     * GET orders
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ transform, response, pagination }) {
        const orders = await Order.query().paginate(
            pagination.page,
            pagination.perpage
        )

        return response.send(await transform.paginate(orders, OrderTransformer))
    }

    /**
     * Create/save a new order.
     * POST orders
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        const trx = await Database.beginTransaction()
        let data = request.all()
        const order = await Order.create({
            user_id: data.user_id
        })

        const service = new OrderService(order, trx)
        await service.attachItems(data.items)
    }

    /**
     * Display a single order.
     * GET orders/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, transform, response }) {
        const order = await Order.findOrFail(params.id)
        return response.send(await transform.item(order, OrderTransformer))
    }

    /**
     * Update order details.
     * PUT or PATCH orders/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a order with id.
     * DELETE orders/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = OrderController
