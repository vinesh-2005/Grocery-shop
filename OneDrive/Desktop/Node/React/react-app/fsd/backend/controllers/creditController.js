import User from '../models/User.js';
import CreditTransaction from '../models/CreditTransaction.js';

// @desc    Get user's credit status and transactions
// @route   GET /api/credit/my
// @access  Private
const getMyCreditStatus = async (req, res) => {
  const transactions = await CreditTransaction.find({ user: req.user._id }).sort({ createdAt: -1 });
  const user = await User.findById(req.user._id).select('totalDue creditLimit lastPaymentDate');

  res.json({ transactions, totalDue: user.totalDue, creditLimit: user.creditLimit, lastPaymentDate: user.lastPaymentDate });
};

// @desc    Get all users with due amounts
// @route   GET /api/credit/dues
// @access  Private/Owner
const getAllUserDues = async (req, res) => {
  const users = await User.find({ totalDue: { $gt: 0 } }).select('name email phone totalDue creditLimit lastPaymentDate');
  res.json(users);
};

// @desc    Make a payment against credit
// @route   POST /api/credit/payment
// @access  Private
const makeCreditPayment = async (req, res) => {
  const { amount, description } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.totalDue -= Number(amount);
    user.lastPaymentDate = Date.now();
    await user.save();

    const transaction = await CreditTransaction.create({
      user: user._id,
      amount: -Number(amount),
      type: 'Payment',
      description: description || `Payment of ${amount} received`,
    });

    res.status(201).json(transaction);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Set credit limit for a user
// @route   PUT /api/credit/limit/:userId
// @access  Private/Owner
const setUserIdCreditLimit = async (req, res) => {
  const { creditLimit } = req.body;
  const user = await User.findById(req.params.userId);

  if (user) {
    user.creditLimit = creditLimit;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

export { getMyCreditStatus, getAllUserDues, makeCreditPayment, setUserIdCreditLimit };
