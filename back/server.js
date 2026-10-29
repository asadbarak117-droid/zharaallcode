require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const homeRoutes = require("./routes/homeroute");
const productRoutes = require("./routes/productroute");
const headerRoutes = require("./routes/headeroute");
const conectRoutes = require("./routes/conectroute");
const messageRoutes = require("./routes/messageroute");
const consultationRoutes = require("./routes/consultationroute");
const consultationRequestRoutes = require("./routes/consultationRequestRoute");
const accountingRoutes = require("./routes/accountingroute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is working" });
});

app.use("/api/home", homeRoutes);
app.use("/api/productsection", productRoutes);
app.use("/api/header", headerRoutes);
app.use("/api/conect", conectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/consultation-requests", consultationRequestRoutes);
app.use("/api/beauty-problems", consultationRoutes);
app.use("/api/accounting", accountingRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
