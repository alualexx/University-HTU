const express = require("express");
const router = express.Router();
const ResearchProject = require("../models/ResearchProject");
const { protect } = require("../middleware/auth");

// @desc    Get all research projects
// @route   GET /api/research
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { department, college } = req.query;
    let query = {};
    if (department) query.department = department;
    if (college) query.college = college;

    const projects = await ResearchProject.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a research project
// @route   POST /api/research
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, pi, grant, status } = req.body;
    const project = await ResearchProject.create({
      title,
      pi,
      grant,
      status,
      createdBy: req.user._id,
      department: req.user.department,
      college: req.user.college,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a research project
// @route   PUT /api/research/:id
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await ResearchProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    Object.assign(project, req.body);
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
