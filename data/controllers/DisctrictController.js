const District = require('./../models/districts')
const multer = require('multer');
const path = require('path');
var fs = require('fs');
const Admin = require('../models/admins');
const secret = 'washup123';
const jwt = require('jsonwebtoken');

const addDistrict = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let isValidParams = req.headers.token;

        if (isValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let newDistrict = await District.create({
                            name: req.body.name
                        }).then(() => {
                            res.send({ success: true, message: 'District created successfully' })
                        })
                    } catch (e) {
                        reject({ success: false, message: 'Error occured while adding new district', error: e })
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

        .then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message : error.message});
        });

}

const deleteDistrict = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token && req.body.district;

        if (ValidParams) {
            try{
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })
                
                if (checkAdmin) {
                    try {
                    await District.deleteOne({ _id: req.body.district }).then(async () => {
                        resolve({ success: true, message: 'District deleted successfully' })
                    })

                    } catch (error) {
                        reject({ success: false, message: 'Failure message', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No admin found' })
                }
            }
            catch{
                reject({ success: false, message: 'Invalid token found' })
            }
        }
        else {
            reject({ success: false, message: 'Provide all valid data' })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message});
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}



const viewDistricts = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let getDistricts = await District.find({})
            resolve({ success: true, districts: getDistricts })
        } catch (e) {
            reject({ success: false, message: 'Error occured while listing districts', error: e })
        }

    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message, districts: data.districts });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error.message});
        });

}

module.exports = {
    addDistrict,
    deleteDistrict,
    viewDistricts
}