const tableService = require("../services/tableService");

class TableController {
    // GET /api/tables - Lấy tất cả bàn
    async getAllTables(req, res) {
        try {
            const tables = await tableService.getAllTables();
            res.json({
                success: true,
                data: tables,
                message: 'Lấy danh sách bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/tables/:id - Lấy bàn theo ID
    async getTableById(req, res) {        
        try {
            const { id } = req.params;
            const table = await tableService.getTableById(parseInt(id));
            
            res.json({
                success: true,
                data: table,
                message: 'Lấy thông tin bàn thành công'
            });
        } catch (error) {
           next(error);
        }
    }

    // POST /api/tables - Tạo bàn mới
    async createTable(req, res) {
        try {          
            const table = await tableService.createTable(req.body);
            
            res.status(201).json({
                success: true,
                data: table,
                message: 'Tạo bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/tables/:id - Cập nhật thông tin bàn
    async updateTable(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const table = await tableService.updateTable(parseInt(id), updates);
            res.json({
                success: true,
                data: table,
                message: 'Cập nhật thông tin bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/tables/:id/status - Cập nhật trạng thái bàn
    async updateTableStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Trạng thái là bắt buộc'
                });
            }

            const table = await tableService.updateTableStatus(parseInt(id), status);
            
            res.json({
                success: true,
                data: table,
                message: 'Cập nhật trạng thái bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/tables/merge - Gộp bàn
    async mergeTables(req, res) {
        try {
            const { hostId, tableIds } = req.body;         

            const result = await tableService.mergeTables(parseInt(hostId), tableIds.map(id => parseInt(id)));
            
            res.json({
                success: true,
                data: result,
                message: 'Gộp bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/tables/:id/split - Tách bàn
    async splitTables(req, res) {
        try {
            const { id } = req.params;
            const result = await tableService.splitTables(parseInt(id));
            res.json({
                success: true,
                data: result,
                message: 'Tách bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/tables/:id - Xóa bàn
    async deleteTable(req, res) {
        try {
            const { id } = req.params;
            const result = await tableService.deleteTable(parseInt(id));
            
            res.json({
                success: true,
                data: result,
                message: 'Xóa bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/tables/available - Lấy bàn trống
    async getAvailableTables(req, res) {
        try {
            const tables = await tableService.getAvailableTables();
            
            res.json({
                success: true,
                data: tables,
                message: 'Lấy danh sách bàn trống thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/tables/:id/occupy - Đặt bàn
    async occupyTable(req, res) {
        try {
            const { id } = req.params;
            const table = await tableService.occupyTable(parseInt(id));
            
            res.json({
                success: true,
                data: table,
                message: 'Đặt bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/tables/:id/checkout - Checkout bàn
    async checkoutTable(req, res) {
        try {
            const { id } = req.params;
            const table = await tableService.checkoutTable(parseInt(id));
            
            res.json({
                success: true,
                data: table,
                message: 'Checkout bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/tables/:id - Xóa bàn
    async deleteTable(req, res) {
        try {
            const { id } = req.params;
            await tableService.deleteTable(parseInt(id));
            
            res.json({
                success: true,
                message: 'Xóa bàn thành công'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TableController();
