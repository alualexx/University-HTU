const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkPasswords = async () => {
    console.log('Using URI:', process.env.MONGO_URI);
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const emails = ['dean@university.edu', 'head@university.edu'];
        for (const email of emails) {
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                console.log(`User not found: ${email}`);
                continue;
            }

            const isMatch = await bcrypt.compare('password123', user.password);
            console.log(`User: ${email}`);
            console.log(`Password 'password123' matches: ${isMatch}`);
            console.log(`Stored hash: ${user.password}`);
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

checkPasswords();
