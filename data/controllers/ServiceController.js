const Service = require('../models/service');
const Admin = require('../models/admins');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const secret = 'washup123';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/public/images/services');
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

const AddService = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let addservice = await Service.create({
                            name: req.body.name,
                            image: req.file.path
                        })
                        resolve({ success: true, message: 'Service has been added successfully' })
                    } catch (error) {
                        reject({ success: false, message: 'Error while adding service', error: error.message })
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
            console.log('Inside Catch : Failure', error);
            res.send({ success: error.success, message: error.message });
        })

}


const ViewService = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {
        // main code
        try {
            let viewservice = await Service.find({ isactive : 1 })
            resolve({ success: true, message: 'Success message', service: viewservice })
        } catch (error) {
            reject({ success: false, message: 'Failure message', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, service: data.service });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const ViewAllServices = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {
        // main code
        try {
            let viewservice = await Service.find({})
            resolve({ success: true, message: 'Success message', service: viewservice })
        } catch (error) {
            reject({ success: false, message: 'Failure message', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, service: data.service });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const UpdateService = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token && req.body.id;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let findService = await Service.findOne({ _id: req.body.id })

                        let action = !findService.isactive;

                        let updateService = await Service.updateOne({ _id: req.body.id }, {
                            $set: {
                                isactive: action
                            }
                        })

                        resolve({ success: true, message: 'Service updated successfully' })
                    } catch (error) {
                        reject({ success: false, message: 'Error while updating service', error: error.message })
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
            reject({ success: false, message: 'No valid data' })
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

module.exports = {
    uploadImg,
    AddService,
    ViewService,
    UpdateService,
    ViewAllServices
}