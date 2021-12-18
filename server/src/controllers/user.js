const { user } = require("../../models");

const joi = require("joi");

// get all users
exports.getUsers = async (req, res) => {
  try {
    let users = await user.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    users = JSON.parse(JSON.stringify(users));

    users = users.map((item) => {
      return {
        id: item.id,
        fullname: item.fullname,
        email: item.email,
        phone: item.phone,
        location: item.location,
        image: process.env.IMAGE_PATH + item.image,
        role: item.role,
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        users,
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

// get All Users Partner
exports.getUserPartner = async (req, res) => {
  try {
    let users = await user.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      where: {
        role: "partner",
      },
    });

    users = JSON.parse(JSON.stringify(users));

    users = users.map((item) => {
      return {
        id: item.id,
        fullname: item.fullname,
        email: item.email,
        phone: item.phone,
        location: item.location,
        image: process.env.IMAGE_PATH + item.image,
        role: item.role,
      };
    });

    res.status(200).send({
      status: "success",
      data: {
        users,
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

// get user by id
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const userData = await user.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          fullname: userData.fullname,
          gender: userData.gender,
          phone: userData.phone,
          role: userData.role,
          location: userData.location,
          image: process.env.IMAGE_PATH + userData.image,
        },
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

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userData = await user.findOne({
      where: {
        id,
      },
    });
    if (!userData) {
      return res.status(400).send({
        status: "failed",
        message: `User Id: ${id} not found`,
      });
    }

    await user.destroy({
      where: {
        id,
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

// Update User
exports.updateuser = async (req, res) => {
  const schema = joi.object({
    fullname: joi.string().min(3).messages({
      "string.base": `fullname must be text`,
      "string.min": `fullname minimal 3 character`,
    }),
    email: joi
      .string()
      .email({
        tlds: {
          allow: ["com", "co", "net", "id"],
        },
      })
      .message("please insert valid email"),
    phone: joi.string(),
    location: joi.string(),
    image: joi.string(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: error.details[0].message,
    });
  }
  try {
    const id = req.params.id;

    const data = {
      email: req.body.email,
      fullname: req.body.fullname,
      phone: req.body.phone,
      location: req.body.location,
      image: req.file.filename,
    };

    const updatedData = await user.update(data, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      message: `update user id ${id} succeed`,
      rowAffected: updatedData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};
