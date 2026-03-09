const dbUser = process.env.MONGO_USER;
const dbPass = process.env.MONGO_PASS;
const dbHost = process.env.MONGO_HOST || "mongodb-service"; 

async function main() {
  try {
    // 2. Use the variable instead of hardcoding the name
    await mongoose.connect(
        `mongodb://${dbUser}:${dbPass}@${dbHost}:27017/simple-login-app?authSource=admin`
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
