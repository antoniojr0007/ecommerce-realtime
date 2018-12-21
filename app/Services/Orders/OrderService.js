'use stric'

class OrderService {
    constructor(modelInstance, trx = null) {
        this.model = modelInstance
        this.trx = trx
    }

    async syncItems(items) {
        await this.model.items().delete(this.trx)
        return await this.model.items().createMany(items, this.trx)
    }

    async updateItems(items) {
        let currentItems = await this.model
            .items()
            .whereIn('id', items.map(item => item.id))
            .fetch()
        await Promise.all(
            currentItems.rows.map(async item => {
                item.fill(items.filter(n => n.id === item.id)[0])
                await item.save(this.trx)
            })
        )
    }

    async incrementItem(item) {
        let orderItem = await this.model
            .items()
            .findBy('product_id', item.product_id)
        if (!orderItem) {
            return await this.model.items().create(item, this.trx)
        }
        orderItem.quantity += item.quantity
        return await orderItem.save(this.trx)
    }

    /**
     *
     * @param {OrderItem} item
     */
    async decrementItem(item) {
        let orderItem = await this.model
            .items()
            .findBy('product_id', item.product_id)

        /**
         * Caso o pedido não tenha nenhum produto com este id na lista
         * cria um novo item para tal produto
         */
        if (!orderItem) {
            return await this.model.items().create(item, this.trx)
        }

        /**
         * Caso a quantidade atual do item seja menor ou igual
         * a quantidade que o usuário quer diminuir, ele deletará o item da lista do pedido
         */
        if (orderItem.quantity <= item.quantity) {
            return await orderItem.delete(this.trx)
        }

        /**
         * Caso nenhuma das situações acima for verdadeira
         * devemos decrementar a quantidade desejada do nosso item
         */
        orderItem.quantity -= item.quantity
        return await orderItem.save(this.trx)
    }
}

module.exports = OrderService
