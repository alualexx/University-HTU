const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    }
});

const collegeBudgetSchema = new mongoose.Schema(
    {
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            required: true,
            unique: true,
        },
        fiscalYear: {
            type: String,
            required: true,
        },
        totalBudget: {
            type: Number,
            required: true,
            min: 0,
        },
        allocations: [allocationSchema],
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("CollegeBudget", collegeBudgetSchema);
