const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: ["student", "teacher", "faculty", "registrar", "admin", "college_admin"],
      default: "student",
    },
    // Student-specific
    studentId: { type: String },
    year: { type: String },
    // Staff-specific
    employeeId: { type: String },
    position: { type: String },
    department: { type: String },
    college: { type: String },
    // Account management
    disabled: { type: Boolean, default: false },
    requiresPasswordChange: { type: Boolean, default: false },
    tempPassword: { type: String, select: false },
    lastPasswordUpdate: { type: Date },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
