const Restaurant = require('./../models/restaurant');

const Search = async function (req, res) {
    console.log('search', req.query)

    let isValidParams = req.query.keyword

    let promise = new Promise(async function (resolve, reject) {
        try {
            if (isValidParams) {
                
                let search = req.query.keyword;
                
                console.log(new RegExp(req.query.keyword, 'i'))
                
                let restaurants = await Restaurant.find({name: new RegExp(req.query.keyword, 'i'), isactive: 0 });

                resolve({ success: true, results: restaurants })
            }
            else {
                reject({ success: false, message: "Please provide keyword" })
            }
        } catch (e) {
            console.log('Error in search', e)
            reject({ success: false, message: 'Error occured while searching', error: e })
        }
    });

    promise.
        then(function (data) {
            console.log('Inside then')
            res.send({ success: data.success, results: data.results });

        }).catch(function (error) {
            console.log('Inside catch', error)
            res.send({ success: error ? error.success : false, message: error ? error.message : 'Error occured while searching' });
        });
}

module.exports = {
    Search
}