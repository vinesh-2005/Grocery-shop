import mongoose from 'mongoose';

const creditTransactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Credit Purchase', 'Payment'],
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CreditTransaction = mongoose.model('CreditTransaction', creditTransactionSchema);

export default CreditTransaction;
