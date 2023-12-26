import { Request, Response, NextFunction, query } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import Users from "../../../models/user.model";
import { errorFunction } from "../../../utils/errorFunction";
import { IUser } from "types/user";
const userManagementController = {
  
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const data = await Users.create({
        ...req.body,
        password: hashedPassword,
      });
      const { _id, userName, email, avt } = data;
      res.json(
        errorFunction(false, 200, "Tạo tài khoảng thành công !", {
          _id,
          userName,
          email,
          avt,
        })
      );
    } catch (error) {
      console.log("error: ", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    try {
      let user = await Users.findOne({
        $or: [{ userName: userName }, { email: email }],
      });

      if (!user) {
        return res.status(404).json({
          error: true,
          message: "Tên đăng nhập hoặc Email không đúng",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          error: true,
          message: "Mật khẩu không đúng",
        });
      }

      let token = jwt.sign(
        {
          data: user,
          // userId: user._id
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "10 days",
        }
      );
      res.status(200).json({
        token,
        user: {
          _id: user._id,
          username: user.userName,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("error", error);
      res.status(400).json({
        error: true,
        message: "Bad Request",
      });
    }
  },
  getAnUser: async (req: Request, res: Response) => {
    try {
      const user = await Users.findById<IUser>(req.params.id);

      if (!user)
        return res
          .status(404)
          .json(errorFunction(true, 404, "Người dùng không tồn tại"));
      res.status(200).json(errorFunction(true, 200, "Lấy thành công"));
    } catch (error) {
      res.status(400).json({
        error: true,
        message: "Bad Request",
      });
    }
  },
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userUpdate = await Users.findById(req.params.id);
      if (!userUpdate)
        return res
          .status(404)
          .json(errorFunction(false, 404, "Người dùng không tồn tại"));

      await userUpdate.updateOne({ $set: req.body });
      res.status(200).json(errorFunction(true, 200, "Cập nhật thành công"));
    } catch (error) {
      res.status(400).json({
        error: true,
        message: "Bad Request",
      });
    }
  },
  updatePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userUpdatePassword = Users.findById(req.params.id);
      if (!userUpdatePassword)
        return res
          .status(404)
          .json(errorFunction(true, 404, "Người dùng không tồn tại"));
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await userUpdatePassword.updateOne({
        $set: { password: hashedPassword },
      });
      res
        .status(200)
        .json(errorFunction(true, 200, "Cập nhật mật khảu thành công"));
    } catch (error) {
      res.status(400).json({
        error: true,
        message: "Bad Request",
      });
    }
  },
  getAllUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageNumber, userName, limit } = req.query;
      const SkipNumber = (Number(pageNumber) - 1) * Number(limit);

      let query: any = {};
      if (userName) {
        query.userName = {
          $regex: userName,
          $option: "i",
        };
      }
      const allUser = await Users.find(query);

      const result = await Users.find(query)
        .skip(SkipNumber)
        .limit(Number(limit));

      let totalPage = 0;

      if (allUser.length) {
        totalPage = Math.ceil(allUser.length / Number(limit));
      }

      res.json(
        errorFunction(false, 200, "Lấy thành công !", {
          totalPage: totalPage,
          total: allUser.length,
          data: result,
        })
      );
    } catch (error) {
      res.status(400).json({
        error: 400,
        message: "Bad Request",
      });
    }
  },
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = await Users.findById<IUser>(req.params.id);
      if (!id)
        return res
          .status(404)
          .json(errorFunction(true, 404, "Không tồn tại người dùng"));
      await Users.findByIdAndRemove(req.params.id);
      res.status(200).json(errorFunction(true, 200, "Xóa thành công"));
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        error: true,
        message: "Bad Request",
      });
    }
  },
};
export default userManagementController;
