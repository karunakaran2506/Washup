const Faq = require('./../models/faqs')
const Admin = require('./../models/admins')
const jwt = require('jsonwebtoken');
const secret = 'washup123';

const addFaq = async function (req, res) {
    console.log('addFaq', req.body);

    let isValidParams = req.headers.token

    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
                let adminId = jwt.verify(req.headers.token, secret)
                console.log('adminId', adminId)
                let checkAdmin = await Admin.findOne({ _id: adminId.id })
                if (checkAdmin) {
                    let createFaq = await Faq.create({
                        question: req.body.question,
                        answer: req.body.answer,
                    })
                    resolve({ success: true, message: "Faq added successfully" })

                } else {
                    reject({ success: false, message: 'Admin not found' })
                }
            }
            else {
                reject({ success: false, message: "Please provide Token" })
            }
        } catch (e) {
            console.log('Error in addFaq', e)
            reject({ success: false, message: 'Error occured while creating new Faq', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then');
            console.log(data);
            res.send({ success: data.success, message: data.message });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while creating new Faq' });
        });
}

const deleteFaq = async function (req, res) {

    let isValidParams = req.body.id

    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
                let removeFaq = await Faq.deleteOne({ _id: req.body.id }).then(() => {
                    resolve({ success: true, message: "Faq deleted successfully" })
                })
            }
            else {
                reject({ success: false, message: "Please provide id" })
            }
        } catch (e) {
            console.log('Error in deleteFaq', e)
            reject({ success: false, message: 'Error occured while deleting Faq', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while deleting Faq' });
        });
}

const listFaq = async function (req, res) {
    let promise = new Promise(async function (resolve, reject) {
        try {
            let getFaq = await Faq.find({})
            resolve({ success: true, data: getFaq })
        } catch (e) {
            console.log('Error in listFaq', e)
            reject({ success: false, message: 'Error occured while listFaq', error: e })
        }
    });
    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message, Faq: data.data });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while listFaq' });
        });
}

module.exports = {
    addFaq,
    deleteFaq,
    listFaq
}