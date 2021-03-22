const { Profile, Products } = require("../../models/");
const Joi = require("joi");

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "avatar", "location"],
      },
    });

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
            exclude: ["createdAt", "updatedAt", "ProfileId", "profileId"],
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

exports.getProfileUser = async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      where: {
        role: "USER",
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "avatar"],
      },
    });

    res.send({
      status: "success",
      message: "GET ALL USER Successfull",
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

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const checkProfile = await Profile.findOne({
      where: {
        id: id,
      },
    });

    if (!checkProfile)
      return res.send({
        status: "Not Found",
        message: `Profile with id: ${id} not found`,
      });

    if (checkProfile.id !== req.profileId.id)
      return res.status(400).send({
        status: "Error",
        message: "You're not authorized to access",
      });

    let updateImage;

    if (req.files.imageFile === undefined) {
      updateImage = checkProfile.avatar;
    } else {
      updateImage = req.files.imageFile[0].filename;
    }

    const update = {
      ...req.body,
      avatar: updateImage,
    };

    const updatedProfile = await Profile.update(update, {
      where: {
        id: id,
      },
    });

    const profileNew = await Profile.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "location", "password"],
      },
    });

    res.send({
      status: "success",
      message: "UPDATE Profile Successfull",
      data: {
        profileNew,
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

    const checkProfile = await Profile.findOne({
      where: {
        id: id,
      },
    });

    if (!checkProfile)
      return res.send({
        status: "Not Found",
        message: `Profile with id: ${id} not found`,
      });

    if (checkProfile.id !== req.profileId.id)
      return res.status(400).send({
        status: "Error",
        message: "You're not authorized to access",
      });

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
