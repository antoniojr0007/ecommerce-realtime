'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const OrderTransformer = use('App/Transformers/Order/OrderTransformer')
const Order = use('App/Models/Order')
const Database = use('Database')
const OrderService = use('App/Services/Order/OrderService')

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
    async store({ request, response, transform }) {
        try {
            const { user_id, items } = request.all()
            const trx = await Database.beginTransaction()
            const order = await Order.create({ user_id }, trx)
            const service = new OrderService(order, trx)
            await service.syncItems(items)
            await trx.commit()
            return response
                .status(201)
                .send(await transform.item(order, OrderTransformer))
        } catch (error) {
            throw error
        }
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
