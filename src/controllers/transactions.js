const Joi = require("joi");
const { Op } = require("sequelize");

const { Transactions, Products, Order, Profile } = require("../../models");
const { getProducts } = require("./products");

exports.getPartnerTransactions = async (req, res) => {
  try {
    const exclude = [
      "password",
      "Order",
      "order",
      "createdAt",
      "updatedAt",
      "profileId",
      "ProfileId",
      "transactionsId",
      "productsId",
    ];

    const { params } = req;
    const { id } = params;

    const transactions = await Transactions.findAll({
      include: [
        {
          model: Products,
          as: "products",
          attributes: {
            exclude: exclude,
          },
          through: {
            model: Order,
            as: "order",
            attributes: {
              exclude: exclude,
            },
          },
        },
        {
          model: Profile,
          as: "customer",
          attributes: {
            exclude: exclude,
          },
        },
        {
          model: Profile,
          as: "partner",
          attributes: {
            exclude: exclude,
          },
        },
      ],
      where: {
        partnerId: parseInt(id),
      },
    });

    res.send({
      status: "SUCCESS",
      data: {
        transactions,
      },
    });
  } catch (err) {
    return res.send({
      status: "ERROR",
      message: "Failed to get transaction",
    });
  }
};

exports.getCustomerTransactions = async (req, res) => {
  try {
    const exclude = [
      "password",
      "Order",
      "order",
      "createdAt",
      "updatedAt",
      "profileId",
      "ProfileId",
      "transactionsId",
      "productsId",
    ];
    const transactions = await Transactions.findAll({
      include: [
        {
          model: Products,
          as: "products",
          through: {
            model: Order,
            as: "order",
            attributes: {
              exclude: exclude,
            },
          },
          attributes: {
            exclude: exclude,
          },
        },
        {
          model: Profile,
          as: "partner",
          attributes: {
            exclude: exclude,
          },
        },
      ],
      where: {
        customerId: parseInt(req.profileId.id),
      },
      attributes: {
        exclude: exclude,
      },
    });

    res.send({
      status: "success",
      data: {
        transactions,
      },
    });
  } catch (err) {
    return res.send({
      status: "failed",
      message: err,
    });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;

    const exclude = [
      "password",
      "Order",
      "order",
      "createdAt",
      "updatedAt",
      "profileId",
      "ProfileId",
      "transactionsId",
      "productsId",
      "avatar",
    ];

    const transactions = await Transactions.findAll({
      include: [
        {
          model: Products,
          as: "products",
          attributes: {
            exclude: exclude,
          },
          through: {
            model: Order,
            as: "order",
            attributes: {
              exclude: exclude,
            },
          },
        },
        {
          model: Profile,
          as: "customer",
          attributes: {
            exclude: exclude,
          },
        },
        {
          model: Profile,
          as: "partner",
          attributes: {
            exclude: exclude,
          },
        },
      ],
      where: {
        id: parseInt(id),
      },
      attributes: {
        exclude: exclude,
      },
    });

    res.send({
      status: "success",
      data: {
        transactions,
      },
    });
  } catch (err) {
    return res.send({
      status: "failed",
      message: err,
    });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { body } = req;

    // Validate inputs.
    const schema = Joi.object({
      products: Joi.array().items(
        Joi.object({
          id: Joi.number().required(),
          qty: Joi.number().min(1).required(),
        })
      ),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: "Request Error",
        message: error.details[0].message,
      });
    }

    // Get all products id.
    let _productsId = [];
    for (let i = 0; i < body.products.length; i++) {
      _productsId.push(body.products[i].id);
    }

    const products = await Products.findAll({
      where: {
        id: {
          [Op.or]: _productsId,
        },
      },
    });

    if (products.length < 1 || products.length !== body.products.length) {
      return res.send({
        status: "invalid",
        message: "Some from your product doesn't exist.",
      });
    }

    // Check if products come from a same partner.
    const partnerId = products[0].profileId;
    for (let i = 1; i < products.length; i++) {
      if (partnerId !== products[i].profileId) {
        return res.send({
          status: "invalid",
          message: "Customer only can order the menu from a same place.",
        });
      }
    }

    // Create order.
    const transaction = await Transactions.create({
      status: "Waiting Approval",
      customerId: req.profileId.id,
      partnerId: partnerId,
    });

    // Create bulk array for order product.
    let bulk = [];
    for (let i = 0; i < products.length; i++) {
      bulk.push({
        qty: body.products[i].qty,
        productsId: body.products[i].id,
        transactionsId: transaction.id,
      });
    }

    await Order.bulkCreate(bulk);

    // Get user who order.
    const exclude = [
      "Order",
      "order",
      "createdAt",
      "updatedAt",
      "profileId",
      "ProfileId",
      "transactionsId",
      "productsId",
      "password",
      "avatar",
    ];

    const customer = await Profile.findOne({
      attributes: {
        exclude: exclude,
      },
      where: {
        id: parseInt(req.profileId.id),
      },
    });

    const orderData = await Transactions.findOne({
      include: {
        model: Products,
        as: "products",
        attributes: {
          exclude: exclude,
        },
        through: {
          model: Order,
          as: "order",
          attributes: {
            exclude: exclude,
          },
        },
      },
      where: {
        id: transaction.id,
      },
      attributes: {
        exclude: exclude,
      },
    });

    return res.send({
      status: "success",
      message: "Your order is success.",
      data: {
        transaction: {
          id: transaction.id,
          userOrder: customer,
          status: orderData.status,
          order: orderData.products,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "something wrong",
      message: "Server Error",
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { body, params } = req;
    const { status } = body;
    const { id } = params;

    // Validate inputs.
    const schema = Joi.object({
      status: Joi.string().min(1).max(255),
    });
    const { error } = schema.validate(body);

    if (error) {
      return res.send({
        status: "invalid",
        message: error.details.message[0],
      });
    }

    const transaction = await Transaction.update(
      {
        status,
      },
      {
        where: {
          id: parseInt(id),
        },
      }
    );

    res.send({
      status: "success",
      message: "Your order has been updated.",
    });
  } catch (err) {
    return res.send({
      status: "failed",
      message: err,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { params, user } = req;
    const { id } = params;

    const transaction = await Transaction.findOne({
      where: {
        id,
      },
    });

    if (transaction.partnerId !== parseInt(user.id)) {
      return res.send({
        status: "Access Denied",
        message: "You don't have right to access.",
      });
    }

    await Transaction.destroy({
      where: {
        id: parseInt(id),
      },
    });

    res.send({
      status: "success",
      message: "Your order has been deleted.",
      data: {
        id,
      },
    });
  } catch (err) {
    return res.send({
      status: "failed",
      message: err,
    });
  }
};
