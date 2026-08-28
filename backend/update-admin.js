const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const db = mongoose.connection.db;

        const result = await db.collection("users").updateOne(
            { role: "admin" },
            { $set: { mobile: "8870845373" } }
        );

        if (result.matchedCount === 0) {
            console.log("No admin found");
        } else if (result.modifiedCount === 0) {
            console.log("Admin found, but mobile was already 8870845373");
        } else {
            console.log("Admin mobile updated to 8870845373");
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

run();
