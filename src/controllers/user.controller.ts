import { Request, Response, NextFunction, query } from "express";
import { errorFunction } from "../utils/errorFunction";
import Users from "../models/user.model";
import bcrypt from "bcrypt";
import { IUser, UserRole } from "../types/user";

const userController = {

  register: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userName, email, phoneNumber, address, password } = req.body;

      // Check if the username is already taken
      const existingUsername = await Users.findOne({ userName });
      if (existingUsername) {
        return res.status(400).json({
          error: true,
          message: "Tên đăng nhập đã được dùng",
        });
      }

      // Check if the phone number is already taken
      const existingPhoneNumber = await Users.findOne({ phoneNumber });
      if (existingPhoneNumber) {
        return res.status(400).json({
          error: true,
          message: "Số điện thoại đã được dùng",
        });
      }
      const existingEmail = await Users.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          error: true,
          message: "Email đã được dùng",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = await Users.create({
        userName,
        email,
        phoneNumber,
        address,
        password: hashedPassword,
        role: UserRole.REGULAR_USER,
      });
      const { _id, avt } = data;

      res.json({
        error: false,
        status: 200,
        message: "Tạo tài khoản thành công !",
        data: { _id, userName, email, avt,role: data.role },
      });
    } catch (error) {
      console.log("Error creating user:", error);
      res.status(500).json({
        error: true,
        message: "Server error",
      });
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    const usernameOrEmail = req.body.userName;
    const password = req.body.password;

    try {
      let user = await Users.findOne({
        $or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }],
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

      //   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

      res.status(200).json({
        // token,
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
export default userController;
