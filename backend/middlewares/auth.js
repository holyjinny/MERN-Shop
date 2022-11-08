import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "./catchAsyncErrors";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import User from "../models/UserModel";

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("접근하기 위해서 로그인이 필요합니다.", 401));
    }

    const decodedData = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});

// 역할 구분 (Admin 전용)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // 기본 유저
        if (!roles.includes(req.user.role)) {
            console.log(req.user.role);
            return next(new ErrorHandler(`${req.user.role} 는 접근할 수 없습니다.`, 401));
        }
        next();
    };
};

export { isAuthenticatedUser, authorizeRoles }