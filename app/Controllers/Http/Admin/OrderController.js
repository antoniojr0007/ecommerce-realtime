'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const OrderTransformer = use('App/Transformers/Order/OrderTransformer')
const Order = use('App/Models/Order')
const Database = use('Database')
const OrderService = use('App/Services/Orders/OrderService')

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
        const trx = await Database.beginTransaction()
        try {
            const { user_id, items } = request.all()
            const order = await Order.create({ user_id }, trx)
            const service = new OrderService(order, trx)
            if (items) {
                await service.syncItems(items)
            }
            await trx.commit()
            let _order = await transform.item(order, OrderTransformer)
            return response.status(201).send({ order: _order })
        } catch (error) {
            await trx.rollback()
            return response.status(400).send({
                message: 'Não foi possível criar seu pedido no momento!'
            })
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
    async update({ params, request, response, transform }) {
        const order = await Order.findOrFail(params.id)
        const trx = await Database.beginTransaction()
        try {
            const { user_id, items, status } = request.all()
            order.merge({ user_id, status })
            const service = new OrderService(order, trx)
            await service.updateItems(items)
            await order.save(trx)
            await trx.commit()
            let _order = await transform.item(order, OrderTransformer)
            return response.send({ order: _order })
        } catch (error) {
            await trx.rollback()
            return response.status(400).send({
                message: 'Não foi possível atualizar este pedido!'
            })
        }
    }

    /**
     * Este método adiciona itens ao carrinho
     *
     * @param {Object} ctx
     */
    async incrementItem({ params, request, response, transform }) {
        const order = await Order.findOrFail(params.id)
        const { item } = request.all()
        const service = new OrderService(order)
        await service.incrementItem(item)
        return response.send(await transform.item(order, OrderTransformer))
    }

    async decrementItem({ params, request, response, transform }) {
        const order = await Order.findOrFail(params.id)
        const { item } = request.all()
        const service = new OrderService(order)
        await service.decrementItem(item)
        response.send(await transform.item(order, OrderTransformer))
    }

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
