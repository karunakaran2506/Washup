const Staff = require('../models/staff');

const AddStaff = async function(req,res){

    const promise = new Promise( async function(resolve, reject){

        // main code
        try {
            let addStaff = await Staff.create({
                name : req.body.name,
                username : req.body.username,
                password : req.body.password,
                restaurant : req.body.restaurant
            })
            resolve({success : true, message : 'Success message'})
        } catch (error) {
            reject({success : false, message : 'Failure message', error: error.message})
        }

    });

    promise

    .then((data)=>{
        console.log('Inside then : Success')
        res.send({success : data.success, message : data.message});
    })
    .catch((error)=>{
        console.log('Inside Catch : Failure');
        res.send({success : error.success, message : error.message, error : error.error});
    })

}

const ViewStaff = async function(req,res){

    const promise = new Promise( async function(resolve, reject){
        // main code
        try {
            let viewstaff = await Staff.find({ })
            resolve({success : true, message : 'Success message', staff : viewstaff})
        } catch (error) {
            reject({success : false, message : 'Failure message', error: error.message})
        }

    });

    promise

    .then((data)=>{
        console.log('Inside then : Success')
        res.send({success : data.success, message : data.message, staff : data.staff});
    })
    .catch((error)=>{
        console.log('Inside Catch : Failure');
        res.send({success : error.success, message : error.message, error: error.error});
    })

}

module.exports = {
    AddStaff,
    ViewStaff
}