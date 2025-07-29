// dataModels.js

/**
 * @file This file contains the JavaScript object schemas for the core data models
 * of the BuyFix E-commerce Platform. These schemas define the expected
 * structure of data for various entities and can be used for reference,
 * validation, or initial state generation in both frontend and backend contexts.
 */

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user.
 * @property {string} name - Full name of the user.
 * @property {string} [profileImage] - URL to the user's profile picture.
 * @property {string} email - User's email address (unique).
 * @property {string} passwordHash - Hashed password for secure authentication.
 * @property {string} [uid] - (Optional) External authentication ID (e.g., Firebase Auth UID).
 * @property {string} createdAt - Timestamp of account creation.
 * @property {string} lastLogin - Timestamp of last successful login.
 * @property {boolean} isVerified - Indicates if the user's email address has been verified.
 * @property {'Admin'|'Seller'|'Customer'} role - User's role on the platform.
 * @property {Object} [address] - Default shipping/billing address for Customer role.
 * @property {string} address.street
 * @property {string} address.city
 * @property {string} address.state
 * @property {string} address.zipCode
 * @property {string} address.country
 * @property {string} [phone] - User's phone number.
 * @property {'Active'|'Inactive'|'Suspended'} status - Account status.
 */
export const UserModel = {
  name: "string",
  profileImage: "string (URL)",
  email: "string",
  createdAt: "timestamp",
  lastLogin: "timestamp",
  isVerified: "boolean",
  role: "enum/string", // 'Admin', 'Seller', 'Customer'
  address: {
    street: "string",
    city: "string",
    state: "string",
    zipCode: "string",
    country: "string",
  },
  phone: "string", //bd velidate
};

/**
 * @typedef {Object} Product
 * @property {string} id - Unique identifier for the product.
 * @property {string} sellerId - ID of the seller who owns this product.
 * @property {string} name - Name of the product.
 * @property {string} description - Detailed description of the product.
 * @property {number} price - Current selling price of the product.
 * @property {string} currency - Currency code (e.g., "USD", "BDT").
 * @property {string} [sku] - Stock Keeping Unit.
 * @property {number} inventory - Current stock quantity available.
 * @property {string[]} images - URLs to product images.
 * @property {string} categoryId - ID of the primary category the product belongs to.
 * @property {string} [brandId] - ID of the brand of the product.
 * @property {Object} [specifications] - Key-value pairs for product specifications.
 * @property {'Active'|'Draft'|'Pending Approval'|'Archived'} status - Product status.
 * @property {string} createdAt - Timestamp when the product was added.
 * @property {string} updatedAt - Last timestamp the product details were updated.
 * @property {number} [averageRating] - Pre-calculated average rating from reviews.
 * @property {number} [totalReviews] - Total number of reviews received.
 * @property {string[]} [tags] - Keywords for search and filtering.
 * @property {number} [weight] - Product weight for shipping calculations.
 * @property {Object} [dimensions] - Product dimensions.
 * @property {number} dimensions.length
 * @property {number} dimensions.width
 * @property {number} dimensions.height
 * @property {string} dimensions.unit
 * @property {boolean} [isFeatured] - Flag to mark product as featured.
 * @property {number} [discountPrice] - Price after discount, if any.
 * @property {number} [discountPercentage] - Percentage of discount.
 * @property {string[]} [seoKeywords] - Keywords for Search Engine Optimization.
 * @property {Object} [deliveryInfo] - Shipping details specific to the product.
 * @property {number} deliveryInfo.estimatedDeliveryDays
 * @property {number} deliveryInfo.shippingCost
 */
