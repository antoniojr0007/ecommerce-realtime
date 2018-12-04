'use strict'

class OrderOrder {
    get rules() {
        return {
            items: 'array|required',
            'items.*.product_id': 'required|integer|exists:products,id',
            'items.*.quantity': 'required|integer|min:1'
        }
    }
}

module.exports = OrderOrder
