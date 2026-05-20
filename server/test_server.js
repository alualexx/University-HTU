const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Hello World"));
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    process.exit(0);
});
