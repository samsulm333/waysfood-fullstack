// import model
const { user } = require("../../models");

const joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    fullname: joi.string().min(3).required().messages({
      "string.base": `Name must be text`,
      "string.empty": `fullname field cannot be empty`,
      "string.min": `"fullname" should have a minimum length of`,
      "any.required": `"fullname" is a required`,
    }),
    gender: joi.string().required(),
    phone: joi.string().required(),
    role: joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: error.details[0].message,
    });
  }

  let image = "";
  if (req.body.role === "customer") {
    image = "male_avatar.png";
  } else {
    image = "resto-image.jpg";
  }

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const data = {
      email: req.body.email,
      password: hashedPassword,
      fullname: req.body.fullname,
      gender: req.body.gender,
      phone: req.body.phone,
      role: req.body.role,
      image: image,
    };

    const newUser = await user.create(data);

    const token = jwt.sign(
      {
        id: newUser.id,
        fullName: newUser.fullname,
        email: newUser.email,
        phone: newUser.phone,
        location: newUser.location,
        role: newUser.role,
      },
      process.env.TOKEN_KEY
    );

    res.status(200).send({
      status: "success",
      message: "Register success, Please login !",
      data: {
        user: {
          fullName: newUser.fullname,
          token: token,
          role: newUser.role,
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

// login
exports.login = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    req.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }
  try {
    const { email, password } = req.body;

    const userExist = await user.findOne({
      where: {
        email: email,
      },
    });

    if (!userExist) {
      return res.status(400).send({
        status: "failed",
        message: "Email & Password not match",
      });
    }

    const isValid = await bcrypt.compare(password, userExist.password);

    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "Email & Password not match",
      });
    }

    const data = {
      id: userExist.id,
      fullname: userExist.fullname,
      email: userExist.email,
      phone: userExist.phone,
      location: userExist.location,
      role: userExist.role,
    };

    const token = jwt.sign(data, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: userExist.id,
          fullname: userExist.fullname,
          email: userExist.email,
          role: userExist.role,
          image: process.env.IMAGE_PATH + userExist.image,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success...",
      data: {
        user: {
          id: dataUser.id,
          fullname: dataUser.fullname,
          email: dataUser.email,
          phone: dataUser.phone,
          location: dataUser.location,
          image: process.env.IMAGE_PATH + dataUser.image,
          role: dataUser.role,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
