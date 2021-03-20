const { Products } = require("../../models/");
const Joi = require("joi");

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

    if (error)
      return res.status(400).send({
        status: "validation failed",
        message: error.details[0].message,
      });

    const input = {
      menuName,
      menuDesc,
      menuPrice,
      ProfileId,
    };

    const product = await Products.create(input);

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
