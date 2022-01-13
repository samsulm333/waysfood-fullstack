const { product, user } = require("../../models");

// get all products
exports.getProducts = async (req, res) => {
  try {
    let data = await product.findAll({
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
          ],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "user_id"],
      },
    });

    data = data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        price: item.price,
        image: `http://localhost:5002/uploads/${item.image}`,
        user: item.user,
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        products: data,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

// get product by id
exports.getProductByUser = async (req, res) => {
  try {
    const id = req.params.id;

    let products = await product.findAll({
      where: {
        user_id: id,
      },
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt"],
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "password",
            "gender",
            "image",
            "email",
          ],
        },
      },
    });

    productsArr = products.map((item) => {
      return {
        id: item.id,
        title: item.title,
        price: item.price,
        image: `http://localhost:5002/uploads/${item.image}`,
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        products: productsArr,
        userPartner: products[0].user,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

// get detail product
exports.getDetailproduct = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await product.findOne({
      where: {
        id: id,
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
          ],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "user_id"],
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        product: data,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

// add product
exports.addProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const newProduct = {
      title: req.body.title,
      price: parseInt(req.body.price),
      image: req.file.filename,
      user_id: userId,
    };
    const response = await product.create(newProduct);

    res.status(200).send({
      status: "success",
      data: {
        product: {
          id: response.id,
          title: response.title,
          price: response.price,
          image: process.env.IMAGE_PATH + response.image,
          user: {
            id: req.user.id,
            fullname: req.user.fullname,
            email: req.user.email,
            phone: req.user.phone,
            location: req.user.location,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

// edit product
exports.editProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const partnerId = req.user.id;

    const data = {
      title: req.body.title,
      price: req.body.price,
    };

    await product.update(data, {
      where: {
        id: id,
      },
    });
    const updateData = await product.findOne({
      where: {
        id: id,
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
          ],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "user_id"],
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        Product: updateData,
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

// delete product
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const productData = await product.findOne({
      where: {
        id: id,
      },
    });
    if (!productData) {
      return res.status(400).send({
        status: "failed",
        message: `Product Id: ${id} not found`,
      });
    }

    await product.destroy({
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
