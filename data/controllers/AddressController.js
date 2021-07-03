const Address = require('../models/address');
const Customers = require('../models/customers');
const jwt = require('jsonwebtoken');
const secret = 'washup123';

//Add Address
const newAddress = async function (req, res) {
    let isValidParams = req.headers.token
    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
                let customerId = jwt.verify(req.headers.token, secret)
                console.log('customerId', customerId)
                let newAd = await Address.create({
                    customer: customerId.id,
                    address1: req.body.address1,
                    address2: req.body.address2,
                    area: req.body.area,
                    landmark: req.body.landmark,
                    city: req.body.city,
                    pincode: req.body.pincode,
                    is_active: 1
                })
                res.send({ success: true, message: "Successfully added Address", details: newAd })
            }
            else {
                reject({ success: false, message: "Please provide token" })
            }
        } catch (e) {
            console.log('Error in newAddress', e)
            reject({ success: false, message: 'Error occured while adding Address', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message, details: data.details });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while adding Address' });
        });
}


//delete Address
const deleteAddress = async function (req, res) {
    let isValidParams = req.body.addressId
    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
                let removeAddress = await Address.updateOne({ _id: req.body.addressId }, { $set: { is_active: 0 } }).then(() => {
                    resolve({ success: true, message: "Deleted successfully" });
                })
            }
            else {
                reject({ success: false, message: "Please provide addressId" })
            }
        } catch (e) {
            console.log('Error in deleteAddress', e)
            reject({ success: false, message: 'Error occured while deleting address', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message, address: data.address, customer: data.customer });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while deleting address' });
        });
}


// Address List
const viewAddress = async function (req, res) {
    let isValidParams = req.headers.token
    let promise = new Promise(async function (resolve, reject) {
        try {
           if (isValidParams) {
                let customerId = jwt.verify(req.headers.token, secret)
                let fetchAddress = await Address.find({ customer:customerId.id, is_active: 1 })
                resolve({address: fetchAddress })
            }
            else {
                reject({ success: false, message: "Please provide CustomerId and RestaurantId" })
            }
        } catch (e) {
            reject({ success: false, message: 'Error occured while fetching address', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message, address: data.address });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while fetching address' });
        });
}

module.exports = {
    newAddress,
    deleteAddress,
    viewAddress,
}