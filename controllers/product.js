const Product = require("../models/product");
const Category = require("../models/category");
const { getModelCount } = require("../helpers/count");
const { uploadImages } = require("../helpers/uploade-image");
const fs = require("fs");

const getAllProductsAndFilterByCategory = async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const products = await Product.find(filter)
      .populate("category")
      .select("name image images brand category");
    if (products) return res.status(200).json(products);
    res.status(404).json({ succes: false, massege: "Products not found !" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "category"
    );
    if (product) return res.status(200).json(product);
    return res
      .status(404)
      .json({ success: false, message: "Product not found !" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "product not found with id " + req.params.productId,
      });
    }
    res.status(500).json({
      success: false,
      message: "Could not delete product with id " + req.params.productId,
    });
  }
};

// single fun take file input name which is in front end as a value
const uploadImage = uploadImages().single("image");
const createProduct = async (req, res) => {
  try {
    const cat = await Category.findById(req.body.category);
    if (!cat) throw "Category id is not found !";
    const file = req.file;
    if (!file) throw "Image is required !";
    const {
      name,
      description,
      richDescription,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReview,
      isFeatured,
    } = req.body;
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const product = new Product({
      name,
      description,
      richDescription,
      image: `${basePath}${fileName}`,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReview,
      isFeatured,
    });

    const newProduct = await product.save();
    if (!newProduct) throw "Can not create product";
    res.status(200).json(newProduct);
  } catch (err) {
    if (err.message) {
      return res.status(400).json({ message: err.message });
    } else if (
      err === "Category id is not found" ||
      err === "Can not create product" ||
      err === "Image is required !"
    ) {
      return res.status(404).send({ message: err });
    }

    res
      .status(500)
      .json({ message: "Some error occurred while creating the product." });
  }
};

const updateProduct = async (req, res) => {
  try {
    const cat = await Category.findById(req.body.category);
    if (!cat) throw "Category id is not found";
    const file = req.file;
    let imagePath;
    let product = await Product.findById(req.params.productId);
    if (file) {
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagePath = `${basePath}${fileName}`;
      // to delete previose image from uploads folder
      const x = product.image.split(`${req.protocol}://${req.get("host")}/`)[1];
      fs.unlink(x, function () {});
    } else {
      imagePath = product.image;
    }

    const {
      name,
      description,
      richDescription,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      numReview,
      isFeatured,
    } = req.body;
    const productUpdated = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        name,
        description,
        richDescription,
        image: imagePath,
        images,
        brand,
        price,
        category,
        countInStock,
        rating,
        numReview,
        isFeatured,
      },
      { new: true }
    );
    if (!productUpdated) {
      return res.status(404).send({
        message: "Product not found with id " + req.params.productId,
      });
    }
    res.json(productUpdated);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Product not found with id " + req.params.productId,
      });
    } else if (err === "Category id is not found") {
      return res.status(404).send({ message: err });
    }
    return res.status(500).send({
      message: "Error updating Product with id " + req.params.productId,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productDeleted = await Product.findByIdAndRemove(
      req.params.productId
    );
    // delete image from uploads folder
    const path = productDeleted.image.split(`${req.protocol}://${req.get("host")}/`)[1];
    fs.unlink(path, function () {});
    return res.status(200).json({
      success: true,
      message: "Product is deleted with id : " + req.params.productId,
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "product not found with id " + req.params.productId,
      });
    }
    res.status(500).json({
      success: false,
      message: "Could not delete product with id " + req.params.productId,
    });
  }
};
const getProductsCount = getModelCount(Product);
const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProductsCount = req.params.count ? req.params.count : false;

    const productCount = await Product.find({ isFeatured: true }).limit(
      +featuredProductsCount
    );
    if (!productCount) throw new Error({ success: false });
    res.status(200).json(productCount);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getAllProductsAndFilterByCategory,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsCount,
  getFeaturedProducts,
  uploadImage,
};
