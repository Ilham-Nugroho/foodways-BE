const { Products, Profile } = require("../../models/");
const Joi = require("joi");

exports.getProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "profileId", "ProfileId"],
      },
    });

    res.send({
      status: "success",
      message: "GET ALL Products Successfull",
      data: {
        products,
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

exports.getProductsByPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOne({
      where: {
        id,
        role: "PARTNER",
      },
      include: {
        model: Products,
        as: "products",
        attributes: {
          exclude: ["createdAt", "updatedAt", "profileId", "ProfileId"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "profileId", "ProfileId"],
      },
    });

    res.send({
      status: "success",
      message: "GET ALL Products By Partner Successfull",
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

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await Products.findOne({
      where: {
        id,
      },
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "profileId", "ProfileId"],
      },
    });

    res.send({
      status: "success",
      message: "GET DETAIL Product Successfull",
      data: {
        products,
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

exports.addProduct = async (req, res) => {
  try {
    const { body } = req;
    const { menuName, menuPrice, menuDesc, ProfileId } = body;
    const schema = Joi.object({
      menuName: Joi.string().max(30).required(),
      menuDesc: Joi.string().max(40).required(),
      menuPrice: Joi.string()
        .pattern(/^[0-9]+$/, "numbers")
        .max(7)
        .required(),
      ProfileId: Joi.string(),
    });
    const { error } = schema.validate({
      menuName,
      menuDesc,
      menuPrice,
      ProfileId,
    });

    if (error) {
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });
    }

    const input = {
      menuName,
      menuDesc,
      menuPrice,
      ProfileId,
    };

    const createdProduct = await Products.create(input);

    const product = await Products.findOne({
      where: {
        id: createdProduct.id,
      },
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "profileId", "ProfileId"],
      },
    });

    res.send({
      status: "success",
      message: "ADD Product Successfull",
      data: {
        product,
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

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const checkId = await Products.findOne({
      where: {
        id,
      },
    });

    if (!checkId)
      return res.send({
        status: "Not Found",
        message: `Product with id: ${id} not found`,
        data: {
          profile,
        },
      });

    const updatedProductId = await Products.update(body, {
      where: {
        id,
      },
    });

    const product = await Products.findOne({
      where: {
        id: updatedProductId,
      },
      include: {
        model: Profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "profileId", "ProfileId"],
      },
    });

    res.send({
      status: "success",
      message: "UPDATE Product Successfull",
      data: {
        product,
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

exports.deletProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Products.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: "DELETE Product Successfull",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "Server Error",
    });
  }
};
