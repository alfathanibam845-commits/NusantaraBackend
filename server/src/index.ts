import "dotenv/config";
import express from "express";
import cors from "cors";

import usersRoute from "./routes/users.route";
import authRoute from "./controllers/auth/auth.route";
import postsRoute from "./routes/posts/posts.route";
import categoriesRoute from "./routes/categories.route";

const app = express();
const PORT = 5002;

// CORS
app.use(cors({
  origin: true,
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postsRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/categories", categoriesRoute);

// Test server
app.get("/", (req, res) => {
  res.send("hello ibam");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(
    `[server]: server is running at http://localhost:${PORT}`
  );
});