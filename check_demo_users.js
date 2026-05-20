const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

// Load models using absolute paths
const User = require(path.join(__dirname, 'server', 'models', 'User'));

const checkUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/university-system';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    
    const users = await User.find({ 
      email: { $in: ['dean@university.edu', 'head@university.edu', 'admin@university.edu', 'student@university.edu'] } 
    }).select('+password');
    
    console.log('Users found:', users.length);
    for (const u of users) {
      const isMatch = await bcrypt.compare('password123', u.password);
      console.log(`Email: ${u.email} | Role: ${u.role} | Password Match: ${isMatch}`);
    }
    
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
};

checkUsers();
