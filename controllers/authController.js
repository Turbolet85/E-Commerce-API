const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors');
const { createJWT } = require('../utils');
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
   const tokenUserPayload = {
      name: user.name,
      userId: user._id,
      role: user.role,
   };
   const token = createJWT({ payload: tokenUserPayload });

   // response
   res.status(StatusCodes.CREATED).json({ user: tokenUserPayload, token });
};

//
//
//

const login = async (req, res) => {
   res.send('login user');
};

//
//
//

const logout = async (req, res) => {
   res.send('logout user');
};

module.exports = { register, login, logout };
