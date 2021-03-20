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
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "validation failed",
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
        message: "Email already registered",
      });

    const hashStrength = 10;
    const hashedPassword = await bcrypt.hash(password, hashStrength);

    const profile = await Profile.create({
      ...req.body,
      password: hashedPassword,
    });

    const secretKey = "akda4860@a9d1";
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
          token,
          role: profile.role,
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
        status: "validation failed",
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

    const secretKey = "akda4860@a9d1";
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
          name: checkEmail.name,
          email: checkEmail.email,
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
