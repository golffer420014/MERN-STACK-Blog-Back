const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const blogRoute = require("./route/blog");
const authRoute = require("./route/auth");

const app = express();

// เชื่อมต่อกับฐานข้อมูล MongoDB ที่เก็บบน cloud
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  })
  .then(() => console.log("เชื่อมต่อฐานข้อมูลเรียบร้อย"))
  .catch((err) => console.log(err));

// Middleware ที่ใช้กำหนดค่าต่าง ๆ
app.use(express.json()); // ให้ Express สามารถอ่าน JSON ที่ส่งมาใน request
app.use(cors()); // เปิดให้บริการ Cross-Origin Resource Sharing (CORS)
app.use(morgan("dev")); // บันทึกข้อมูล request ใน console ในรูปแบบ "dev"

// กำหนดเส้นทาง
// http://localhost:5500/api/blog
app.use("/api", blogRoute);
// http://localhost:5500/api/login
app.use("/api", authRoute);

const port = process.env.PORT || 5500;

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`เซิร์ฟเวอร์เริ่มทำงานที่พอร์ต ${port}`);
});
