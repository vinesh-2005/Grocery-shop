import mongoose from 'mongoose';

const productRequestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    productName: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'In Inventory', 'Rejected'],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ProductRequest = mongoose.model('ProductRequest', productRequestSchema);

export default ProductRequest;
