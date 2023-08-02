import { Request, Response, NextFunction } from "express";
import Users from "../models/user.model";
import { UserRole } from "types/user"; // Đường dẫn tới file chứa enum UserRole

export const authorize = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lấy thông tin người dùng từ cơ sở dữ liệu bằng ID người dùng trong token (nếu có)
      const userId = req.params.id;
      console.log("vào",userId);
      
      if (!userId) {
        return res.status(401).json({
          error: true,
          message: "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn",
        });
      }

      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: true,
          message: "Người dùng không tồn tại",
        });
      }

      // Kiểm tra vai trò của người dùng
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          error: true,
          message: "Không có quyền truy cập",
        });
      }

      // Nếu người dùng có quyền thì tiếp tục xử lý các tuyến tiếp theo
      next();
    } catch (error) {
      console.error("Lỗi kiểm tra quyền truy cập:", error);
      res.status(500).json({
        error: true,
        message: "Lỗi hệ thống",
      });
    }
  };
};
