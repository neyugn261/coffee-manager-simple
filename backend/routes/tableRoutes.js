const express = require("express");
const tableController = require("../controllers/tableController");
const { authenticateApiKey } = require("../middlewares/authMiddleware");

const router = express.Router();

// Áp dụng middleware xác thực cho tất cả routes
router.use(authenticateApiKey);

// Routes quản lý bàn
router.get("/", tableController.getAllTables);                    // Lấy tất cả bàn
router.get("/available", tableController.getAvailableTables);     // Lấy bàn trống
router.get("/:id", tableController.getTableById);                // Lấy bàn theo ID

router.post("/", tableController.createTable);                   // Tạo bàn mới
router.post("/merge", tableController.mergeTables);              // Gộp bàn
router.post("/:id/split", tableController.splitTables);          // Tách bàn
router.post("/:id/occupy", tableController.occupyTable);         // Đặt bàn
router.post("/:id/checkout", tableController.checkoutTable);     // Checkout bàn

router.patch("/:id/status", tableController.updateTableStatus);    // Cập nhật trạng thái
router.patch("/:id", tableController.updateTable);                // Cập nhật thông tin bàn

router.delete("/:id", tableController.deleteTable);              // Xóa bàn

module.exports = router;
