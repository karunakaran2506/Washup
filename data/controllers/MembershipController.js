const Membership = require('../models/membership');
const CurrentMembership = require('../models/currentmembership');
const Transaction = require('../models/transactions');
const Admin = require('../models/admins');
const Customer = require('../models/customers');
const jwt = require('jsonwebtoken');
const secret = 'washup123';

const addMembershipPlan = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let addplan = await Membership.create({
                            name: req.body.name,
                            price: req.body.price,
                            points: req.body.points,
                            description: req.body.description,
                            isactive: true
                        })

                        resolve({ success: true, message: 'Membership plan has been added successfully' })
                    } catch (error) {
                        reject({ success: false, message: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No admin found' })
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

const viewMembershipPlansbyadmin = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let findPlans = await Membership.find()
                        resolve({ success: true, message: 'Success message', plans: findPlans })
                    } catch (error) {
                        reject({ success: false, message: 'Failure message', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No admin found' })
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
            res.send({ success: data.success, message: data.message, plans: data.plans });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}


const viewMembershipPlans = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let findPlans = await Membership.find({ isactive: 1 })
            resolve({ success: true, message: 'Success message', plans: findPlans })
        } catch (error) {
            reject({ success: false, message: 'Failure message', error: error.message })
        }
    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, plans: data.plans });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const updateMembershipplan = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        
                        let findPlan = await Membership.findOne({ _id: req.body.id })
                        
                        let action = !findPlan.isactive;
                        
                        let updatePlan = await Membership.updateOne({ _id: req.body.id }, {
                            $set: {
                                isactive: action
                            }
                        })
                        .then((data)=>{
                            resolve({ success: true, message: 'Membership plan has been updated successfully' })
                        })
                        
                    } 
                    catch (error) {
                        reject({ success: false, message: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No admin found' })
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

const subscribePlan = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        var balance;

        if (ValidParams) {
            try {
                let customerId = jwt.verify(req.headers.token, secret);

                let checkCustomer = await Customer.findOne({ _id: customerId.id })

                if (checkCustomer) {
                    try {

                        let findBalance = await CurrentMembership.findOne({ customer: customerId.id })
                            .then(async (data) => {
                                if (data) {
                                    if (data.isactive) {
                                        console.log(data);
                                        balance = data.balance + req.body.balance;
                                        let updatePlan = await CurrentMembership.updateOne({
                                            _id: data._id
                                        }, {
                                            $set: {
                                                plan: req.body.plan,
                                                balance: balance,
                                                isactive: 1
                                            }
                                        }
                                        )
                                        let addTransaction = await Transaction.create({
                                            customer: customerId.id,
                                            plan: req.body.plan,
                                            totalamount: req.body.amount,
                                            paymentstatus: req.body.paymentstatus,
                                            razorpay_payment_id: req.body.razorpay_payment_id,
                                            razorpay_order_id: req.body.razorpay_order_id,
                                            razorpay_signature: req.body.razorpay_signature
                                        })
                                    }
                                    else {
                                        balance = req.body.balance;
                                        let updatePlan = await CurrentMembership.updateOne({
                                            _id: data._id
                                        }, {
                                            $set: {
                                                plan: req.body.plan,
                                                balance: balance,
                                                isactive: 1
                                            }
                                        }
                                        )
                                        let addTransaction = await Transaction.create({
                                            customer: customerId.id,
                                            plan: req.body.plan,
                                            totalamount: req.body.amount,
                                            paymentstatus: req.body.paymentstatus,
                                            razorpay_payment_id: req.body.razorpay_payment_id,
                                            razorpay_order_id: req.body.razorpay_order_id,
                                            razorpay_signature: req.body.razorpay_signature
                                        })
                                    }
                                }
                                else {
                                    balance = req.body.balance;

                                    let subscribeplan = await CurrentMembership.create({
                                        customer: customerId.id,
                                        plan: req.body.plan,
                                        balance: balance,
                                        isactive: 1
                                    })

                                    let addTransaction = await Transaction.create({
                                        customer: customerId.id,
                                        plan: req.body.plan,
                                        totalamount: req.body.amount,
                                        paymentstatus: req.body.paymentstatus,
                                        razorpay_payment_id: req.body.razorpay_payment_id,
                                        razorpay_order_id: req.body.razorpay_order_id,
                                        razorpay_signature: req.body.razorpay_signature
                                    })
                                }
                            })

                        resolve({ success: true, message: 'Membership plan has been sucscribed successfully' })
                    } catch (error) {
                        reject({ success: false, message: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No admin found' })
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

const getCurrentPlan = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let customerId = jwt.verify(req.headers.token, secret)

                let checkCustomer = await Customer.findOne({ _id: customerId.id })

                if (checkCustomer) {
                    try {

                        let count = await CurrentMembership.find({ customer: customerId.id, isactive: 1 }).count()

                        if (count) {
                            let findBalance = await CurrentMembership.findOne({ customer: customerId.id, isactive: 1 }).populate('plan', 'name').sort({ created_at: -1 })
                            resolve({ success: true, message: 'Success message', currentplan: findBalance, count: count })
                        }
                        else {
                            reject({ success: false, message: 'No Membership found', count: 0, currentplan: {balance : 0} })
                        }

                    }
                    catch (error) {
                        reject({ success: false, message: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No admin found' })
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
            res.send({ success: data.success, message: data.message, currentplan: data.currentplan, count: data.count });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error, currentplan: error.currentplan, count: error.count });
        })

}

const editMembershipplan = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token && req.body.id;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        
                        let updatePlan = await Membership.updateOne({ _id: req.body.id }, {
                            $set: {
                                name: req.body.name,
                            price: req.body.price,
                            points: req.body.points,
                            description: req.body.description,
                            }
                        })
                        .then((data)=>{
                            resolve({ success: true, message: 'Membership plan has been edited successfully' })
                        })
                        
                    } 
                    catch (error) {
                        reject({ success: false, message: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No admin found' })
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

module.exports = {
    getCurrentPlan,
    subscribePlan,
    addMembershipPlan,
    viewMembershipPlansbyadmin,
    viewMembershipPlans,
    updateMembershipplan,
    editMembershipplan
}