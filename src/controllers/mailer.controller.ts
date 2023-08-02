import { IUser } from "./../types/user";
import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";
import { errorFunction } from "../utils/errorFunction";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../models/user.model";

var min = 100000;
var max = 999999;
const date = Number(new Date());
dotenv.config();

const uiSendEmail = (code: number) => {
  return `    <div
   class="container"
   style="
     position: absolute;
     width: 600px;
     height: 400px;
     top: 50%;
     left: 50%;
     border-radius: 5px;
     background: url(https://demoda.vn/wp-content/uploads/2022/03/background-black-background-den-cac-khoi-3d.jpg);
     background-position: center;
     background-size: cover;
     background-repeat: no-repeat;
     border: 1px solid #3e3e3e;
     transform: translate(-50%, -50%);
     box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
       rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
   "
  >
   <div class="container_icon" style="text-align: center; margin-top: 40px">
     <p
       style="
         text-transform: uppercase;
         margin-top: 10px;
         font-size: 25px;
         font-weight: 700;
         color: #2ecc71;
       "
     >
       Mã Xác Nhận Của Bạn
     </p>
     <b style="font-size: 40px; color: #fff; ">${code}</b>
   </div>
   <div
     class="container_text"
     style="
       margin-top: 20px;
       width: 90%;
       margin-left: 5%;
       text-align: center;
       font-size: 18px;
       color: #dfe6e9;
     "
   >
     <span>
       Đây mà đoạn mã được gửi từ hệ thống <b>MAFLINE</b> dùng để xác thực
       email hoặc tài khoản của bạn ! vì lí do bảo mật vui lòng không chia sẻ
       mã này dưới bất kì hình thức nào. <b>MAFLINE</b> cảm ơn bạn đã sử dụng
       dịch vụ của chung tôi 😉
     </span>
   </div>
  </div>`;
};

const confirm = () => {
  return `<div
  class="container"
  style="
    position: absolute;
    width: 600px;
    height: 400px;
    border: 1px solid #3e3e3e;
    border-radius: 5px;
    background: url(https://demoda.vn/wp-content/uploads/2022/03/background-black-background-den-cac-khoi-3d.jpg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  "
>
  <div class="container_icon" style="text-align: center; margin-top: 30px">
    <img
      src="https://img.freepik.com/premium-vector/checkbox-tick-icon-modern-check-mark-design_161534-59.jpg"
      alt=""
      style="width: 140px; height: 140px; border-radius: 50%"
    />
    <p
      style="
        text-transform: capitalize;
        margin-top: 10px;
        font-size: 27px;
        font-weight: 500;
        color: #2ecc71;
      "
    >
      Đơn hàng của bạn đã được xác nhận
    </p>
  </div>
  <div
    class="container_text"
    style="width: 90%; margin-left: 5%; text-align: center; color: #b2bec3"
  >
    <span>
      Đơn hàng của bạn đã được xác nhận thành công! Đơn hàng sẻ được giao
      tới bạn trong 3 - 5 ngày từ lúc đơn hàng được xác nhận. <b>MAFLINE</b> xin cảm
      ơn bạn đã sử dụng dịch vụ của chung tôi 😉
    </span>
  </div>
</div>`;
};

const paymentSuccessfully = () => {
  return `    <div
  class="container"
  style="
    position: absolute;
    width: 600px;
    height: 400px;
    border-radius: 5px;
    background: url(https://demoda.vn/wp-content/uploads/2022/03/background-black-background-den-cac-khoi-3d.jpg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border: 1px solid #3e3e3e;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  "
>
  <div class="container_icon" style="text-align: center; margin-top: 30px">
    <img
      src="https://cdn-icons-png.flaticon.com/512/314/314420.png"
      alt=""
      style="width: 140px; height: 140px"
    />
    <p
      style="
        text-transform: capitalize;
        margin-top: 10px;
        font-size: 25px;
        font-weight: 500;
        color: #0984e3;
      "
    >
      Đơn hàng đã được thanh toán thành công
    </p>
  </div>
  <div
    class="container_text"
    style="width: 90%; margin-left: 5%; text-align: center; color: #b2bec3"
  >
    <span>
      Đơn hàng của bạn đã được thanh toán thành công! Đơn hàng sẻ được giao
      tới bạn trong 3 - 5 ngày kể từ lúc thanh toán. Khi nhận được sản phẩm
      bạn vui lòng bấm "<b>Đã nhận được hàng</b>" trong lịch sử mua hàng của
      bạn. Để bạn đánh giá sản phẩm nếu có vấn đề chúng tôi sẻ sử lý cho
      bạn. Sản phẩm không được phép xem trước. <b>MAFLINE</b> xin cảm ơn bạn
      đã sử dụng dịch vụ của chung tôi 😉
    </span>
  </div>
</div>`;
};

