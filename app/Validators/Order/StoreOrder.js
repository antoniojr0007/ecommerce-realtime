'use strict'

class OrderStoreOrder {
    get rules() {
        return {
            user_id: 'required|exists:users,id',
            'items.0.product_id': 'required',
            'items.*.product_id': 'exists:products,id'
        }
    }
}

module.exports = OrderStoreOrder
