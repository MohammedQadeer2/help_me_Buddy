const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const ServiceCategory = require("./models/ServiceCategory");
const Provider = require("./models/Provider");
const bcrypt = require("bcryptjs");

// Top 10 categories
const categoryData = [
  { name: "Plumber", keywords: ["water", "leaking", "pipe", "drain", "sink", "toilet"] },
  { name: "Electrician", keywords: ["electricity", "wiring", "power", "switch", "light", "shock"] },
  { name: "Carpenter", keywords: ["wood", "furniture", "door", "cabinet", "table"] },
  { name: "Painter", keywords: ["paint", "wall", "color", "brush"] },
  { name: "Cleaner", keywords: ["clean", "dust", "mop", "sweep", "tidy", "trash"] },
  { name: "Mechanic", keywords: ["car", "auto", "engine", "repair", "brakes"] },
  { name: "Landscaper", keywords: ["garden", "grass", "lawn", "mow", "yard"] },
  { name: "HVAC Technician", keywords: ["ac", "heating", "cooling", "air conditioner", "thermostat"] },
  { name: "Locksmith", keywords: ["lock", "key", "door", "security"] },
  { name: "Appliance Repair", keywords: ["fridge", "washer", "dryer", "oven", "stove", "microwave"] }
];

const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kevin", "Brian", "George", "Edward", "Ronald"];
const locations = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA"];
const descriptions = ["Expert with 10+ years of experience.", "Fast, reliable, and affordable.", "Top rated professional in the area.", "Available 24/7 for emergencies.", "Friendly service guaranteed."];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Insert Categories
    console.log("Seeding categories...");
    await ServiceCategory.deleteMany({});
    const createdCategories = await ServiceCategory.insertMany(categoryData);
    
    console.log("Seeding providers and users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const providers = [];
    
    for (let i = 0; i < 25; i++) {
        // create a user
        const user = new User({
            name: firstNames[i],
            email: `provider${i}@example.com`,
            password: hashedPassword,
          roles: ["user", "provider"],
          isProvider: true,
        });
        await user.save();
        
        // assign random category
        const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
        
        const provider = new Provider({
            userId: user._id,
            category: randomCategory._id,
            pricePerHour: Math.floor(Math.random() * 80) + 20,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
            totalJobs: Math.floor(Math.random() * 500) + 1,
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            isAvailable: Math.random() > 0.2 // 80% available
        });
        
        providers.push(provider);
    }
    
    await Provider.insertMany(providers);
    console.log(`Successfully inserted 10 Categories and 25 Providers!`);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();