const { json } = require("express");
const Blog = require("../models/blog");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const blog = require("../models/blog");

// express: เป็นไลบรารีที่ช่วยในการสร้างและจัดการเซิร์ฟเวอร์ของแอปพลิเคชัน Node.js.
// Blog: เป็นโมเดล (model) ที่นำมาใช้ในการจัดเก็บข้อมูลบทความในฐานข้อมูล.
// slugify: เป็นไลบรารีที่ใช้ในการสร้าง slug จากข้อความ เช่น แทนที่เว้นวรรคด้วยเครื่องหมายขีดล่าง.
// uuidv4: ใช้สร้าง UUID (Universally Unique Identifier) เพื่อให้แน่ใจว่า slug ไม่ซ้ำกัน.

// create
exports.create = (req, res) => {
  // ดึงข้อมูลจาก body ของ request
  const { title, content, author } = req.body;
  let slug = slugify(title);

  // ถ้าไม่มี slug ให้สร้าง UUID
  if (!slug) slug = uuidv4();

  // ตรวจสอบข้อมูล
  switch (true) {
    case !title:
      return res.status(400).json({ error: "กรุณาป้อนชื่อบทความ" });
    case !content:
      return res.status(400).json({ error: "กรุณาป้อนเนื้อหา" });
  }

  // บันทึกข้อมูลลงในฐานข้อมูล
  Blog.create({ title, content, author, slug }, (err, blog) => {
    if (err) {
      // ตรวจสอบข้อผิดพลาดเช่น บทความที่มีชื่อซ้ำกัน
      if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
        return res
          .status(400)
          .json({ error: "บทความนี้มีชื่อซ้ำกับบทความอื่น" });
      }
      return res.status(400).json({ error: err.message });
    }
    res.json(blog);
  });
};

// list
exports.list = (req, res) => {
  // ดึงข้อมูลบทความทั้งหมดจากฐานข้อมูล
  Blog.find({}, (err, blogs) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(blogs);
  });
};

// read
exports.read = (req, res) => {
  // ดึงข้อมูลบทความตาม slug จากพารามิเตอร์ของ URL
  const { slug } = req.params;
  Blog.findOne({ slug }).exec((err, blog) => {
    res.json(blog);
  });
};

// delete
exports.remove = (req, res) => {
  // ดึง slug จากพารามิเตอร์ของ URL
  const { slug } = req.params;
  // ลบบทความตาม slug จากฐานข้อมูล
  Blog.findOneAndRemove({ slug }).exec((err, blog) => {
    if (err) console.log(err);
    res.json({
      message: "ลบบทความเรียบร้อย",
    });
  });
};

// delete
exports.update = (req, res) => {
  // ดึง slug จากพารามิเตอร์ของ URL
  const { slug } = req.params;
  const { title, content, author } = req.body;
  // ลบบทความตาม slug จากฐานข้อมูล
  Blog.findOneAndUpdate(
    { slug },
    {
      title,
      content,
      author,
      // slug:title
    }, 
    { new: true }
  )
  .exec((err, blog) => {
    if (err) console.log(err);
    res.json(blog);
  });
};
