const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getAllProductData = async (req, res) => {
  try {
    const db = getDB();
    const productsCollection = db.collection("products");

    const {
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      page,
      limit,
      search,
    } = req.query;

    let matchQuery = {};

    if (category) matchQuery.category = category;
    if (brand) matchQuery.brand = brand;
    if (minRating) matchQuery.rating = { $gte: parseFloat(minRating) };
    if (minPrice || maxPrice) {
      matchQuery.price = {};
      if (minPrice) matchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) matchQuery.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      const regex = new RegExp(search, "i");
      matchQuery.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $regex: regex } },
      ];
    }

    let sortOptions = {};
    if (sortBy === "Price: Low to High") sortOptions.price = 1;
    else if (sortBy === "Price: High to Low") sortOptions.price = -1;
    else sortOptions._id = -1; // Default/Newest

    const pageNumber = parseInt(page) || 1;
    const productsPerPage = parseInt(limit) || 8;
    const skip = (pageNumber - 1) * productsPerPage;

    const result = await productsCollection
      .aggregate([
        { $match: matchQuery },
        {
          $facet: {
            products: [
              { $sort: sortOptions },
              { $skip: skip },
              { $limit: productsPerPage },
            ],
            totalCount: [{ $count: "count" }],
            categoryCounts: [
              { $group: { _id: "$category", count: { $sum: 1 } } },
              { $project: { name: "$_id", count: 1, _id: 0 } },
              { $sort: { name: 1 } },
            ],
            brandCounts: [
              { $group: { _id: "$brand", count: { $sum: 1 } } },
              { $project: { name: "$_id", count: 1, _id: 0 } },
              { $sort: { name: 1 } },
            ],
          },
        },
      ])
      .toArray();

    const aggregatedData = result[0];
    const products = aggregatedData.products || [];
    const totalProducts =
      aggregatedData.totalCount.length > 0
        ? aggregatedData.totalCount[0].count
        : 0;
    const categoryCounts = aggregatedData.categoryCounts || [];
    const brandCounts = aggregatedData.brandCounts || [];

    res.send({
      products,
      totalProducts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / productsPerPage),
      categoryCounts,
      brandCounts,
    });
  } catch (error) {
    console.error("Error fetching all product data:", error);
    res.status(500).send({ message: "Failed to fetch product data" });
  }
};

const getProducts = async (req, res) => {
  try {
    const db = getDB();
    const productsCollection = db.collection("products");

    const category = req.query.category;
    const excludeId = req.query.excludeId;
    const query = {};
    if (category) {
      query.category = category;
    }

    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }

    let cursor = productsCollection.find(query);
    if (category) {
      cursor = cursor.limit(5);
    }

    const products = await cursor.toArray();
    res.send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: "Failed to fetch products" });
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const db = getDB();
    const productsCollection = db.collection("products");

    const query = { _id: new ObjectId(id) };
    const product = await productsCollection.findOne(query);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.send(product);
  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).send({ message: "Failed to fetch product" });
  }
};

const manageProducts = async (req, res) => {
  try {
    const db = getDB();
    const productsCollection = db.collection("products");

    let { page = 1, limit = 10, sellerEmail } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (!sellerEmail) {
      return res.status(400).json({ message: "Seller email is required" });
    }

    const skip = (page - 1) * limit;

    const total = await productsCollection.countDocuments({ sellerEmail });

    const products = await productsCollection
      .find({ sellerEmail })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addProduct = async (req, res) => {
  const product = req.body;
  try {
    const db = getDB();
    const productsCollection = db.collection("products");
    const result = await productsCollection.insertOne(product);
    res.status(201).send(result);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send({ message: "Failed to add product" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDB();
    const productsCollection = db.collection("products");
    const result = await productsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Failed to delete product" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { _id, ...product } = req.body;
  try {
    const db = getDB();
    const productsCollection = db.collection("products");
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: product }
    );
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ message: "Failed to update product" });
  }
};

module.exports = {
  getAllProductData,
  getProducts,
  getProductById,
  manageProducts,
  addProduct,
  deleteProduct,
  updateProduct,
};
