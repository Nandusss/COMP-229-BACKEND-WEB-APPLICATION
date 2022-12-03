/*
  Comp-229 Web Application Development Group 3
  Chafanarosa Buy and Sell Used Products
  This Website will enable users to post and view advertisements for used		
  products
	
  Developers
  Fatimah Binti Yasin – 301193282
  Nandagopan Dilip – 301166925
  Chantelle Lawson – 301216199
  Ronald Jr Ombao – 301213219
  Santiago Sanchez Calle – 300648373

  Copyright All Rights Reserved
*/

let User = require('../models/user');
let passport = require('passport');

let jwt = require('jsonwebtoken');
let config = require('../config/config');

function getErrorMessage(err) {
  console.log(err);
  let message = '';

  if (err.message) {
    message = err.message;
  }
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  }
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message)
        message = err.errors[errName].message;
    }
  }

  return message;
};

module.exports.signup = function (req, res, next) {

  let user = new User(req.body);
  user.provider = 'local';
  // console.log(user);

  user.save((err) => {
    if (err) {
      let message = getErrorMessage(err);

      return res.status(400).json(
        {
          success: false,
          message: message
        }
      );
    }
    return res.json(
      {
        success: true,
        message: 'Registration is successfull!'
      }
    );
  });
};

module.exports.signin = function (req, res, next) {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        if (err || !user) {
          return res.status(400).json(
            {
              success: false,
              message: err || info.message
            }
          );
        }

        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) {
              return next(error);
            }

            // Generating the JWT token.
            const payload =
            {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username
            };
            const token = jwt.sign(
              {
                payload: payload
              },
              config.SECRETKEY,
              {
                algorithm: 'HS512',
                expiresIn: "30min"
              }
            );

            return res.json(
              {
                success: true,
                token: token,
                message: 'Login succesfully'
              }
            );
          }
        );
      } catch (error) {

        console.log(error);
        return res.status(400).json(
          {
            success: false,
            message: getErrorMessage(error)
          });
      }
    }
  )(req, res, next);
}


exports.myprofile = async function (req, res, next) {

  try {

    let id = req.payload.id;
    let me = await User.findById(id).select('firstName lastName email username');

    res.status(200).json(me)

  } catch (error) {
    console.log(error);
    return res.status(400).json(
      {
        success: false,
        message: getErrorMessage(error)
      }
    );
  }
}

exports.updateProfile = async function (req, res, next) {
  try {
    let id = req.payload._id;
    let me = await User.findOneAndUpdate({ _id: id }, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email
    }, { returnOriginal: false }).select('firstName lastName email username');

    res.status(200).json(me)

  } catch (error) {
    console.log(error);
    return res.status(400).json(
      {
        success: false,
        message: getErrorMessage(error)
      }
    );
  }
}