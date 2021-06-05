const Customers = require('../models/customers');
const Cart = require('../models/cart');
const otpGenerator = require('otp-generator');
const axios = require('axios');
const Admin = require('../models/admins');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(8);
const jwt = require('jsonwebtoken');
const secret = 'washup123';

const UserLogin = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let validParams = req.body.phone && req.body.password;

        // main code
        try {
            if (validParams) {
                // to check whether user exist
                const findUser = await Customers.findOne({ phone: req.body.phone });

                if (findUser) {

                    // compare the password using bcrypt and 
                    let passwordCheck = await bcrypt.compareSync(req.body.password, findUser.password);

                    console.log(passwordCheck);

                    if (passwordCheck) {
                        let token = await jwt.sign({ id: findUser.id }, secret, { expiresIn: '30d' })

                        const cart = await Cart.findOne({ customer: findUser.id, is_active: 1 })
                        if (cart) {
                            resolve({ success: true, customer: findUser, token: token, cart: cart._id })
                        }
                        else {
                            let createcart = await Cart.create({
                                customer: findUser.id,
                                is_active: 1
                            }).then((data) => {
                                const cartId = data._id;
                                resolve({ success: true, customer: findUser, token: token, cart: cartId })
                                console.log("cart created");
                            })
                        }
                    }
                    else {
                        reject({ success: false, message: 'Password doesnt match' })
                    }
                }

                else {
                    reject({ success: false, message: 'User doesnt exist' });
                }
            }
            else {
                reject({ success: false, message: 'Provide Valid data' })
            }
        } catch (error) {
            console.log('error', error);
            reject({ success: false, message: 'Failure message', error: error.message })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, customer: data.customer, token: data.token, cart: data.cart });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error });
        })

}

const UserSignUp = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        // main code
        try {

            let findUser = await Customers.findOne({ phone: req.body.phone })

            if (findUser) {
                reject({ success: false, message: 'User already exist' })
            }

            else {

                let hashedPassword = bcrypt.hashSync(req.body.password, salt)
                let createUser = await Customers.create({
                    name: req.body.name,
                    email: req.body.email,
                    customertypeinfo1: req.body.customertypeinfo1,
                    customertypeinfo2: req.body.customertypeinfo2,
                    customertype: req.body.customertype,
                    phone: req.body.phone,
                    password: hashedPassword
                }).then(async (data) => {
                    let otp = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false })

                    let updateOtp = await Customers.updateOne({ _id: data.id }, {
                        $set: {
                            otp: otp
                        }
                    }).then(async () => {

                        var messagecontent = `Dear Customer, Your OTP for Washup Sign up verification is ${otp}.`;

                        let url = `http://websms.bulksmsdaddy.com/vendorsms/pushsms.aspx?user=hellowcart&password=AUDI@9999&msisdn=91${req.body.phone}&sid=ISDTPL&msg=${messagecontent}&fl=0&gwid=2`;

                        const result = await axios.get(url, {}, {});

                        console.log('Customer otp updated succesfully ')
                    })
                })

                resolve({ success: true, message: 'User created successfully', data: createUser })
            }

            // if()

        } catch (error) {
            reject({ success: false, message: 'Error while signing up ', error: error.message })
        }

    });

    promise

        .then(function (data) {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message });
        })
        .catch(function (error) {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message });
        })

}

const checkUser = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        // main code
        try {
            let findUser = await Customers.find({ phone: req.body.phone }).count()
            if (findUser == 0) {
                resolve({ success: false, message: 'User not found', count: findUser })
            }
            else {
                resolve({ success: true, message: 'User found', count: findUser })
            }
        } catch (error) {
            reject({ success: false, message: 'Error while finding user', error: error.message, count: 0 })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, count: data.count });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error, count: error.count });
        })

}

const viewUsers = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let getUsers = await Customers.find({});
                        resolve({ success: true, message: 'Success message', users: getUsers })

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
            res.send({ success: data.success, message: data.message, users: data.users });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const countUsers = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })

                if (checkAdmin) {
                    try {
                        let userCount = await Customers.find({}).count()
                        resolve({ success: true, message: 'Success message', count: userCount })
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
            res.send({ success: data.success, message: data.message, count: data.count });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const sendnotificationtoall = async function (req, res) {
    var sendNotification = function (data) {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic NzVkZDI1Y2QtZWZmYS00OWEzLThhNWMtOTFhMGE1ZTk3ZTAx"
        };

        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };

        var https = require('https');
        var req = https.request(options, function (res) {
            res.on('data', function (data) {
                console.log("Response:");
                console.log(JSON.parse(data));
            });
        });

        req.on('error', function (e) {
            console.log("ERROR:");
            console.log(e);
        });

        req.write(JSON.stringify(data));
        req.end();
    };

    var message = {
        app_id: "fc339205-4f26-4d54-8293-82b0a5d95bd8",
        android_channel_id : "2a812a1e-f315-4fd9-a891-c2dbd4ea3a93",
        headings : {"en": "Hellow Cart"},
        contents: { "en": req.body.message },
        included_segments: ["All"]
    };

    sendNotification(message);
    res.send({ message: "Notification send successfully" })
}


