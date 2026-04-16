import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear out existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // 1. Create Core Users (Owner, Admin, Delivery)
    const coreUsers = [
      {
        name: 'Admin Owner',
        email: 'admin@grocery.com',
        password: await bcrypt.hash('123456', 10),
        role: 'owner',
        phone: '1234567890',
        address: '123 Grocery Lane, Market City',
      },
      {
        name: 'Delivery Agent',
        email: 'delivery@grocery.com',
        password: await bcrypt.hash('123456', 10),
        role: 'delivery_agent',
        phone: '0987654321',
        address: '456 Driver St, Route City',
      }
    ];

    // Create 50 simulated customers with real names
    const realNames = [
      'Yogesh Kumar', 'Vinesh Raj', 'Mukilan S', 'Nanditha R', 'Sathya Narayanan',
      'Priya Sharma', 'Ravi Chandran', 'Ananya Reddy', 'Vikram Patel', 'Meena Iyer',
      'Arjun Nair', 'Divya Gupta', 'Karthik Menon', 'Sneha Das', 'Rohit Joshi',
      'Deepika Ramesh', 'Arun Prasad', 'Lakshmi Devi', 'Harish Kannan', 'Pooja Verma',
      'Suresh Babu', 'Kavitha Sundaram', 'Rajesh Pillai', 'Swathi Mohan', 'Ganesh Murthy',
      'Revathi Krishnan', 'Naveen Reddy', 'Janani Subramanian', 'Vignesh Ram', 'Nithya Shankar',
      'Ashwin Kumar', 'Sowmya Venkat', 'Prasanna Satish', 'Bhavya Rajan', 'Manoj Selvam',
      'Thilaga Sekar', 'Dinesh Balaji', 'Keerthana Gopal', 'Surya Prakash', 'Aadhira Senthil',
      'Kiran Dev', 'Madhu Priya', 'Sanjay Rao', 'Ishwarya Mahesh', 'Balaji Murugan',
      'Dharani Kumari', 'Tharun Vikram', 'Nandhini Saravanan', 'Praveen Raj', 'Amrutha Varshini'
    ];

    const mockCustomers = [];
    for (let i = 0; i < 50; i++) {
        mockCustomers.push({
            name: realNames[i],
            email: `${realNames[i].split(' ')[0].toLowerCase()}${i + 1}@freshgrocer.com`,
            password: await bcrypt.hash('123456', 10),
            role: 'customer',
            phone: `${['98','97','96','95','94','93','88','87','86','85'][Math.floor(Math.random()*10)]}${Math.floor(10000000 + Math.random() * 89999999)}`,
            address: `${Math.floor(1 + Math.random() * 200)}, ${['MG Road','Anna Nagar','Koramangala','T Nagar','Banjara Hills','Park Street','Viman Nagar','Jubilee Hills','Whitefield','HSR Layout','Velachery','Adyar','Mylapore','Guindy'][Math.floor(Math.random()*14)]}, ${['Bengaluru','Chennai','Hyderabad','Mumbai','Pune','Kolkata','Delhi','Coimbatore'][Math.floor(Math.random()*8)]}`,
        });
    }

    const createdUsers = await User.insertMany([...coreUsers, ...mockCustomers]);
    const adminUser = createdUsers[0]._id;

    // 2. Create Sample Products
    const mockProducts = [
      {
        name: 'Fresh Red Tomatoes',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Locally sourced, organic farm fresh tomatoes.',
        category: 'vegetables',
        price: 45,
        countInStock: 100,
        purchaseCount: Math.floor(Math.random() * (150 - 20) + 20),
        user: adminUser,
      },
      {
        name: 'Green Bell Peppers',
        image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Crisp green bell peppers, perfect for salads and cooking.',
        category: 'vegetables',
        price: 60,
        countInStock: 80,
        purchaseCount: Math.floor(Math.random() * (150 - 20) + 20),
        user: adminUser,
      },
      {
        name: 'Organic Bananas',
        image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&q=60',
        description: 'Naturally sweet and organic bananas.',
        category: 'fruits',
        price: 80,
        countInStock: 150,
        purchaseCount: Math.floor(Math.random() * (150 - 20) + 20),
        user: adminUser,
      },
      {
        name: 'Kashmir Apples',
        image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Premium quality apples originating from Kashmir.',
        category: 'fruits',
        price: 150,
        countInStock: 50,
        purchaseCount: Math.floor(Math.random() * (150 - 20) + 20),
        user: adminUser,
      },
      {
        name: 'Premium Basmati Rice',
        image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&q=60',
        description: 'Aromatic basmati rice for daily use.',
        category: 'grocery',
        price: 65,
        countInStock: 300,
        purchaseCount: Math.floor(Math.random() * (150 - 20) + 20),
        user: adminUser,
      },
      {
        name: 'Whole Wheat Bread',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Freshly baked daily whole wheat bread log.',
        category: 'grocery',
        price: 35,
        countInStock: 40,
        purchaseCount: Math.floor(Math.random() * (150 - 20) + 20),
        user: adminUser,
      },
      {
        name: 'Farm Fresh Eggs (12 pcs)',
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&q=60',
        description: 'A dozen locally sourced fresh eggs.',
        category: 'grocery',
        price: 85,
        countInStock: 120,
        purchaseCount: Math.floor(Math.random() * (150 - 20) + 20),
        user: adminUser,
      },
      {
        name: 'Hass Avocados',
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Creamy high quality Hass avocados.',
        category: 'fruits',
        price: 199,
        countInStock: 30,
        purchaseCount: Math.floor(Math.random() * (150 - 20) + 20),
        user: adminUser,
      }
    ];

    const createdProducts = await Product.insertMany(mockProducts);
    const deliveryAgent = createdUsers[1]._id;

    // 3. Create Sample Orders assigned to the delivery agent
    const customerNames = [
      'Priya Sharma', 'Ravi Kumar', 'Ananya Reddy', 'Vikram Patel', 'Meena Iyer',
      'Arjun Nair', 'Divya Gupta', 'Karthik Menon', 'Sneha Das', 'Rohit Joshi'
    ];
    const addresses = [
      '12 MG Road, Bengaluru', '45 Anna Nagar, Chennai', '78 Banjara Hills, Hyderabad',
      '23 Park Street, Kolkata', '56 Connaught Place, Delhi', '89 Koregaon Park, Pune',
      '34 Marine Drive, Mumbai', '67 Jubilee Hills, Hyderabad', '91 Whitefield, Bengaluru',
      '15 Adyar, Chennai'
    ];
    const phones = [
      '9876543210', '9988776655', '8877665544', '7766554433', '9654321098',
      '8765432109', '7890123456', '9012345678', '8901234567', '9123456780'
    ];

    const statuses = ['Assigned', 'Out for Delivery', 'Delivered', 'Assigned', 'Out for Delivery',
                      'Delivered', 'Assigned', 'Delivered', 'Out for Delivery', 'Delivered'];

    const sampleOrders = [];
    for (let i = 0; i < 10; i++) {
      const randomProducts = [];
      const numItems = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numItems; j++) {
        const randProd = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        randomProducts.push({
          name: randProd.name,
          quantity: Math.floor(Math.random() * 3) + 1,
          image: randProd.image,
          price: randProd.price,
          product: randProd._id,
        });
      }

      const itemsPrice = randomProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const taxPrice = Math.round(itemsPrice * 0.05);
      const shippingPrice = itemsPrice > 500 ? 0 : 40;

      // Pick a random customer from the 50 simulated ones (index 2 onward)
      const randomCustomer = createdUsers[2 + Math.floor(Math.random() * 50)];

      sampleOrders.push({
        user: randomCustomer._id,
        orderItems: randomProducts,
        shippingAddress: {
          address: addresses[i],
          phone: phones[i],
        },
        paymentMethod: ['COD', 'Online', 'Credit'][Math.floor(Math.random() * 3)],
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice: itemsPrice + taxPrice + shippingPrice,
        isPaid: Math.random() > 0.3,
        paidAt: new Date(),
        status: statuses[i],
        deliveryAgent: deliveryAgent,
        deliveredAt: statuses[i] === 'Delivered' ? new Date(Date.now() - Math.random() * 86400000 * 5) : null,
      });
    }

    await Order.insertMany(sampleOrders);
    
    console.log('Mock Data successfully seeded! Added 50 users, products, and 10 sample orders.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
   console.log('Data destruction flag used.');
} else {
  importData();
}
