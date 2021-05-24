const Admin = require('./../models/admins')
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(8);
const jwt = require('jsonwebtoken');
const secret = 'washup123';
const otpGenerator = require('otp-generator');
const axios = require('axios');


// Admin Signup
const adminSignup = async function (req, res) {

    let isValidParams = req.body.email && req.body.password

    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
                let hashedPassword = bcrypt.hashSync(req.body.password, salt)
                let admin = await Admin.create({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashedPassword
                }).then((admin) => {
                    // let token = jwt.sign({id:admin.id}, secret, {expiresIn: '20d'})
                    resolve({ success: true, message: 'Admin signed up successfully' });
                })
            }
            else {
                reject({ success: false, message: "Please provide Email and Password" })
            }
        } catch (e) {
            console.log('Error in adminSignup', e)
            reject({ success: false, message: 'Admin signup error', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Admin signup error' });
        });
}

// Admin Login
const adminLogin = async function (req, res) {

    let isValidParams = req.body.email && req.body.password;

    let promise = new Promise(async function (resolve, reject) {

        try {
            
            if(isValidParams) {
                
                const checkAdmin = await Admin.findOne({ email: req.body.email })

                if (checkAdmin) {

                    let passwordIsValid = await bcrypt.compareSync(req.body.password, checkAdmin.password)
                    
                    if (!passwordIsValid) {
                        reject({ success: false, message: "Check your password"})
                    } 
                    
                    else {
                        let token = await jwt.sign({ id: checkAdmin.id }, secret, { expiresIn: '30d' })
                        console.log(token)
                        resolve({ success: true, message: "Login success", token: token, name: checkAdmin.name })
                    }

                }
                
                else {
                    reject({ success: false, message: "No admin found" })
                }
            }
            else {
                reject({ success: false, message: "Please provide admin email and password" })
            }
        } catch (e) {
            reject({ success: false, message: 'Admin Login Error', error: e })
        }
    });

    promise.
        then(function (data) {
            res.send({ success: data.success, message: data.message, token: data.token, name: data.name });

        }).catch(function (error) {
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Admin Login Error' });
        });
}

const adminChangePassword = async function (req, res) {

    let isValidParams = req.body.email && req.body.currentPassword && req.body.newPassword

    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
                let findAdmin = await Admin.findOne({ email: req.body.email })
                if (findAdmin) {
                    let passwordIsValid = await bcrypt.compareSync(req.body.currentPassword, findAdmin.password)
                    console.log('Password is Valid', passwordIsValid)
                    if (passwordIsValid) {
                        let hashedPassword = bcrypt.hashSync(req.body.newPassword, salt)
                        let updateAdmin = await Admin.updateOne({ _id: findAdmin.id }, {
                            $set: {
                                password: hashedPassword
                            }
                        }).then(() => {
                            resolve({ success: true, message: 'Password updated successfully' })
                        })
                    } else {
                        reject({ success: false, message: "Please enter correct credentials" })
                    }
                } else {
                    reject({ success: false, message: "admin not found" })
                }
            }
            else {
                reject({ success: false, message: "Please provide email and Password" })
            }
        } catch (e) {
            console.log('Error in adminChangePassword', e)
            reject({ success: false, message: 'Error occured while changing Password', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, message: data.message });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while changing Password' });
        });
}

const changePasswordadmin = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        let ValidParams = req.body.phone;

        if (ValidParams) {

            try {

                let checkAdmin = await Admin.findOne({ phone: req.body.phone })

                if (checkAdmin) {

                    try {

                        if (req.body.otp === checkAdmin.forgetotp) {
                            let hashedPassword = bcrypt.hashSync(req.body.password, salt)

                            let changePassword = await Admin.updateOne({ phone: req.body.phone }, {
                                $set: {
                                    password: hashedPassword
                                }
                            }).then((data) => {
                                console.log('what is happening', data);
                            })
                            resolve({ success: true, message: 'Password has been changed successfully' })
                        }
                        else {
                            reject({ success: false, message: 'Invalid OTP' })
                        }
                    }

                    catch (error) {
                        reject({ success: false, message: 'Error while changing password', error: error.message })
                    }
                }
                else {
                    reject({ success: false, message: 'No Admin found' })
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

const checkUserOtpadmin = async function (req, res) {

    const promise = new Promise(async function (resolve, reject) {

        console.log(req.body);

        // main code
        try {
            let findUser = await Admin.findOne({ phone: req.body.phone }).count()
            if (findUser == 0) {

                reject({ success: false, message: 'User not found', count: findUser })
            }
            else {

                let otp = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false });

                var messagecontent = `Dear Admin, Your OTP for the request to change the password is ${otp}`;

                let url = `http://websms.bulksmsdaddy.com/vendorsms/pushsms.aspx?user=hellowcart&password=AUDI@9999&msisdn=91${req.body.phone}&sid=ISDTPL&msg=${messagecontent}&fl=0&gwid=2`;

                const result = await axios.get(url, {}, {});

                let updateOtp = await Admin.updateOne({ phone: req.body.phone }, {
                    $set: {
                        forgetotp: otp
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

module.exports = {
    adminSignup,
    adminLogin,
    adminChangePassword,
    changePasswordadmin,
    checkUserOtpadmin
}