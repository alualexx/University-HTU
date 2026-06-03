const express = require("express");
const router = express.Router();
const CollegeBudget = require("../models/CollegeBudget");
const { protect } = require("../middleware/auth");

// @route   GET /api/budgets
// @desc    Get college budget
// @access  Private
router.get("/", protect, async (req, res) => {
    try {
        const { collegeId } = req.query;
        if (!collegeId) return res.status(400).json({ message: "collegeId is required" });
        const budget = await CollegeBudget.findOne({ collegeId });
        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/budgets
// @desc    Create/Update college budget
// @access  Private
router.post("/", protect, async (req, res) => {
    try {
        const { collegeId, totalBudget, allocations, fiscalYear } = req.body;
        let budget = await CollegeBudget.findOne({ collegeId });

        if (budget) {
            budget.totalBudget = totalBudget;
            budget.allocations = allocations;
            budget.fiscalYear = fiscalYear;
            budget.balance = totalBudget - allocations.reduce((acc, curr) => acc + curr.amount, 0);
            budget.updatedBy = req.user.id;
            await budget.save();
        } else {
            const balance = totalBudget - allocations.reduce((acc, curr) => acc + curr.amount, 0);
            budget = await CollegeBudget.create({
                collegeId,
                totalBudget,
                allocations,
                fiscalYear,
                balance,
                updatedBy: req.user.id
            });
        }
        res.json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
