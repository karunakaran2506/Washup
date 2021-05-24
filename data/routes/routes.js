const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/BannerController');
const SubBannerController = require('../controllers/BannersubController');
const StaffController = require('../controllers/StaffController');
const AdminController = require('../controllers/AdminController');
const SettingController = require('../controllers/SettingController');
const CustomerController = require('../controllers/UserController');
const ServiceController = require('../controllers/ServiceController');
const ProductController = require('../controllers/ProductController');
const CartController = require('../controllers/CartController');
const OrderController = require('../controllers/OrderController');
const FaqController = require('../controllers/FaqController');

//Customer Controller Functions
router.post('/customersignup',CustomerController.UserSignUp);
router.post('/customerlogin',CustomerController.UserLogin);
router.post('/checkuser',CustomerController.checkUser);
router.post('/checkuserotp',CustomerController.checkUserOtp);
router.post('/changepassword',CustomerController.changePassword);
router.post('/verifyotp',CustomerController.verifyOtp);
router.get('/viewusers',CustomerController.viewUsers);
router.get('/userscount',CustomerController.countUsers);
router.post('/sendnotificationtouser',CustomerController.sendnotificationtouser); 
router.post('/sendnotificationtoall',CustomerController.sendnotificationtoall);
router.post('/saveplayerid',CustomerController.saveplayerid); 
router.post('/sendsignupotp',CustomerController.sendSignupOtp); 
router.post('/verifysignupotp',CustomerController.verifysignupOtp); 

//Admin Controller Functions
router.post('/adminsignup',AdminController.adminSignup); 
router.post('/adminlogin',AdminController.adminLogin); 
router.post('/changepasswordadmin',AdminController.changePasswordadmin); 
router.post('/checkuserotpadmin',AdminController.checkUserOtpadmin); 

//Staff Controller Functions
router.post('/addstaff', StaffController.AddStaff);
router.post('/viewstaff', StaffController.ViewStaff);

//banner
router.post('/addBanner', BannerController.uploadImg, BannerController.addBanner);
router.post('/deleteBanner', BannerController.deleteBanner); 
router.get('/viewbanners', BannerController.viewBanners);

//Sub-banner
router.post('/addSubbanner', SubBannerController.uploadImg, SubBannerController.addBannersub);
router.post('/deleteSubbanner', SubBannerController.deleteBannersub);
router.get('/viewSubbanners', SubBannerController.viewBannersub);

//Settings
router.post('/editSetting', SettingController.editSetting); 
router.get('/listSetting', SettingController.listSetting);
router.get('/getsettings', SettingController.Getsettings);

// Service Controller functions

router.post('/addservice',ServiceController.uploadImg, ServiceController.AddService);
router.get('/viewservice', ServiceController.ViewService);
router.post('/updateservice', ServiceController.UpdateService);

// Product Controller functions

router.post('/addproduct',ProductController.uploadImg, ProductController.AddProduct);
router.post('/viewproductbyservice', ProductController.ViewProduct);
router.post('/viewproductbyservice2', ProductController.ViewProduct2);
router.post('/updateproduct', ProductController.UpdateProduct);

// Product Controller functions for Admin

router.get('/viewallproducts',ProductController.ViewAllProducts)

// Cart Controller Functions
router.post('/addtocart', CartController.AddtoCart);
router.get('/getcartitems', CartController.GetCartitem);
router.post('/removecart', CartController.Removecart); 
router.post('/modifycartquantity', CartController.Modifycartquantity);  
router.post('/deletecartitems', CartController.deleteCartItems);   
router.get('/checkusercart',CartController.checkUser);

//Order Controller Functions for customers 
router.post('/createorder', OrderController.CreateOrder); 
router.post('/razorpay', OrderController.razorpay); 
router.post('/listorderdetailsbycustomer', OrderController.CustomerViewOrderDetails); 
router.get('/listordersbycustomer', OrderController.ListOrdersbyCustomer); 

// Order Controller Functions for Vendors
router.post('/updateorder', OrderController.UpdateOrder);
router.post('/updatepayment', OrderController.updatePayment);

// FAQ Controller Functions
router.post('/addFaq', FaqController.addFaq);
router.post('/deleteFaq', FaqController.deleteFaq);
router.get('/listFaq', FaqController.listFaq);

module.exports = router;