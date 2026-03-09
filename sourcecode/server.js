const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Use the secret values from Kubernetes environment variables
const dbUser = process.env.MONGO_USER;
const dbPass = process.env.MONGO_PASS;

const app = express();

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(
`mongodb://${dbUser}:${dbPass}@mongodb-service:27017/simple-login-app?authSource=admin`
)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User schema/model
const User = mongoose.model("User", {
  username: String,
  password: String,
});

// Login page (HTML)
app.get("/", (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" required /><br/>
      <input name="password" type="password" placeholder="Password" required /><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("BODY:", req.body);

  const user = await User.findOne({ username });

  if (!user) {
    return res.send("User not found");
  }

  const valid = await bcrypt.compare(password, user.password);
  
  if (!valid) {
    return res.send("Wrong password");
  }

  res.send("Login successful!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
