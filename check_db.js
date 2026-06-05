const mongoose = require("mongoose");
const Application = require("./server/models/Application");

mongoose.connect("mongodb://127.0.0.1:27017/university_db").then(async () => {
    const app = await Application.findOne().sort({ createdAt: -1 });
    console.log("Latest application documents:", app?.documents);
    console.log("JSON map:", JSON.stringify(app?.documents));
    process.exit(0);
}).catch(console.error);
