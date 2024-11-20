import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import UserSchema from "../models/user.model.js";

config();

const seedUsers = [
  {
    email: "emma.thompson@example.com",
    fName: "Emma Thompson",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.miller@example.com",
    fName: "Olivia Miller",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.davis@example.com",
    fName: "Sophia Davis",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.wilson@example.com",
    fName: "Ava Wilson",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabella.brown@example.com",
    fName: "Isabella Brown",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "mia.johnson@example.com",
    fName: "Mia Johnson",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte.williams@example.com",
    fName: "Charlotte Williams",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "amelia.garcia@example.com",
    fName: "Amelia Garcia",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    email: "james.anderson@example.com",
    fName: "James Anderson",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "william.clark@example.com",
    fName: "William Clark",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "benjamin.taylor@example.com",
    fName: "Benjamin Taylor",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "lucas.moore@example.com",
    fName: "Lucas Moore",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henry.jackson@example.com",
    fName: "Henry Jackson",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "alexander.martin@example.com",
    fName: "Alexander Martin",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "daniel.rodriguez@example.com",
    fName: "Daniel Rodriguez",
    password: "1234567890",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await UserSchema.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
