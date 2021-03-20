const { Profile, Products } = require("../../models/");
const Joi = require("joi");

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll();

    res.send({
      status: "success",
      message: "GET ALL Profiles Successfull",
      data: {
        profiles,
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

//---------------------------------------TEST START-----------------------------------
exports.getProfilePartner = async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      where: {
        role: "PARTNER",
      },
      include: [
        {
          model: Products,
          as: "products",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: "GET ALL Partner Successfull",
      data: {
        profiles,
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

//------------------------------------------------TEST END-----------------------------------

// exports.addProduct = async (req, res) => {
//   try {
//     const { body } = req;
//     const { menuName, menuPrice, menuDesc } = body;
//     const schema = Joi.object({
//       menuName: Joi.string().max(30).required(),
//       menuDesc: Joi.string().max(40).required(),
//       menuPrice: Joi.string()
//         .pattern(/^[0-9]+$/, "numbers")
//         .max(7)
//         .required(),
//     });
//     const { error } = schema.validate({ menuName, menuDesc, menuPrice });

//     if (error)
//       return res.status(400).send({
//         status: "validation failed",
//         message: error.details[0].message,
//       });

//     const input = {
//       menuName,
//       menuDesc,
//       menuPrice,
//     };

//     const product = await Products.create(input);

//     res.send({
//       status: "success",
//       message: "ADD Product Successfull",
//       data: {
//         product,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       status: "error",
//       message: "Server Error",
//     });
//   }
// };

exports.getDetailProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: "GET Profile DETAIL Successfull",
      data: {
        profile,
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

exports.addProfile = async (req, res) => {
  try {
    const { body } = req;

    const { email, password, name, phone, role } = body;

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

    const { error } = schema.validate(body);
    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const input = {
      email,
      password,
      name,
      phone,
      role,
    };

    const profile = await Profile.create(input);

    res.send({
      status: "success",
      message: "ADD Profile Successfull",
      data: {
        profile,
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

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const checkId = await Profile.findOne({
      where: {
        id,
      },
    });

    if (!checkId)
      return res.send({
        status: "Not Found",
        message: `Profile with id: ${id} not found`,
        data: {
          profile,
        },
      });

    const updatedProfileId = await Profile.update(body, {
      where: {
        id,
      },
    });

    const profile = await Profile.findOne({
      where: {
        id: updatedProfileId,
      },
    });

    res.send({
      status: "success",
      message: "UPDATE Profile Successfull",
      data: {
        profile,
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

exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await Profile.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: "DELETE Profile Successfull",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};

//------TEMPLATE FUNCTION---------------------------
// exports.functionName = async (req, res) => {
//   try {
//     res.send({
//       status: "success",
//       message: "User Succesfully Get",
//       data: {
//         data,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       status: "error",
//       message: "Server Error",
//     });
//   }
// };
