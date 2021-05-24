const Orders = require('../models/orders');
const CartId = require('../models/cart');
const Admin = require('../models/admins');
var otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const secret = 'washup123';
const axios = require('axios');
const Cartitem = require('../models/cartitems');
const Setting = require('./../models/settings');

const CreateOrder = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {

            let customerId = await jwt.verify(req.body.customer, secret);

            if (customerId) {
                try {

                    // let findSetting = await Setting.find();

                    subtotal = 0;

                    subcharges = 0;

                    // subcharges = subcharges + findSetting[0].packaging_charge + findSetting[0].delivery_charge + findSetting[0].extra_charge;

                    let findCartItems = await Cartitem.find({ cartid: req.body.cartid })

                    for (let x = 0; x < findCartItems.length; x++) {
                        subtotal = subtotal + findCartItems[x].totalamount;
                    }

                    let totalamount = +subtotal + +subcharges;

                    let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                    let orderid = 'WUORD' + otp;

                    if (req.body.paymentmode == 'cashondelivery') {

                        let createorder = await Orders.create({
                            orderid: orderid,
                            cartid: req.body.cartid,
                            customer: customerId.id,
                            paymentmode: req.body.paymentmode,
                            paymentstatus: req.body.paymentstatus,
                            subtotal: subtotal,
                            subcharges: subcharges,
                            totalamount: totalamount,
                            createdat: new Date(),
                            orderstatus: 'Placed',
                            isactive: true
                        })

                        let updateCart = await CartId.updateOne({ _id: req.body.cartid }, {
                            $set: {
                                is_active: 0
                            }
                        })
                            .then((data) => {
                                console.log('cart has been inactivated')
                            })

                        let createcart = await CartId.create({
                            customer: customerId.id,
                            is_active: 1
                        }).then((data) => {
                            newcartid = data._id;
                        })
                        resolve({ success: true, message: 'Order completed successfully', cart: newcartid })
                    }
                    else {
                        if (req.body.razorpay_order_id) {

                            console.log('body data', req.body);

                            let createorder = await Orders.create({
                                orderid: orderid,
                                cartid: req.body.cartid,
                                customer: customerId.id,
                                paymentmode: req.body.paymentmode,
                                paymentstatus: req.body.paymentstatus,
                                subtotal: subtotal,
                                subcharges: subcharges,
                                totalamount: totalamount,
                                createdat: new Date(),
                                orderstatus: 'Placed',
                                isactive: true,
                                razorpay_payment_id: req.body.razorpay_payment_id,
                                razorpay_order_id: req.body.razorpay_order_id,
                                razorpay_signature: req.body.razorpay_signature,
                            })

                            let updateCart = CartId.updateOne({ _id: req.body.cartid }, {
                                $set: {
                                    is_active: 0
                                }
                            })
                                .then((data) => {
                                    console.log('cart has been inactivated')
                                })

                            let createcart = await CartId.create({
                                customer: customerId.id,
                                is_active: 1
                            }).then((data) => {
                                newcartid = data._id;
                            })
                            resolve({ success: true, message: 'Order completed successfully', cart: newcartid })

                        }
                        else {
                            reject({ success: false, message: 'Error while processing' })
                        }
                    }
                }
                catch (error) {
                    console.log('error',error);
                    reject({ success: false, message: 'Error while placing order', error : error })
                }
            }
            else {
                reject({ success: false, message: 'No customer found', error: error.message })
            }

        } catch (error) {
            reject({ success: false, message: 'Failure message', error: error.message })
        }

    });

    promise

    .then((data) => {
        console.log('Inside then : Success')
        res.send({ success: data.success, message: data.message, cart: data.cart });
    })
    .catch((error) => {
        console.log('Inside Catch : Failure', error);
        res.send({ success: error.success, message: error.message, error: error.error });
    })

}

