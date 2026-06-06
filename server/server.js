const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// create HTTP server
const server = http.createServer(app);

// socket setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// make io accessible everywhere
app.set("io", io);

// ✅ ONLY THIS (remove inline io.on)
require("./sockets/socket")(io);


// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/shops", require("./routes/shopRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/owner", require("./routes/ownerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));


// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// start server
server.listen(5000, () => console.log("Server running on port 5000"));