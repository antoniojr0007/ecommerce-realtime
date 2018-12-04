'use strict'

const OrderHook = (exports = module.exports = {})

OrderHook.updateValues = async modelInstance => {
    if (!modelInstance.id) return
    modelInstance.subtotal = await modelInstance.items().getSum('subtotal')
    modelInstance.qty_items = await modelInstance.items().getSum('quantity')
    modelInstance.discount = await modelInstance.coupons().getSum('discount')
    modelInstance.total = modelInstance.subtotal - modelInstance.discount
}
