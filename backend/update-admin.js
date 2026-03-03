const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model("User", new mongoose.Schema({
            name: String, mobile: String, email: String, role: String
        }), "users"); // explicit collection name

        // Update the first admin user
        const admin = await User.findOne({ role: "admin" });
        if (admin) {
            admin.mobile = "8870845373"; // Setting a known mobile for admin
            await admin.save();
            console.log("Admin mobile updated to 8870845373");
        } else {
            console.log("No admin found");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
run();
