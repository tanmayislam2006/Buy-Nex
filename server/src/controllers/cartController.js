const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getCartItems = async (req, res) => {
  const email = req.params.email;
  try {
    const db = getDB();
    const cartCollection = db.collection("cart");
    const cartItems = await cartCollection.find({ userEmail: email }).toArray();
    res.send(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).send({ message: "Failed to fetch cart items" });
  }
};

const addToCart = async (req, res) => {
  const cartItem = req.body;
  try {
    const db = getDB();
    const cartCollection = db.collection("cart");

    const existingItem = await cartCollection.findOne({
      userEmail: cartItem.userEmail,
      productId: cartItem.productId,
    });

    if (existingItem) {
      // If the item already exists, update the quantity
      const result = await cartCollection.updateOne(
        { _id: existingItem._id },
        { $inc: { quantity: cartItem.quantity } }
      );
      return res.send(result);
    }
    const result = await cartCollection.insertOne(cartItem);
    res.send(result);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).send({ message: "Failed to add item to cart" });
  }
};

const deleteCartItem = async (req, res) => {
  const id = req.params.id;
  try {
    const db = getDB();
    const cartCollection = db.collection("cart");
    const result = await cartCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).send({ message: "Failed to delete cart item" });
  }
};

const updateCartQuantity = async (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;
  try {
    const db = getDB();
    const cartCollection = db.collection("cart");
    const result = await cartCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { quantity } }
    );
    res.send(result);
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).send({ message: "Failed to update quantity" });
  }
};

const clearCart = async (req, res) => {
  const email = req.params.email;
  try {
    const db = getDB();
    const cartCollection = db.collection("cart");
    const result = await cartCollection.deleteMany({ userEmail: email });
    res.send(result);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).send({ message: "Failed to clear cart" });
  }
};

const addToWishlist = async (req, res) => {
  const wishlistItem = req.body;
  try {
    const db = getDB();
    const wishlistCollection = db.collection("wishlist");
    const result = await wishlistCollection.insertOne(wishlistItem);
    res.send(result);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).send({ message: "Failed to add to wishlist" });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  deleteCartItem,
  updateCartQuantity,
  clearCart,
  addToWishlist,
};
