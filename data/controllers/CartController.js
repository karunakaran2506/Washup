const CartId = require('../models/cart');
const CartItem = require('../models/cartitems');
const jwt = require('jsonwebtoken');
const secret = 'washup123';
const Customers = require('../models/customers');

const AddtoCart = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let customerId = await jwt.verify(req.headers.token, secret);

        let subtotal = req.body.price * req.body.quantity;
        let subcharges = 0;
        let taxamount = 0;
        let totalamount = subcharges + taxamount + subtotal;

        try {

            let findItem = await CartItem.find({ cartid: req.body.cartid, product: req.body.product }).count();

            if (findItem > 0) {
                reject({ success: false, message: 'Product already added to cart' })
            }
            else {
                let addtocart = await CartItem.create({
                    quantity: req.body.quantity,
                    subcharges: subcharges,
                    taxamount: taxamount,
                    subtotal: subtotal,
                    totalamount: totalamount,
                    product: req.body.product,
                    customer: customerId.id,
                    cartid: req.body.cartid
                })

                resolve({ success: true, message: 'Added to cart successfully', item: addtocart })
            }

        } catch (error) {
            reject({ success: false, message: 'Error while adding to cart', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, item: data.item });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure', error);
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const Modifycartquantity = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        console.log(req.body);

        // main code
        let subtotal = req.body.price * req.body.quantity;
        let subcharges = 0;
        let taxamount = 0;
        let totalamount = subcharges + taxamount + subtotal;

        try {

            let modifycart = await CartItem.updateOne({ _id: req.body.id },
                {
                    $set: {
                        taxamount: taxamount,
                        subtotal: subtotal,
                        totalamount: totalamount,
                        quantity: req.body.quantity,
                    }
                })
                .then(() => {
                    resolve({ success: true, message: 'Cart item has been updated successfully' })
                })
        } catch (error) {
            reject({ success: false, message: 'Error while updating', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const Removecart = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        // main code
        try {

            let removecart = await CartItem.deleteOne({ _id: req.body.id })
                .then(async () => {

                    let getcartitems = await CartItem.find({cartid : req.headers.cartId}).count();

                    resolve({ success: true, message: 'Cart item has been removed successfully', cartcount : getcartitems})
                })
        } catch (error) {
            reject({ success: false, message: 'Failure message', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            console.log(data);
            res.send({ success: data.success, message: data.message, cartcount : data.cartcount });
        })
        .catch((error) => {
            console.log(error);
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const GetCartitem = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {

            let customerId = await jwt.verify(req.headers.token, secret);

            let findCart = await CartItem.find({ cartid: req.headers.cartid, customer: customerId.id })
                .populate('product')

            resolve({ success: true, message: 'Success message', cartitems: findCart})

        }

        catch (error) {
            reject({ success: false, message: 'Failure message', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, cartitems: data.cartitems });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure', error);
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const deleteCartItems = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let customerId = jwt.verify(req.headers.token, secret);

                let checkCustomer = await Customers.findOne({ _id: customerId.id })

                if (checkCustomer) {
                    try {
                        let deleteCart = await CartItem.deleteMany({ cartid: req.body.cartid })
                        resolve({ success: true, message: 'Cart items are removed successfully' })
                    } catch (error) {
                        reject({ success: false, message: 'Error while removing cart items', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No customer found' })
                }
            }
            catch {
                reject({ success: false, message: 'Invalid token found' })
            }
        }
        else {
            reject({ success: false, message: 'No valid token' })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const checkUser = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let customerId = jwt.verify(req.headers.token, secret);

                let checkCustomer = await Customers.findOne({ _id: customerId.id })

                if (checkCustomer) {
                    try { 

                        //checking whether cart is active or not

                        let checkcartid = await Cart.findOne({ _id: req.headers.cartid })

                        if(checkcartid.is_active){
                          
                          const cartId = checkcartid._id;

                          // checking whether the user have current item in their cart
                          
                          let checkCart = await CartItem.find({cartid : req.headers.cartid}).populate('product');

                          resolve({ success: true, message: 'User Cart is checked fully', cartId : cartId, cartitem : checkCart })

                        }

                        else{
                           let createcart = await Cart.create({
                                customer: customerId.id,
                                is_active: 1
                            }).then((data) => {
                                let checkCart = [];
                                const cartId = data._id;
                                console.log("cart created");
                                resolve({ success: true, message: 'User Cart is checked fully', cartId : cartId, cartitem : checkCart })
                            })
                        }

                    }

                    catch (error) {
                        reject({ success: false, message: 'Error while checking user cart', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No customer found' })
                }
            }
            catch {
                reject({ success: false, message: 'Invalid token found' })
            }
        }
        else {
            reject({ success: false, message: 'No valid token' })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, cartId : data.cartId, cartitem : data.cartitem });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}


module.exports = {
    AddtoCart,
    GetCartitem,
    Removecart,
    Modifycartquantity,
    deleteCartItems,
    checkUser
}