const cancel = () => {
  return `<div
  class="container"
  style="
    position: absolute;
    width: 600px;
    height: 400px;
    border: 1px solid #3e3e3e;
    border-radius: 5px;
    background: url(https://demoda.vn/wp-content/uploads/2022/03/background-black-background-den-cac-khoi-3d.jpg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  "
>
  <div class="container_icon" style="text-align: center; margin-top: 30px">
    <img
      src="https://magecomp.com/blog/wp-content/uploads/2020/05/Magento-2-cancel-order.png"
      alt=""
      style="width: 140px; height: 140px; border-radius: 50%"
    />
    <p
      style="
        text-transform: capitalize;
        margin-top: 10px;
        font-size: 27px;
        font-weight: 500;
        color: #c0392b;
      "
    >
      Đơn hàng của bạn đã bị hủy
    </p>
  </div>
  <div
    class="container_text"
    style="width: 90%; margin-left: 5%; text-align: center; color: #b2bec3"
  >
    <span>
      Đơn hàng của bạn đã bị hủy vì một lý do nào đó! Bạn vui lòng đặt lại vé du lịch hoặc liên hệ với chúng tôi để được hổ trợ.
    </span>
  </div>
</div>`;
};

const unLock = (code: string) => {
  return `<div
  class="container"
  style="
    position: absolute;
    width: 600px;
    height: 400px;
    border: 1px solid #3e3e3e;
    border-radius: 5px;
    background: url(https://demoda.vn/wp-content/uploads/2022/03/background-black-background-den-cac-khoi-3d.jpg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  "
>
  <div class="container_icon" style="text-align: center; margin-top: 30px">
    <img
      src="https://www.iconarchive.com/download/i85633/graphicloads/100-flat/unlock.256.png"
      alt=""
      style="width: 140px; height: 140px; border-radius: 50%"
    />
    <p
      style="
        text-transform: capitalize;
        margin-top: 10px;
        font-size: 27px;
        font-weight: 500;
        color: #3498db;
      "
    >
       Mở khoá tài khoản
    </p>
  </div>
  <div
    class="container_text"
    style="width: 90%; margin-left: 5%; text-align: center; color: #b2bec3"
  >
    <span>
      Hệ thống Mafline đã mở khoá cho tài khoản của bạn. Mật khẩu đăng nhập của bạn : <i style="
      text-transform: capitalize;
      margin-top: 10px;
      font-size: 27px;
      font-weight: 500;
      color: #fff;
    ">${code}</i>
    </span>
  </div>
</div>`;
};

const generateToken = (code: number) => {
  const token = jwt.sign({ code }, process.env.TOKEN_SECRET + "", {
    expiresIn: "180s",
  });

  return token;
};

