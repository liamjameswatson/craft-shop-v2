import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc Fetch a single product
// @route GET /api/products:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  } else {
    // use errorHandler
    res.status(404);
    throw new Error("Resource not found!");
  }
});

// @desc Create a product
// @route POST /api/products:id
// @access Private/ Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    description: "Sample description",
    image: "/images/sample.jpg",
    category: "sample category",
    price: 0,
    stockNumber: 0,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc Update a product
// @route GET /api/products/:id
// @access Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, stockNumber } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.stockNumber = stockNumber;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProducts, getProductById, createProduct, updateProduct };
