import { NextFunction, Request, Response } from "express";
import { UserRole } from "types/user";

const jwt = require("jsonwebtoken");
// export const authorize = (roles: UserRole[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const token = req.headers.authorization.split(" ")[1];
//       jwt.verify(token, "mycode");
//       next();
//     } catch (error) {
//       if (error.name === "JsonWebTokenError") {
//         return res.status(401).json({
//           error: true,
//           message: "Token không hợp lệ",
//         });
//       }
//       if (error.name === "TokenExpiredError") {
//         return res.status(401).json({
//           error: true,
//           message: "Phiên đăng nhập đã hết hạn",
//         });
//       }
//       // Xử lý các lỗi khác nếu cần thiết
//       res.status(401).json({ message: "Auth failed!" });
//     }
//   };
// };
export const authorize = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
console.log("nn",token);

      if (!token) {
        return res.status(401).json({
          error: true,
          message: "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn",
        });
      }

      // Xác thực token
      const decodedToken = jwt.verify(token, "mycode");

      // Kiểm tra quyền truy cập
      const userRoles = decodedToken.data.role;
      const hasAccess = roles.some((role) => userRoles.includes(role));

      if (!hasAccess) {
        return res.status(403).json({
          error: true,
          message: "Bạn không có quyền truy cập",
        });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Auth failed!" });
    }
  };
};
