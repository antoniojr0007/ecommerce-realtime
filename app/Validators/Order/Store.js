'use strict'

class OrderOrder {
    get rules() {
        return {
            items: 'array|required',
            'items.*.product_id': 'required|exists:products,id',
            'items.*.quantity': 'required|min:1'
        }
    }
}

module.exports = OrderOrder