const razorpay = async function (req, res) {

    let isValidParams = req.headers.token;

    console.log('body data', req.body);

    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
                let customerId = await jwt.verify(req.headers.token, secret)
                console.log('customerId', customerId)
                let checkCustomers = await Customers.find({ _id: customerId.id })
                if (checkCustomers) {

                    let findSetting = await Setting.find();

                    subtotal = 0;

                    subcharges = findSetting[0].packaging_charge + findSetting[0].delivery_charge + findSetting[0].extra_charge;

                    let findCartItems = await Cartitem.find({ cartid: req.body.cartid })

                    for (let x = 0; x < findCartItems.length; x++) {
                        subtotal = subtotal + findCartItems[x].totalamount;
                    }

                    let totalamount = +subtotal + +subcharges;

                    var amount = totalamount * 100;
                    var username = "rzp_test_AK9dlnT7OKZfAy";
                    var password = "TE5oj7nS0P7BzK8P4gnGIfn2";
                    var url = "https://api.razorpay.com/v1/orders?amount=" + amount + "&currency=INR&receipt=order_rcptid_11&payment_capture=1";

                    const result = await axios.post(url, {}, {
                        auth: {
                            username: username,
                            password: password
                        }
                    });
                    let obj = {
                        key: username,
                        currency: result.data.currency,
                        order_id: result.data.id,
                        amount: result.data.amount,
                        customer_email: checkCustomers[0].email,
                        customer_phone: checkCustomers[0].phone,
                        customer_name: checkCustomers[0].name
                    };
                    resolve({ success: true, razorpay: obj })
                }
                else {
                    reject({ success: false, message: 'No Customer found' })
                }
            }

        } catch (e) {
            reject({ success: false, message: 'Error occured while getting razorpay', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, razorpay: data.razorpay });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while getting razorpay' });
        });
}

const CustomerViewOrderDetails = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let userId = jwt.verify(req.headers.token, secret);

                let checkUser = await Customers.findOne({ _id: userId.id })

                if (checkUser) {
                    try {

                        let listItems = await Cartitem.find({ cartid: req.body.cartid })
                            .populate('product')

                        resolve({ success: true, message: 'Success message', items: listItems })
                    } catch (error) {
                        reject({ success: false, message: 'Error message' })
                    }
                }
                else {
                    reject({ success: false, message: 'No vendor found' })
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
            res.send({ success: data.success, message: data.message, data: data.items });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message });
        })

}

const UpdateOrder = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret);

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {

                        if (req.body.status == 'Cancelled') {
                            let updateOrder = await Orders.updateOne({ _id: req.body.orderid }, {
                                $set: {
                                    orderstatus: req.body.status,
                                    isactive: false
                                }
                            }).then(async (data) => {
                                let findOrder = await Orders.findOne({ _id: req.body.orderid })

                                console.log(findOrder);

                                let updatecart = await CartId.updateOne({ _id: findOrder.cartid }, {
                                    $set: {
                                        isactive: 0
                                    }
                                })

                                let findCustomer = await Customers.findOne({ _id: findOrder.customer })

                                console.log(findCustomer);
                                
                            })
                        }
                        else {
                            let updateOrder = await Orders.updateOne({ _id: req.body.orderid }, {
                                $set: {
                                    orderstatus: req.body.status
                                }
                            }).then(async (data) => {
                            })
                        }

                        resolve({ success: true, message: 'Order status has been updated successfully' })

                    } catch (error) {
                        reject({ success: false, message: 'Error while updating order status', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No vendor found' })
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
            console.log('Inside Catch : Failure', error);
            res.send({ success: error.success, message: error.message });
        })

}

const updatePayment = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret);

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {

                        let findOrder = await Orders.findOne({ _id: req.body.orderid })

                        let updateOrder = await Orders.updateOne({ _id: req.body.orderid }, {
                            $set: {
                                paymentstatus: 'Paid',
                                isactive: false
                            }
                        })

                        resolve({ success: true, message: 'Payment status has been updated successfully' })

                    } catch (error) {
                        reject({ success: false, message: 'Error while updating order status', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No vendor found' })
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
            console.log('Inside Catch : Failure', error);
            res.send({ success: error.success, message: error.message });
        })

}

const ListOrdersbyCustomer = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let userId = jwt.verify(req.headers.token, secret);

                let checkUser = await Customers.findOne({ _id: userId.id })

                if (checkUser) {
                    try {

                        let findOrders = await Orders.find({ customer: userId.id }).sort({ createdat: -1 })

                        resolve({ success: true, message: 'Success message', orders: findOrders })

                    }
                    catch (error) {
                        reject({ success: false, message: 'Error message' })
                    }
                }
                else {
                    reject({ success: false, message: 'No vendor found' })
                }
            }
            catch {
                reject({ success: false, message: 'Invalid token found', orders: data.orders })
            }
        }
        else {
            reject({ success: false, message: 'No valid token' })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, orders: data.orders });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message });
        })

}

module.exports = {
    CreateOrder,
    razorpay,
    UpdateOrder,
    CustomerViewOrderDetails,
    updatePayment,
    ListOrdersbyCustomer
}