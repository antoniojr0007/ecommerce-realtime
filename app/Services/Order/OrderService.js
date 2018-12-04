'use strict'
/**
 * Order Service
 *
 */
class OrderService {
    constructor(model, trx) {
        this.model = model
        this.trx = trx
    }

    async syncItems(items) {
        await this.model.items().delete()
        return await this.model.items().createMany(items, this.trx)
    }
}

module.exports = OrderService
