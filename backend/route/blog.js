const express = require("express");
const router = express.Router();
const {
    create,
    list,
    read,
    remove,
    update,
} = require("../controller/blogController");
const { requireLogin } = require("../controller/authController");

// http://localhost:5500/api/blog/
router.post("/blog", requireLogin, create);
router.get("/blog", list);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireLogin, remove);
router.put("/blog/:slug", requireLogin, update);

module.exports = router;