const mailerController = {
  sendCodeOtpRegister: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const check = Math.floor(min + Math.random() * (max - min));

      if (!req.body.email || !req.body.userName) {
        return res
          .status(403)
          .json(errorFunction(true, 403, "Truyền thiếu username hoặc email"));
      }

      const checkUserName = await Users.findOne<IUser>({
        userName: req.body.userName,
      });
      // const checkExist = await Users.findOne<IUser>({$or: [
      //   {userName: req.body.userName}, { email: req.body.email }
      // ]})
      const checkEmail = await Users.findOne({ email: req.body.email });

      if (checkUserName)
        return res
          .status(400)
          .json(errorFunction(true, 400, "Tên này đã tồn tại !"));

      if (checkEmail)
        return res
          .status(400)
          .json(errorFunction(true, 400, "Email này đã tồn tại !"));

      const msg = {
        from: process.env.USERMAIL,
        to: `${email}`,
        subject: "THÔNG BÁO TỪ HỆ THỐNG MAFLINE",
        html: uiSendEmail(check),
      };
      nodemailer
        .createTransport({
          service: "gmail",
          auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL,
          },
          port: 465,
          host: "smtp.gmail.com",
        })
        .sendMail(msg, async (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json(err);
          } else {
            const token = generateToken(check);

            res.cookie("CodeRegister", `${token}`, {
              // maxAge: 5000,
              expires: new Date(Date.now() + 180 * 1000),
              httpOnly: true,
            });
            res.json(
              errorFunction(
                true,
                200,
                `Email sent ${email} with code : ${check} and Token : ${token}`
              )
            );
          }
        });
    } catch (error) {
      console.log("error: ", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  },
  sendCodeOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const check = Math.floor(min + Math.random() * (max - min));

      if (req.body.email === "") {
        return res
          .status(403)
          .json(errorFunction(true, 403, "Không nhận được email !"));
      }

      const checkUser = await Users.findOne<IUser>({ email: email });

      if (!checkUser)
        return res
          .status(404)
          .json(errorFunction(true, 404, "Không tồn tại !"));

      const msg = {
        from: process.env.USERMAIL,
        to: `${email}`,
        subject: "THÔNG BÁO TỪ HỆ THỐNG MAFLINE",
        html: uiSendEmail(check),
      };
      nodemailer
        .createTransport({
          service: "gmail",
          auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL,
          },
          port: 465,
          host: "smtp.gmail.com",
        })
        .sendMail(msg, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json(err);
          } else {
            const token = generateToken(check);

            res.cookie("CodeRegister", `${token}`, {
              expires: new Date(Date.now() + 180 * 1000),
              httpOnly: true,
            });
            res.json(
              errorFunction(
                false,
                200,
                `Email sent ${email} with code : ${check}`,
                checkUser._id
              )
            );
          }
        });
    } catch (error) {
      console.log("error: ", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  },
  sendEmailConfirm: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (req.body.email === "") {
        return res
          .status(403)
          .json(errorFunction(true, 403, "Không nhận được email !"));
      }

      const msg = {
        from: process.env.USERMAIL,
        to: `${email}`,
        subject: "THÔNG BÁO TỪ HỆ THỐNG MAFLINE",
        html: confirm(),
      };
      nodemailer
        .createTransport({
          service: "gmail",
          auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL,
          },
          port: 465,
          host: "smtp.gmail.com",
        })
        .sendMail(msg, (err) => {
          res.json(errorFunction(false, 200, `Email sent ${email} `));
        });
    } catch (error) {
      console.log("error: ", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  },
  sendEmailCancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (req.body.email === "") {
        return res
          .status(403)
          .json(errorFunction(true, 403, "Không nhận được email !"));
      }

      const msg = {
        from: process.env.USERMAIL,
        to: `${email}`,
        subject: "THÔNG BÁO TỪ HỆ THỐNG MAFLINE",
        html: cancel(),
      };
      nodemailer
        .createTransport({
          service: "gmail",
          auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL,
          },
          port: 465,
          host: "smtp.gmail.com",
        })
        .sendMail(msg, (err) => {
          res.json(errorFunction(true, 200, `Email sent ${email} `));
        });
    } catch (error) {
      console.log("error: ", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  },
  sendEmailUnLock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (req.body.email === "") {
        return res
          .status(403)
          .json(errorFunction(true, 403, "Không nhận được email !"));
      }

      const msg = {
        from: process.env.USERMAIL,
        to: `${email}`,
        subject: "THÔNG BÁO TỪ HỆ THỐNG MAFLINE",
        html: unLock(req.body.code),
      };
      nodemailer
        .createTransport({
          service: "gmail",
          auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL,
          },
          port: 465,
          host: "smtp.gmail.com",
        })
        .sendMail(msg, (err) => {
          res.json(errorFunction(true, 200, `Email sent ${email} `));
        });
    } catch (error) {
      console.log("error: ", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  },
  sendEmailPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (req.body.email === "") {
        return res
          .status(403)
          .json(errorFunction(true, 403, "Không nhận được email !"));
      }

      const msg = {
        from: process.env.USERMAIL,
        to: `${email}`,
        subject: "THÔNG BÁO TỪ HỆ THỐNG MAFLINE",
        html: paymentSuccessfully(),
      };
      nodemailer
        .createTransport({
          service: "gmail",
          auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL,
          },
          port: 465,
          host: "smtp.gmail.com",
        })
        .sendMail(msg, (err) => {
          res.json(errorFunction(true, 200, `Email sent ${email} `));
        });
    } catch (error) {
      console.log("error: ", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  },
};

export default mailerController;