export const ProductModel = {
  id: "string/UUID",
  sellerId: "string/UUID",
  name: "string",
  description: "string",
  price: "decimal/float",
  currency: "string",
  sku: "string",
  inventory: "integer",
  images: ["string (URL)"],
  categoryId: "string/UUID",
  brandId: "string/UUID",
  specifications: "object/JSONB", // Flexible schema for varying product attributes
  status: "enum/string", // 'Active', 'Draft', 'Pending Approval', 'Archived'
  createdAt: "timestamp",
  updatedAt: "timestamp",
  averageRating: "float",
  totalReviews: "integer",
  tags: ["string"],
  weight: "float",
  dimensions: {
    length: "float",
    width: "float",
    height: "float",
    unit: "string",
  },
  isFeatured: "boolean",
  discountPrice: "decimal/float",
  discountPercentage: "float",
  seoKeywords: ["string"],
  deliveryInfo: {
    estimatedDeliveryDays: "integer",
    shippingCost: "decimal/float",
  },
};

/**
 * @typedef {Object} Category
 * @property {string} id - Unique identifier for the category.
 * @property {string} name - Name of the category.
 * @property {string} slug - URL-friendly version of the name (unique).
 * @property {string} [description] - Optional description for the category.
 * @property {string} [imageUrl] - URL to an icon or image for the category.
 * @property {string} [parentId] - ID of the parent category for nested categories.
 * @property {number} [level] - Depth of the category in the hierarchy (e.g., 0 for top-level).
 * @property {'Active'|'Inactive'} status - Category status.
 * @property {string} createdAt - Timestamp when the category was created.
 * @property {string} updatedAt - Last timestamp the category was updated.
 */
