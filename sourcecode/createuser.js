const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const dbUser = process.env.MONGO_USER;
const dbPass = process.env.MONGO_PASS;

async function main() {
  try {
    await mongoose.connect(
 	`mongodb://${dbUser}:${dbPass}@mongodb-service:27017/simple-login-app?authSource=admin`    
	);

    console.log("MongoDB connected");

    const User = mongoose.model(
      "User",
      new mongoose.Schema({
        username: String,
        password: String,
      })
    );

    const adminExists = await User.findOne({ username: dbUser });

    if (adminExists) {
      console.log("Admin already exists:", adminExists);
    } else {
      const hash = await bcrypt.hash(dbPass, 10);

      const admin = await User.create({
        username: dbUser,
        password: hash,
      });

      console.log("Created admin user from secret");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}

main();
