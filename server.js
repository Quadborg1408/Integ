const express = require("express");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3000;

app.use(express.static("Public"));

app.get("/api/questions", async (req, res) => {
    const amount = req.query.amount || 10;
    const difficulty = req.query.difficulty || "medium";

    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=13&difficulty=${difficulty}&type=multiple`);
        const data = await response.json();
        res.json(data.results);
    } catch(err) {
        res.status(500).json({ error: "Failed to fetch questions" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});