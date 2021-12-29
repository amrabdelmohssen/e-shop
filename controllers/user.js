const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {getModelCount} = require ('../helpers/count')


function token(id, role, secret) {
  const token = jwt.sign(
    {
      id: id,
      isAdmin: role,
    },
    secret,
    {
      expiresIn: "1d",
    }
  );
  return token;
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    if (!users) throw "Can not get users!";
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send({ messag: err });
  }
};


const getUsersCount = getModelCount(User)

const getUser = async (req, res) => {
  try {
    const users = await User.findById(req.params.userId).select(
      "-passwordHash"
    );
    if (!users) throw `User is not found !`;
    res.status(200).json(users);
  } catch (err) {
    if (err === "User is not found !")
      return res.status(404).send({ messag: err });
    res.status(500).json({ success: false, message: err });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, phone, isAdmin, country, city, street, appartment } =
      req.body;
    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    let user = new User({
      name,
      email,
      passwordHash,
      phone,
      isAdmin,
      country,
      city,
      street,
      appartment,
    });
    user = await user.save();
    if (!user) throw "Can not creat this user!";
    const usertoken = token(user.id, user.isAdmin, process.env.SECRET);
    res.status(200).json({ user, token: usertoken });
  } catch (err) {
    res.status(500).send({ messag: err });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone, isAdmin, country, city, street, appartment } =
    req.body;
    const userUpdated = await User.findByIdAndUpdate(
      req.params.userId,
      {
        name, email, phone, isAdmin, country, city, street, appartment,
      },
      { new: true }
    ).select("-passwordHash");
    if (!userUpdated) {
      return res.status(404).send({
        message: "user not found with id " + req.params.userId,
      });
    }
    res.json(userUpdated);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "user not found with id " + req.params.userId,
      });
    } else if (err === "user id is not found") {
      return res.status(404).send({ message: err });
    }
    return res.status(500).send({
      message: "Error updating user with id " + req.params.userId , 
    });
  }
};




const deleteUser = async (req, res) => {
  try {
    const userDeleted = await User.findByIdAndRemove(
      req.params.userId
    );
    if (userDeleted)
      return res.status(200).json({
        success: true,
        message: "user is deleted with id : " + req.params.userId,
      });
    return res
      .status(404)
      .json({ success: false, message: "user not found !" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "user not found with id " + req.params.userId,
      });
    }
    res.status(500).json({
      success: false,
      message: "Could not delete user with id " + req.params.userId,
    });
  }
};


const login = async (req, res) => {
  try {
    console.log(req.body.email);
    const { email, password } = req.body;
    if (!email || !password) throw "Password and email is required !";
    const user = await User.findOne({ email: email });
    if (!user) throw "Password or email is not correcet !";
    const comaparePassword = bcrypt.compareSync(password, user.passwordHash);
    if (!comaparePassword) throw "Password or email is not correcet !";
    const usertoken = token(user.id, user.isAdmin, process.env.SECRET);
    return res.status(200).json({ user, token: usertoken });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

module.exports = {
  createUser,
  login,
  getAllUsers,
  getUsersCount,
  getUser,
  updateUser,
  deleteUser,
};
