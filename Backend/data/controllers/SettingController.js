const Setting = require('./../models/settings');
const Admin = require('./../models/admins');
const jwt = require('jsonwebtoken');
const secret = 'washup123';
const Customers = require('../models/customers');

const editSetting = async function (req, res) {
    console.log(req.body);
    
    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let changeSizesName = await Setting.updateOne({ _id: req.body._id }, {
                            $set: {
                                extra_charge : req.body.extra_charge,
                                packaging_charge: req.body.packaging_charge,
                                delivery_charge: req.body.delivery_charge
                            }
                        })
                        resolve({ success: true, message: 'Success message' })
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

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while editing Setting' });
        });

}


const listSetting = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let getSetting = await Setting.find({})
                        resolve({ success: true, data: getSetting })
                    } catch (error) {
                        reject({ success: false, message: 'Error occured while listSetting', error: e })

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

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message, setting: data.data });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while listSetting' });
        });

}

const Getsettings = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let userId = jwt.verify(req.headers.token, secret)

                let checkUser = await Customers.findOne({ _id: userId.id })

                if (checkUser) {
                    try {
                        let getSetting = await Setting.find({})
                        resolve({ success: true, data: getSetting })
                    } catch (error) {
                        reject({ success: false, message: 'Error occured while listSetting', error: e })

                    }
                }
                else {
                    reject({ success: false, message: 'No user found' })
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

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message, settings: data.data });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while listSetting' });
        });

} 


module.exports = {
    editSetting,
    listSetting,
    Getsettings
}