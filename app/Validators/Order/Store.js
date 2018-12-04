'use strict'

class OrderStore {
    get rules() {
        return {
            user_id: 'required|integer|exists:users,id',
            items: 'array|required',
            'items.*.product_id': 'required|integer|exists:products,id',
            'items.*.quantity': 'required|integer|min:1'
        }
    }
}

module.exports = OrderStore
