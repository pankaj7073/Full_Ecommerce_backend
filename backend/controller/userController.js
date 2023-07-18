const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register User...
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "Sample id",
      url: "profileUrl",
    },
  });

  sendToken(user, 201, res);
});

// Login User...
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User...
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out Successfully",
  });
});

// Forget password...
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  // Get Reset Password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Vaishnavmart Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Sent to ${user.email} seccessfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetpasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password...
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  console.log("chala kya");
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);

});

 // Get User Detail...
 exports.getUserDetails = catchAsyncErrors(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
    res.status(200).json({
      success:true,
      user
    })
});

// Update User Password...
exports.updatePassword = catchAsyncErrors(async(req, res, next)=>{

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not matched", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Updaate User Profile...
exports.updateProfile = catchAsyncErrors(async(req, res, next)=>{
    const newUserData = {
      name:req.body.name,
      email:req.body.email,
    }

    // We Will Add Cloudinary later

    const user =  await User.findByIdAndUpdate(req.user.id, newUserData, {
      new:true,
      runValidators:true,
      useFindAndModify:false
    });

    res.status(200).json({
      success:true
    })
});

// Get All User...
exports.getAllUser = catchAsyncErrors(async(req, res, next)=>{
  const users = await User.find();
  res.status(200).json({
    success:true,
    users
  })
});

// Get Single user By Admin...
exports.getSingleUser = catchAsyncErrors(async(req, res, next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`User does not exist with id ${req.params.id}`))
  }
  res.status(200).json({
    success:true,
    user
  })
});

// Update User Role... Admin
exports.updateUserRole= catchAsyncErrors(async(req, res, next)=>{
  const newUserData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
  }
  // We Will Add Cloudinary later
  const user =  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new:true,
    runValidators:true,
    useFindAndModify:false
  });

  res.status(200).json({
    success:true
  })
});

// Delete Single User... Admin
exports.deleteUser = catchAsyncErrors(async(req, res, next)=>{
  // remove from cloudNury
  const user  = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`ser does not exit with id ${req.params.id} Entered` ))
  }

  await user.deleteOne();

  res.status(200).json({
    success:true,
    message:"User Delete Successfully"
  })
});