export const CategoryModel = {
  id: "string/UUID",
  name: "string",
  slug: "string",
  description: "string",
  imageUrl: "string (URL)",
  parentId: "string/UUID", // Null for top-level categories
  level: "integer",
  status: "enum/string", // 'Active', 'Inactive'
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

/**
 * @typedef {Object} Brand
 * @property {string} id - Unique identifier for the brand.
 * @property {string} name - Name of the brand.
 * @property {string} slug - URL-friendly version of the name (unique).
 * @property {string} [logoUrl] - URL to the brand's logo.
 * @property {string} [description] - Optional description of the brand.
 * @property {'Active'|'Inactive'} status - Brand status.
 * @property {string} createdAt - Timestamp when the brand was created.
 * @property {string} updatedAt - Last timestamp the brand was updated.
 */
export const BrandModel = {
  id: "string/UUID",
  name: "string",
  slug: "string",
  logoUrl: "string (URL)",
  description: "string",
  status: "enum/string", // 'Active', 'Inactive'
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

/**
 * @typedef {Object} Order
 * @property {string} id - Unique identifier for the order.
 * @property {string} userId - ID of the customer who placed the order.
 * @property {string} orderNumber - Human-readable unique order number.
 * @property {number} totalAmount - Total amount of the order, including shipping and taxes.
 * @property {string} currency - Currency code of the order.
 * @property {'Pending'|'Processing'|'Shipped'|'Delivered'|'Cancelled'|'Refunded'} status - Current status of the order.
 * @property {'Pending'|'Paid'|'Failed'|'Refunded'} paymentStatus - Payment status of the order.
 * @property {string} paymentMethod - Method used for payment (e.g., "Stripe", "SSLCommerz", "Cash On Delivery").
 * @property {Object} shippingAddress - Full shipping address for this order.
 * @property {string} shippingAddress.street
 * @property {string} shippingAddress.city
 * @property {string} shippingAddress.state
 * @property {string} shippingAddress.zipCode
 * @property {string} shippingAddress.country
 * @property {string} shippingAddress.phone
 * @property {string} shippingAddress.name
 * @property {Object} [billingAddress] - Full billing address for this order (optional, defaults to shipping if not provided).
 * @property {string} billingAddress.street
 * @property {string} billingAddress.city
 * @property {string} billingAddress.state
 * @property {string} billingAddress.zipCode
 * @property {string} billingAddress.country
 * @property {string} billingAddress.phone
 * @property {string} billingAddress.name
 * @property {string} createdAt - Timestamp when the order was placed.
 * @property {string} updatedAt - Last timestamp the order status was updated.
 * @property {string} [notes] - Any special instructions from the customer.
 * @property {string} [discountCode] - Applied discount code, if any.
 * @property {number} [discountAmount] - Amount discounted from the order total.
 * @property {number} [shippingCost] - Cost of shipping for this order.
 * @property {number} [taxAmount] - Tax amount applied to the order.
 * @property {string} [trackingNumber] - Main tracking number for the entire order.
 * @property {string} [trackingUrl] - URL to external tracking page.
 * @property {string} [deliveryEstimated] - Estimated delivery date.
 */
export const OrderModel = {
  id: "string/UUID",
  userId: "string/UUID",
  orderNumber: "string",
  totalAmount: "decimal/float",
  currency: "string",
  status: "enum/string", // 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'
  paymentStatus: "enum/string", // 'Pending', 'Paid', 'Failed', 'Refunded'
  paymentMethod: "string",
  shippingAddress: {
    street: "string",
    city: "string",
    state: "string",
    zipCode: "string",
    country: "string",
    phone: "string",
    name: "string",
  },
  billingAddress: {
    street: "string",
    city: "string",
    state: "string",
    zipCode: "string",
    country: "string",
    phone: "string",
    name: "string",
  },
  createdAt: "timestamp",
  updatedAt: "timestamp",
  notes: "string",
  discountCode: "string",
  discountAmount: "decimal/float",
  shippingCost: "decimal/float",
  taxAmount: "decimal/float",
  trackingNumber: "string",
  trackingUrl: "string (URL)",
  deliveryEstimated: "timestamp",
};

/**
 * @typedef {Object} OrderItem
 * @property {string} id - Unique identifier for the order item.
 * @property {string} orderId - ID of the order this item belongs to.
 * @property {string} productId - ID of the product ordered.
 * @property {string} sellerId - ID of the seller of this specific product.
 * @property {string} productName - Name of the product at the time of order.
 * @property {string} productImage - Main image URL of the product at the time of order.
 * @property {number} quantity - Quantity of this product in the order.
 * @property {number} unitPrice - Price of one unit of the product at order time.
 * @property {number} totalPrice - `quantity * unitPrice`.
 * @property {'Processing'|'Shipped'|'Delivered'|'Returned'} status - Status specific to this order item.
 * @property {string} [trackingNumber] - Tracking number for this specific item/package (if separate).
 */
export const OrderItemModel = {
  id: "string/UUID",
  orderId: "string/UUID",
  productId: "string/UUID",
  sellerId: "string/UUID",
  productName: "string",
  productImage: "string (URL)",
  quantity: "integer",
  unitPrice: "decimal/float",
  totalPrice: "decimal/float",
  status: "enum/string", // 'Processing', 'Shipped', 'Delivered', 'Returned'
  trackingNumber: "string",
};

/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique identifier for the transaction.
 * @property {string} orderId - ID of the order associated with this transaction.
 * @property {string} userId - ID of the user who initiated the transaction.
 * @property {string} gatewayTransactionId - Transaction ID provided by the payment gateway.
 * @property {number} amount - Amount of the transaction.
 * @property {string} currency - Currency of the transaction.
 * @property {string} paymentMethod - "Stripe", "SSLCommerz", "Bkash", "Nagad", etc.
 * @property {'Charge'|'Refund'|'Payout'} type - Type of financial operation.
 * @property {'Success'|'Failed'|'Pending'|'Refunded'} status - Status of the transaction.
 * @property {string} createdAt - Timestamp when the transaction was initiated.
 * @property {string} updatedAt - Last timestamp the transaction status was updated.
 * @property {Object} [gatewayResponse] - Raw response data from the payment gateway.
 * @property {string} [failureReason] - Reason for transaction failure, if applicable.
 * @property {'Pending'|'Processed'|'Failed'} [payoutStatus] - For seller payouts: status.
 */
export const TransactionModel = {
  id: "string/UUID",
  orderId: "string/UUID",
  userId: "string/UUID",
  gatewayTransactionId: "string",
  amount: "decimal/float",
  currency: "string",
  paymentMethod: "string",
  type: "enum/string", // 'Charge', 'Refund', 'Payout'
  status: "enum/string", // 'Success', 'Failed', 'Pending', 'Refunded'
  createdAt: "timestamp",
  updatedAt: "timestamp",
  gatewayResponse: "object/JSONB",
  failureReason: "string",
  payoutStatus: "enum/string", // 'Pending', 'Processed', 'Failed'
};

/**
 * @typedef {Object} Review
 * @property {string} id - Unique identifier for the review.
 * @property {string} productId - ID of the product being reviewed.
 * @property {string} userId - ID of the user who submitted the review.
 * @property {number} rating - Star rating (1 to 5).
 * @property {string} [comment] - Detailed text of the review.
 * @property {string} createdAt - Timestamp when the review was submitted.
 * @property {string} updatedAt - Last timestamp the review was updated.
 * @property {'Pending'|'Approved'|'Rejected'} status - Review moderation status.
 * @property {number} [isHelpfulCount] - Number of users who found this review helpful.
 * @property {string} [reviewerName] - Denormalized user name for display.
 * @property {string} [reviewerProfileImage] - Denormalized user profile image URL for display.
 * @property {string} [sellerResponse] - Text of the seller's response to the review.
 * @property {string} [sellerResponseAt] - Timestamp of seller's response.
 */
export const ReviewModel = {
  id: "string/UUID",
  productId: "string/UUID",
  userId: "string/UUID",
  rating: "integer",
  comment: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  status: "enum/string", // 'Pending', 'Approved', 'Rejected'
  isHelpfulCount: "integer",
  reviewerName: "string",
  reviewerProfileImage: "string (URL)",
  sellerResponse: "string",
  sellerResponseAt: "timestamp",
};

/**
 * @typedef {Object} ChatMessage
 * @property {string} id - Unique identifier for the message.
 * @property {string} senderId - ID of the user who sent the message.
 * @property {string} receiverId - ID of the user who received the message.
 * @property {string} conversationId - Identifier for the specific chat conversation.
 * @property {string} message - The actual text content of the message.
 * @property {string} timestamp - Timestamp when the message was sent.
 * @property {boolean} isRead - Indicates if the receiver has read the message.
 * @property {'text'|'image'|'file'} type - Type of message content.
 * @property {string} [fileUrl] - URL to the shared file, if applicable.
 */
export const ChatMessageModel = {
  id: "string/UUID",
  senderId: "string/UUID",
  receiverId: "string/UUID",
  conversationId: "string/UUID", // Grouping messages, e.g., combination of sorted senderId and receiverId
  message: "string",
  timestamp: "timestamp",
  isRead: "boolean",
  type: "enum/string", // 'text', 'image', 'file'
  fileUrl: "string (URL)",
};

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique identifier for the notification.
 * @property {string} userId - ID of the user who should receive the notification.
 * @property {'OrderUpdate'|'ChatMessage'|'Promotion'|'SystemAlert'|'Review'} type - Type of notification.
 * @property {string} title - Short, catchy title for the notification.
 * @property {string} message - Full text content of the notification.
 * @property {string} [link] - URL the user should be directed to.
 * @property {boolean} isRead - Indicates if the user has read/viewed the notification.
 * @property {string} createdAt - Timestamp when the notification was generated.
 * @property {('InApp'|'Email'|'Push'|'SMS')[]} deliveryChannel - Specifies delivery channels.
 * @property {string} [sourceId] - ID of the entity that triggered the notification (e.g., orderId, chatMessageId).
 */
export const NotificationModel = {
  id: "string/UUID",
  userId: "string/UUID",
  type: "enum/string", // 'OrderUpdate', 'ChatMessage', 'Promotion', 'SystemAlert', 'Review'
  title: "string",
  message: "string",
  link: "string (URL)",
  isRead: "boolean",
  createdAt: "timestamp",
  deliveryChannel: ["enum/string"], // ['InApp', 'Email', 'Push', 'SMS']
  sourceId: "string/UUID", // Polymorphic, e.g., orderId, chatMessageId
};

/**
 * @typedef {Object} Cart
 * @property {string} id - Unique identifier for the cart.
 * @property {string} userId - ID of the user who owns the cart (unique, one-to-one).
 * @property {string} createdAt - Timestamp when the cart was created.
 * @property {string} updatedAt - Last timestamp the cart was modified.
 */
export const CartModel = {
  id: "string/UUID",
  userId: "string/UUID",
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

/**
 * @typedef {Object} CartItem
 * @property {string} id - Unique identifier for the cart item.
 * @property {string} cartId - ID of the cart this item belongs to.
 * @property {string} productId - ID of the product in the cart.
 * @property {number} quantity - Quantity of this product in the cart.
 * @property {string} addedAt - Timestamp when the item was added.
 */
export const CartItemModel = {
  id: "string/UUID",
  cartId: "string/UUID",
  productId: "string/UUID",
  quantity: "integer",
  addedAt: "timestamp",
};

/**
 * @typedef {Object} Wishlist
 * @property {string} id - Unique identifier for the wishlist.
 * @property {string} userId - ID of the user who owns the wishlist (unique, one-to-one).
 * @property {string} createdAt - Timestamp when the wishlist was created.
 * @property {string} updatedAt - Last timestamp the wishlist was modified.
 */
export const WishlistModel = {
  id: "string/UUID",
  userId: "string/UUID",
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

/**
 * @typedef {Object} WishlistItem
 * @property {string} id - Unique identifier for the wishlist item.
 * @property {string} wishlistId - ID of the wishlist this item belongs to.
 * @property {string} productId - ID of the product in the wishlist.
 * @property {string} addedAt - Timestamp when the item was added.
 */
export const WishlistItemModel = {
  id: "string/UUID",
  wishlistId: "string/UUID",
  productId: "string/UUID",
  addedAt: "timestamp",
};

/**
 * @typedef {Object} Post
 * @property {string} id - Unique identifier for the post.
 * @property {string} title - Title of the blog post or article.
 * @property {string} slug - URL-friendly version of the title (unique).
 * @property {string} content - Full content of the post (e.g., HTML, Markdown).
 * @property {string} [excerpt] - Short summary of the post for previews.
 * @property {string} authorId - ID of the user who authored the post.
 * @property {string} [featuredImage] - URL to the main image associated with the post.
 * @property {string} category_id - ID of the main category the post belongs to.
 * @property {string} [sub_category_id] - ID of the specific subcategory within the main category.
 * @property {Object} [sub_category] - Denormalized object for the subcategory details.
 * @property {string} sub_category._id - ID of the subcategory.
 * @property {string} sub_category.name - Name of the subcategory.
 * @property {string} sub_category.slug - Slug of the subcategory.
 * @property {string[]} [tags] - Keywords relevant to the post for search and categorization.
 * @property {'Draft'|'Published'|'Archived'} status - Status of the post.
 * @property {string} createdAt - Timestamp when the post was first created.
 * @property {string} updatedAt - Last timestamp the post content was modified.
 * @property {string} [publishedAt] - Timestamp when the post was first published.
 * @property {string} [seoTitle] - Optimized title for search engine results.
 * @property {string} [seoDescription] - Optimized description for search engine results.
 * @property {string[]} [metaKeywords] - Keywords for SEO meta tags.
 * @property {number} [viewsCount] - Number of times the post has been viewed.
 */
export const PostModel = {
  id: "string/UUID",
  title: "string",
  slug: "string",
  content: "string",
  excerpt: "string",
  authorId: "string/UUID",
  featuredImage: "string (URL)",
  category_id: "string/UUID",
  sub_category_id: "string/UUID",
  sub_category: {
    _id: "string/UUID",
    name: "string",
    slug: "string",
  },
  tags: ["string"],
  status: "enum/string", // 'Draft', 'Published', 'Archived'
  createdAt: "timestamp",
  updatedAt: "timestamp",
  publishedAt: "timestamp",
  seoTitle: "string",
  seoDescription: "string",
  metaKeywords: ["string"],
  viewsCount: "integer",
};