const sendnotificationtouser = async function (req, res) {
    var sendNotification = function (data) {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic NzVkZDI1Y2QtZWZmYS00OWEzLThhNWMtOTFhMGE1ZTk3ZTAx"
        };

        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };

        var https = require('https');
        var req = https.request(options, function (res) {
            res.on('data', function (data) {
                console.log("Response:");
                console.log(JSON.parse(data));
            });
        });

        req.on('error', function (e) {
            console.log("ERROR:");
            console.log(e);
        });

        req.write(JSON.stringify(data));
        req.end();
    };

    var message = {
        app_id: "fc339205-4f26-4d54-8293-82b0a5d95bd8",
        headings : {"en": "Hellow Cart"},
        contents: { "en": req.body.message },
        android_channel_id : "2a812a1e-f315-4fd9-a891-c2dbd4ea3a93",
        include_player_ids: [req.body.player_id]
    };

    sendNotification(message);
    res.send({ message: "Notification send successfully" })
}

const saveplayerid = async function (req, res) {
    console.log('body', req.body)


    let isValidParams = req.headers.token

    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
                let customerId = jwt.verify(req.headers.token, secret)
                console.log('customerId', customerId)
                let checkCustomers = await Customers.findOne({ _id: customerId.id })
                if (checkCustomers) {
                    let updateCustomer = await Customers.updateOne({ _id: customerId.id }, {
                        $set: {
                            player_id: req.body.player_id
                        }
                    }).then(() => {
                        resolve({ success: true, message: 'player id for onesignal added successfully' })
                    })
                }
            }
            else {
                reject({ success: false, message: "Please provide customerId" })
            }
        } catch (e) {
            console.log('Error in player_id', e)
            reject({ success: false, message: 'Error occured while adding player_id', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while fetching wishlist' });
        });
}

/*
Dummy function use this as template

const functionName = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try{
                let adminId = jwt.verify(req.headers.token, secret)

                let checkAdmin = await Admin.findOne({ _id: adminId.id })
                
                if (checkAdmin) {
                    try {
                        resolve({ success: true, message: 'Success message' })
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
            reject({ success: false, message: 'No valid token' })
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
*/

const verifyOtp = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.body.phone;

        if (ValidParams) {
            
            try {

                let checkUser = await Customers.findOne({ phone : req.body.phone })

                if (checkUser) {
                    try {
                        if(req.body.otp === checkUser.forgetotp){
                            resolve({ success : true, message : 'OTP Verified successfully'})
                        }
                        else{
                            reject({ success : false, message : 'Invalid OTP'})
                        }                        
                    }

                    catch (error) {
                        reject({ success: false, message: 'Error while verifying OTP', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No User found' })
                }
            }
            catch {
                reject({ success: false, message: 'Errow while verifying OTP' })
            }
        }
        else {
            reject({ success: false, message: 'Provide all valida data' })
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

const changePassword = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.body.phone;

        if (ValidParams) {
            
            try {

                let checkUser = await Customers.findOne({ phone : req.body.phone })

                if (checkUser) {
                    
                    try {

                        let hashedPassword = bcrypt.hashSync(req.body.password, salt)

                        let changePassword = await Customers.updateOne({ phone : req.body.phone},{
                            $set : {
                                password: hashedPassword
                            }
                        })
                        resolve({ success: true, message: 'Password has been changed successfully' })                        
                    }

                    catch (error) {
                        reject({ success: false, message: 'Error while changing password', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No User found' })
                }
            }
            catch {
                reject({ success: false, message: 'Errow while verifying OTP' })
            }
        }
        else {
            reject({ success: false, message: 'Provide all valida data' })
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

//sending otp to customer for reset password
const checkUserOtp = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        // main code
        try {
            let findUser = await Customers.find({ phone: req.body.phone }).count()
            if (findUser == 0) {

                reject({ success: false, message: 'User not found', count: findUser })
            }
            else {
                
                let otp = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false });

                var messagecontent = `Dear Customer, Your OTP for the request to change the password is ${otp}`;

                let url = `http://websms.bulksmsdaddy.com/vendorsms/pushsms.aspx?user=hellowcart&password=AUDI@9999&msisdn=91${req.body.phone}&sid=ISDTPL&msg=${messagecontent}&fl=0&gwid=2`;

                const result = await axios.get(url, {}, {});

                let updateOtp = await Customers.updateOne({phone : req.body.phone},{
                    $set : {
                        forgetotp : otp
                    }
                })

                resolve({ success: true, message: 'User found', count: findUser })
            }
        } catch (error) {
            reject({ success: false, message: 'Error while finding user', error: error.message, count: 0 })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message, count: data.count });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error, count: error.count });
        })

}

