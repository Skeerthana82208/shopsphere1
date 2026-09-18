const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc   Get all products with search, category filter, sort, pagination
// @route  GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 12, featured } = req.query;

    const query = {};

    // Search by name or brand
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'All' && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ name: { $regex: `^${category}$`, $options: 'i' } });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc' || sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc' || sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching products',
    });
  }
};

// @desc   Get single product by ID
// @route  GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching product details',
    });
  }
};

// @desc   Create product (Admin)
// @route  POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, brand, category, image, stock, isFeatured } = req.body;

    if (!name || !description || price === undefined || !brand || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product fields',
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      brand,
      category,
      image,
      stock: stock !== undefined ? Number(stock) : 0,
      isFeatured: Boolean(isFeatured),
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name');

    res.status(201).json({
      success: true,
      product: populatedProduct,
      message: 'Product created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating product',
    });
  }
};

// @desc   Update product (Admin)
// @route  PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    res.json({
      success: true,
      product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating product',
    });
  }
};

// @desc   Delete product (Admin)
// @route  DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting product',
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
