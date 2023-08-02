import mongoose from "mongoose";
import { IUser, UserRole } from "../types/user";
const userSchema = new mongoose.Schema<IUser>(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        numberPhone: {
            type: String,
            required: false,
            default: "",

        },
        address: {
            type: String,
            required: false,
            default: "",

        },
        gender: {
            type: String,
            required: false,
            default: "nam",
        },
        avt: {
            type: String,
            default:
                "https://scarpa-us.com/wp-content/uploads/2020/05/cham-toi-ky-quan-tien-canh-trong-sieu-pham-avatar-.jpeg",
        },
        role: { type: String, enum: Object.values(UserRole), default: UserRole.REGULAR_USER }, // Giá trị mặc định là "guest"
    },
    {
        timestamps: true,
    }
)
const Users = mongoose.model("User", userSchema);
export default Users;