const sendSignupOtp = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.body.phone;

        if (ValidParams) {
            
            try {

                let checkUser = await Customers.findOne({ phone : req.body.phone })

                if (checkUser) {
                        
                        var messagecontent = `Dear Customer, Your OTP for Hellow Cart User verification is ${checkUser.otp}.`;

                        let url = `http://websms.bulksmsdaddy.com/vendorsms/pushsms.aspx?user=hellowcart&password=AUDI@9999&msisdn=91${checkUser.phone}&sid=ISDTPL&msg=${messagecontent}&fl=0&gwid=2`;

                        const result = await axios.get(url, {}, {});
                        
                        resolve({ success : true, message : 'OTP sent successfully'})
                }
                else {
                    reject({ success: false, message: 'No User found' })
                }
            }
            catch {
                reject({ success: false, message: 'Errow while sending OTP' })
            }
        }
        else {
            reject({ success: false, message: 'Provide all valid data' })
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

const verifysignupOtp = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.body.phone;

        if (ValidParams) {
            
            try {

                let checkUser = await Customers.findOne({ phone : req.body.phone })

                if (checkUser) {
                    try {
                        if(req.body.otp === checkUser.otp){
                            let updateuser = await Customers.updateOne({phone : req.body.phone},{
                                $set : {
                                    isverified : 1   
                                }
                            })
                            resolve({ success : true, message : 'User Verified successfully'})
                        }
                        else{
                            reject({ success : false, message : 'Invalid OTP'})
                        }                        
                    }

                    catch (error) {
                        reject({ success: false, message: 'Error while verifying OTP', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No User found' })
                }
            }
            catch {
                reject({ success: false, message: 'Errow while verifying OTP' })
            }
        }
        else {
            reject({ success: false, message: 'Provide all valida data' })
        }

    });

    promise

        .then((data) => {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure', error);
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const getUserdetail = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.headers.token;

        if (ValidParams) {
            try {
                let customerId = jwt.verify(req.headers.token, secret)

                let checkCustomer = await Customers.findOne({ _id: customerId.id })

                if (checkCustomer) {
                    try {
                        let userdetail = await Customers.findOne({ _id: customerId.id });
                        resolve({ success: true, message: 'Success message', data: userdetail })

                    } catch (error) {
                        reject({ success: false, message: 'Failure message', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No customer found' })
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
            res.send({ success: data.success, message: data.message, data: data.data });
        })
        .catch((error) => {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message, error: error.error });
        })

}

const Editprofile = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

    let ValidParams = req.headers.token;

        if (ValidParams) {
        try {

                let customerId = jwt.verify(req.headers.token, secret)

                let editUser = await Customers.updateOne({_id:customerId.id},{
                $set : {
                    name: req.body.name,
                    email: req.body.email,
                    customertypeinfo1: req.body.customertypeinfo1,
                    customertypeinfo2: req.body.customertypeinfo2,
                    customertype: req.body.customertype,
                    phone: req.body.phone
                }
                })

                resolve({ success: true, message: 'User details edited successfully' })

        } catch (error) {
            reject({ success: false, message: 'Error while editing profile', error: error.message })
        }
        }

        else {
            reject({ success: false, message: 'No valid token' })
        }

    });

    promise

        .then(function (data) {
            console.log('Inside then : Success')
            res.send({ success: data.success, message: data.message });
        })
        .catch(function (error) {
            console.log('Inside Catch : Failure');
            res.send({ success: error.success, message: error.message });
        })

}

module.exports = {
    UserLogin,
    UserSignUp,
    checkUser,
    verifyOtp,
    changePassword,
    checkUserOtp,
    viewUsers,
    countUsers,
    sendnotificationtoall,
    sendnotificationtouser,
    saveplayerid,
    sendSignupOtp,
    verifysignupOtp,
    getUserdetail,
    Editprofile
};