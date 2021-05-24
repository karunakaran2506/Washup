const Banner = require('./../models/bannersub')
const multer = require('multer');
const path = require('path');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/public/images/bannersub');
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

const addBannersub = async function (req, res) {
    console.log('createBanner', req.body)

    let promise = new Promise(async function (resolve, reject) {
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
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while creating new Banner' });
        });
}

const deleteBannersub = async function (req, res) {
    console.log('editBanner', req.body)


    let isValidParams = req.body.id

    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
               
                let removeBanner = await Banner.deleteOne({ _id: req.body.id }).then(async () => {
                    let findBanner = await Banner.findOne({ _id: req.body.id }).then((data) => {
                        fs.unlinkSync('./' + data.image);
                    });
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
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while deleting banner' });
        });
}


const viewBannersub = async function (req, res) {
    console.log('listbanner')
    let promise = new Promise(async function (resolve, reject) {
        try {
            let getbanner = await Banner.find({})
            getbanner.sort(function (a, b) {
                var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                // console.log('names-->>',nameA,nameB)
                if (nameA < nameB) //sort string ascending
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 //default return value (no sorting)
            })
            resolve({ success: true, banner: getbanner })
        } catch (e) {
            console.log('Error in listbanner', e)
            reject({ success: false, message: 'Error occured while listing category', error: e })
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
    addBannersub,
    deleteBannersub,
    viewBannersub,
    uploadImg,
}