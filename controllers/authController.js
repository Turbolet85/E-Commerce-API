const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors');
const { attachCookiesToResponse } = require('../utils');

//
//
//

const register = async (req, res) => {
   const { email, name, password } = req.body;

   //check if email exist
   const emailAlreadyExists = await User.findOne({ email });
   if (emailAlreadyExists) {
      throw new CustomAPIError.BadRequestError('Email already exist');
   }

   //check if user is first one to give admin credentials
   const isFirstAccount = (await User.countDocuments({})) === 0;
   const role = isFirstAccount ? 'admin' : 'user';

   //create user
   const user = await User.create({ email, name, password, role });

   //create token
   const tokenUser = {
      name: user.name,
      userId: user._id,
      role: user.role,
   };
   attachCookiesToResponse({ res, user: tokenUser });

   // response
   res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

//
//
//

const login = async (req, res) => {
   // validate body
   const { email, password } = req.body;
   if (!email || !password) {
      throw new CustomAPIError.BadRequestError(
         'Please provide email and password'
      );
   }

   const user = await User.findOne({ email });

   // validate if user exist in db
   if (!user) {
      throw new CustomAPIError.UnauthenticatedError('Invalid email');
   }

   //validate password
   const isPasswordCorrect = await user.comparePassword(password);
   if (!isPasswordCorrect) {
      throw new CustomAPIError.UnauthenticatedError('Invalid password');
   }
   // create cookie with token
   const tokenUser = {
      name: user.name,
      userId: user._id,
      role: user.role,
   };
   attachCookiesToResponse({ res, user: tokenUser });

   // response
   res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

//
//
//

const logout = async (req, res) => {
   res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
   });
   res.status(StatusCodes.OK).json({ msg: 'logout' });
};

module.exports = { register, login, logout };
