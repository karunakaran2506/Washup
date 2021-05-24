const Banner = require('./../models/banner')
const multer = require('multer');
const path = require('path');
var fs = require('fs');
const Admin = require('../models/admins');
const secret = 'washup123';
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/public/images/banner');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const uploadImg = multer({ storage: storage, fileFilter: fileFilter }).single('image');

const addBanner = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let isValidParams = req.headers.token;

        if (isValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let newBanner = await Banner.create({
                            image: req.file.path,
                            name: req.body.name
                        }).then(() => {
                            res.send({ success: true, message: 'Banner created successfully' })
                        })
                    } catch (e) {
                        console.log('Error in createBanner', e)
                        reject({ success: false, message: 'Error occured while creating new Banner', error: e })
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
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while creating new Banner' });
        });

}

const deleteBanner = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let isValidParams = req.headers.token;

        if (isValidParams) {
            try {
                if (isValidParams) {

                    await Banner.findOne({ _id: req.body.bannerId }).then((data) => {
                        fs.unlinkSync('./' + data.image);
                    })

                    await Banner.deleteOne({ _id: req.body.bannerId }).then(async () => {
                        resolve({ success: true, message: 'Banner deleted successfully' })
                    })
                }
                else {
                    reject({ success: false, message: "Please provide bannerId" })
                }
            } catch (e) {
                console.log('Error in deletebanner', e)
                reject({ success: false, message: 'Error occured while deleting banner', error: e })
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
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while deleting banner' });
        });

}


const viewBanners = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        try {
            let getbanner = await Banner.find({})
            resolve({ success: true, banner: getbanner })
        } catch (e) {
            console.log('Error in listbanner', e)
            reject({ success: false, message: 'Error occured while listing banner', error: e })
        }

    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message, banner: data.banner });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while listing banner' });
        });

}

module.exports = {
    addBanner,
    deleteBanner,
    viewBanners,
    uploadImg
}