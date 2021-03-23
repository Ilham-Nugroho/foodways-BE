const { Profile } = require("../../models");

exports.partnerCheck = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: {
        id: req.profileId.id,
      },
    });

    if (profile.role === "PARTNER") {
      next();
    } else {
      res.status(401).send({
        status: "failed",
        message: "You're not authorized",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "ERROR",
      message: "User Authentication Error",
    });
  }
};

exports.userCheck = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      where: {
        id: req.profileId.id,
      },
    });

    if (profile.role === "USER") {
      next();
    } else {
      res.status(401).send({
        status: "failed",
        message: "You're not authorized",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "ERROR",
      message: "User Authentication Error",
    });
  }
};
