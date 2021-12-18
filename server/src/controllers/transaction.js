const { product, user, order, order_detail } = require("../../models");

// add transaction
exports.addTransaction = async (req, res) => {
  try {
    let orders = req.body.products;

    //get user id from token
    const buyyerId = req.user.id;

    // get seller id from table product
    const sellerId = await product.findOne({
      where: {
        id: orders[0].id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "password",
            "role",
            "gender",
            "image",
            "location",
            "phone",
            "fullname",
            "email",
          ],
        },
      },
      attributes: {
        exclude: [
          "id",
          "title",
          "price",
          "image",
          "createdAt",
          "updatedAt",
          "user_id",
        ],
      },
    });

    // insert into order table
    let orderCreated = await order.create({
      buyyer_id: buyyerId,
      seller_id: sellerId.user.id,
      subtotal: req.body.subtotal,
    });

    // insert into order_detail table
    const orderItems = orders.map((item) => {
      return {
        order_id: orderCreated.id,
        product_id: item.id,
        qty: item.qty,
      };
    });

    orders = await order_detail.bulkCreate(orderItems);

    // get data userOrder
    const response = await order.findOne({
      include: {
        model: user,
        as: "userOrder",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "password",
            "role",
            "gender",
            "image",
          ],
        },
      },
      where: {
        buyyer_id: orderCreated.buyyer_id,
      },
    });

    // get order item
    let responseOrder = await order_detail.findAll({
      where: {
        order_id: orderCreated.id,
      },
      include: {
        model: product,
        as: "order",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "id", "order_id", "product_id"],
      },
    });

    responseOrder = JSON.parse(JSON.stringify(responseOrder));

    responseOrder = responseOrder.map((item) => {
      return {
        id: item.order.id,
        title: item.order.title,
        price: item.order.price,
        image: process.env.IMAGE_PATH + item.order.image,
        seller: item.order.user_id,
        qty: item.qty,
      };
    });

    res.status(200).send({
      status: response.status,
      data: {
        transaction: {
          id: orderCreated.id,
          userOrder: {
            id: response.userOrder.id,
            fullname: response.userOrder.fullname,
            location: response.userOrder.location,
            email: response.userOrder.email,
          },
          status: "Success",
          order: responseOrder,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// get transaction by Partner
exports.getPartnerTransaction = async (req, res) => {
  const id = req.user.id;
  console.log("sellerId" + id);
  try {
    let data = await order.findAll({
      where: {
        seller_id: id,
      },
      include: [
        {
          model: user,
          as: "userOrder",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: order_detail,
          as: "orderItems",
          include: {
            model: product,
            as: "order",
          },
        },
      ],
    });

    const transactions = data.map((order) => {
      const orderitem = order.orderItems.map((item) => {
        return {
          id: item.id,
          title: item.order.title,
          price: item.order.price,
          image: process.env.IMAGE_PATH + item.order.image,
          qty: item.qty,
        };
      });

      return {
        id: order.id,
        userOrder: {
          id: order.userOrder.id,
          fullname: order.userOrder.fullname,
          location: order.userOrder.location,
          email: order.userOrder.email,
        },
        status: order.status,
        subtotal: order.subtotal,
        order: orderitem,
      };
    });

    res.status(200).send({
      data: {
        transaction: transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// get detail transaction by Partner
exports.getDetailTransaction = async (req, res) => {
  const sellerId = req.user.id;
  const transactionId = req.params.id;

  try {
    let data = await order.findOne({
      where: {
        id: transactionId,
        seller_id: sellerId,
      },
      include: [
        {
          model: user,
          as: "userOrder",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: order_detail,
          as: "orderItems",
          include: {
            model: product,
            as: "order",
          },
        },
      ],
    });

    const orderitem = data.orderItems.map((item) => {
      return {
        id: item.id,
        title: item.order.title,
        price: item.order.price,
        image: process.env.IMAGE_PATH + item.order.image,
        qty: item.qty,
      };
    });

    const transactions = {
      id: data.id,
      userOrder: {
        id: data.userOrder.id,
        fullname: data.userOrder.fullname,
        location: data.userOrder.location,
        email: data.userOrder.email,
      },
      status: data.status,
      order: orderitem,
    };

    res.status(200).send({
      data: {
        transaction: transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// get transaction by User
exports.getUserTransaction = async (req, res) => {
  const id = req.user.id;

  try {
    let data = await order.findAll({
      where: {
        buyyer_id: id,
      },
      include: [
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: order_detail,
          as: "orderItems",
          include: {
            model: product,
            as: "order",
          },
        },
      ],
    });

    const transactions = data.map((order) => {
      const orderitem = order.orderItems.map((item) => {
        return {
          id: item.id,
          title: item.order.title,
          price: item.order.price,
          image: process.env.IMAGE_PATH + item.order.image,
          qty: item.qty,
        };
      });

      return {
        id: order.id,
        status: order.status,
        seller: order.seller.fullname,
        order: orderitem,
        subtotal: order.subtotal,
      };
    });

    console.log(req.user.id);

    res.status(200).send({
      data: {
        transaction: transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getDetailTransactionByUser = async (req, res) => {
  const buyyerId = req.user.id;
  const transactionId = req.params.id;

  try {
    let data = await order.findOne({
      where: {
        id: transactionId,
        buyyer_id: buyyerId,
      },
      include: [
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: order_detail,
          as: "orderItems",
          include: {
            model: product,
            as: "order",
          },
        },
      ],
    });

    const orderitem = data.orderItems.map((item) => {
      return {
        id: item.id,
        title: item.order.title,
        price: item.order.price,
        image: process.env.IMAGE_PATH + item.order.image,
        qty: item.qty,
      };
    });

    const transactions = {
      id: data.id,
      status: data.status,
      seller: data.seller.fullname,
      order: orderitem,
    };

    res.status(200).send({
      data: {
        transaction: transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// edit transaction
exports.editTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const data = {
      status: req.body.status,
    };

    console.log(req.body);

    await order.update(data, {
      where: {
        id: transactionId,
      },
    });

    let responseData = await order.findOne({
      where: {
        id: transactionId,
      },
      include: [
        {
          model: user,
          as: "userOrder",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: order_detail,
          as: "orderItems",
          include: {
            model: product,
            as: "order",
          },
        },
      ],
    });

    const orderitem = responseData.orderItems.map((item) => {
      return {
        id: item.id,
        title: item.order.title,
        price: item.order.price,
        image: process.env.IMAGE_PATH + item.order.image,
        qty: item.qty,
      };
    });

    const transactions = {
      id: responseData.id,
      userOrder: {
        id: responseData.userOrder.id,
        fullname: responseData.userOrder.fullname,
        location: responseData.userOrder.location,
        email: responseData.userOrder.email,
      },
      status: responseData.status,
      order: orderitem,
    };

    res.status(200).send({
      status: "success",
      data: {
        transaction: transactions,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

// delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    const orderData = await order.findOne({
      where: {
        id: id,
      },
    });
    if (!orderData) {
      return res.status(400).send({
        status: "failed",
        message: `Transaction not found`,
      });
    }

    await order.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send({
      status: "success",
      data: {
        id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
