import ProductRequest from '../models/ProductRequest.js';
import User from '../models/User.js';

// @desc    Create a new product request
// @route   POST /api/requests
// @access  Private (Customer)
const createRequest = async (req, res) => {
  try {
    const { productName, details } = req.body;

    const request = new ProductRequest({
      user: req.user._id,
      productName,
      details,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500);
    throw new Error('Could not create product request');
  }
};

// @desc    Get all product requests
// @route   GET /api/requests
// @access  Private (Owner)
const getRequests = async (req, res) => {
  try {
    const requests = await ProductRequest.find({})
      .populate('user', 'id name email phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching requests');
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private (Owner)
const updateRequestStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const request = await ProductRequest.findById(req.params.id);

    if (request) {
      request.status = status || request.status;
      if (notes !== undefined) {
        request.notes = notes;
      }

      const updatedRequest = await request.save();
      // Populate user data before returning
      await updatedRequest.populate('user', 'name email');
      
      res.json(updatedRequest);
    } else {
      res.status(404);
      throw new Error('Request not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Error updating request');
  }
};

// @desc    Get my product requests
// @route   GET /api/requests/mine
// @access  Private
const getMyRequests = async (req, res) => {
  try {
    const requests = await ProductRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching my requests');
  }
};

export { createRequest, getRequests, updateRequestStatus, getMyRequests };
