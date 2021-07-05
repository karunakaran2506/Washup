const Product = require('../models/product');
const CartItem = require('../models/cartitems');
const Admin = require('../models/admins');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const secret = 'washup123';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/public/images/products');
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

const AddProduct = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let addproduct = await Product.create({
                            name: req.body.name,
                            price: req.body.price,
                            category: req.body.category,
                            service: req.body.service,
                            image: req.file.path
                        })
                        resolve({ success: true, message: 'Product has been added successfully' })
                    } catch (error) {
                        reject({ success: false, message: 'Error while adding product', error: error.message })
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


const ViewProduct = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {
        // main code
        try {
            let viewproduct = await Product.find({ isactive: 1, service: req.body.service })
            resolve({ success: true, message: 'Success message', product: viewproduct })
        } catch (error) {
            reject({ success: false, message: 'Failure message', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, product: data.product });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const ViewAllProducts = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {
        // main code
        try {
            let viewproduct = await Product.find({}).populate('service', '_id name')
            resolve({ success: true, message: 'Success message', product: viewproduct })
        } catch (error) {
            reject({ success: false, message: 'Failure message', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, product: data.product });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const ViewProduct2 = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {
        // main code
        try {
            var result = [];
            let viewproduct = await Product.find({ isactive: 1, service: req.body.service })

                .then(async (data) => {

                    for (let i = 0; i < data.length; i++) {
                        let quantity = 0;
                        let cartid = '';
                        let findcartitem = await CartItem.findOne({ product: data[i]._id, cartid: req.headers.cartid })
                        if (findcartitem) {
                            cartid = findcartitem._id;
                            quantity = findcartitem.quantity;
                        }

                        let obj = {
                            cartid: cartid,
                            cartcount: quantity,
                            price: data[i].price,
                            category: data[i].category,
                            image: data[i].image,
                            name: data[i].name,
                            _id: data[i]._id
                        }
                        await result.push(obj);
                    }
                })
            resolve({ success: true, message: 'Success message', product: result })
        } catch (error) {
            reject({ success: false, message: 'Failure message', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, product: data.product });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const UpdateProduct = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token && req.body.id;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let findProduct = await Product.findOne({ _id: req.body.id })

                        let action = !findProduct.isactive;

                        let updateProduct = await Product.updateOne({ _id: req.body.id }, {
                            $set: {
                                isactive: action
                            }
                        })

                        resolve({ success: true, message: 'Product updated successfully' })
                    } catch (error) {
                        reject({ success: false, message: 'Error while updating Product', error: error.message })
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

const EditProduct = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token && req.body.id;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let editProduct = await Product.updateOne({ _id: req.body.id }, {
                            $set: {
                                name: req.body.name,
                                price: req.body.price,
                                category: req.body.category,
                                service: req.body.service,
                                image: req.file.path
                            }
                        })

                        resolve({ success: true, message: 'Product edited successfully' })
                    } catch (error) {
                        reject({ success: false, message: 'Error while editing Product', error: error.message })
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

const EditProductwithoutImage = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token && req.body.id;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let editProduct = await Product.updateOne({ _id: req.body.id }, {
                            $set: {
                                name: req.body.name,
                                price: req.body.price,
                                category: req.body.category,
                                service: req.body.service
                            }
                        })

                        resolve({ success: true, message: 'Product edited successfully' })
                    } catch (error) {
                        reject({ success: false, message: 'Error while editing Product', error: error.message })
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
    EditProduct,
    EditProductwithoutImage,
    AddProduct,
    ViewProduct,
    ViewProduct2,
    UpdateProduct,
    ViewAllProducts
}