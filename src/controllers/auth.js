const { Profile } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

exports.registerProfile = async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(10).max(30).required(),
      password: Joi.string().token().min(6).max(40).required(),
      name: Joi.string().min(3).max(40).required(),
      role: Joi.string().min(4).max(7).required(),
      phone: Joi.string()
        .pattern(/^[0-9]+$/, "numbers")
        .min(10)
        .max(13)
        .required(),
      location: Joi.string(),
      avatar: Joi.string(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "Authentication Failed",
        message: error.details[0].message,
      });

    const checkEmail = await Profile.findOne({
      where: {
        email,
      },
    });

    if (checkEmail)
      return res.status(400).send({
        status: "Register failed",
        message: "Email already exist",
      });

    const hashStrength = 10;
    const hashedPassword = await bcrypt.hash(password, hashStrength);

    const profile = await Profile.create({
      ...req.body,
      password: hashedPassword,
      location: "",
      avatar: "",
    });

    const secretKey = "thisissecretkey";
    const token = jwt.sign(
      {
        id: profile.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      message: "Profile Succesfully Registered",
      data: {
        profile: {
          name: profile.name,
          email: profile.email,
          role: profile.role,
          phone: profile.phone,
          token,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().min(10).max(50).required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "Authentication Failed",
        message: error.details[0].message,
      });

    const checkEmail = await Profile.findOne({
      where: {
        email,
      },
    });

    if (!checkEmail)
      return res.status(400).send({
        status: "Login Failed",
        message: "Incorrect Email or Password",
      });

    const isValidPass = await bcrypt.compare(password, checkEmail.password);

    if (!isValidPass) {
      return res.status(400).send({
        status: "Login Failed",
        message: "Incorrect Email or Password",
      });
    }

    const secretKey = "thisissecretkey";
    const token = jwt.sign(
      {
        id: checkEmail.id,
      },
      secretKey
    );

    res.send({
      status: "success",
      message: "Login Success",
      data: {
        profile: {
          id: checkEmail.id,
          name: checkEmail.name,
          email: checkEmail.email,
          phone: checkEmail.phone,
          role: checkEmail.role,
          avatar: checkEmail.avatar,

          token,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

exports.checkAuthIntegrate = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        id: req.profileId.id,
      },
    });

    res.send({
      status: "Success",
      message: "Valid user profile",
      data: {
        profile,
      },
    });
  } catch (error) {
    return res.status(401).send({
      status: "ERROR",
      message: "Check authentication error",
    });
  }
};
