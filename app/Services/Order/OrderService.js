'use strict'

const OrderItem = use('App/Models/OrderItem')
const Product = use('App/Models/Product')

class OrderService {
    /**
     *
     * @param {App/Models/Order} model
     * @param {Transaction} trx
     */
    constructor(model, trx) {
        this.model = model
        this.trx = trx
    }

    /**
     *
     * Anexa os Produtos ao pedido
     *
     * @param {array} items list of products ids
     */
    async attachItems(items) {
        items.forEach(item => {
            let orderItem = await OrderItem.create(
                {
                    product_id: item.product_id,
                    quantity: item.quantity
                },
                this.trx
            )

            await this.model.items().attach([orderItem.id], null, this.trx)
        })
    }

    async applyDiscount(code) {}
}

module.exports = OrderService
