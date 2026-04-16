import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '/images/sample.jpg',
    },
    category: {
      type: String,
      required: true,
      enum: ['vegetables', 'fruits', 'grocery', 'other'],
      default: 'grocery',
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
