import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/medikiosk";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for seeding");

    const db = mongoose.connection.db;
    if (!db) {
      console.error("Database connection failed");
      process.exit(1);
    }

    // Clear existing for hackathon reset
    await db.collection("patients").deleteMany({});
    console.log("Cleared existing patients");

    const hashedPassword = await bcrypt.hash("password123", 10);
    await db.collection("patients").insertOne({
      patientIdStr: "PT-42945",
      name: "Rahul Mehta",
      age: 32,
      gender: "Male",
      phone: "9876543210",
      password: hashedPassword,
      abhaId: "91-1234-5678-9012",
      createdAt: new Date(),
    });
    console.log("Demo user Rahul Mehta (PT-42945) seeded successfully");

    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
