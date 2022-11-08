import User from "../models/UserModel";
import ErrorHandler from '../utils/ErrorHandler';
import catchAsyncErrors from '../middlewares/catchAsyncErrors';
import sendToken from "../utils/jwtToken";
import sendMail from '../utils/sendMail';
import { DOMAIN } from "../config";
import crypto from 'crypto';

// 회원 가입
const registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "https://test.com",
            url: "https://test.com",
        },
    })

    sendToken(user, 200, res);
});

// 로그인
const loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("올바른 이메일 또는 비밀번호를 입력해주세요.", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("해당하는 유저가 없습니다.", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("비밀번호가 일치하지 않습니다.", 401));
    }

    sendToken(user, 200, res);
});

// 로그아웃
const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "로그아웃",
    });
});

// 비밀번호 찾기
const forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("해당하는 유저를 찾을 수 없습니다.", 404));
    }

    // Get ResetPasswordToken
    const resetToken = user.getResetToken();

    await user.save({
        validateBeforeSave: false,
    });

    const resetPasswordUrl = `${DOMAIN}password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;

    try {

        await sendMail({
            email: user.email,
            subject: `MERN-SHOP 비밀번호 찾기`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `${user.email}로 메일을 보냈습니다.`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined;

        await user.save({
            validateBeforeSave: false,
        });

        return next(new ErrorHandler(error.message));
    }
});

// 비밀번호 초기화
const resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Create Token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTime: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("초기화 주소가 유효하지 않거나 기간이 지났습니다.", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("비밀번호가 일치하지 않습니다.", 400));
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;

    user.resetPasswordTime = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// 비밀번호 변경
const updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("현재 비밀번호가 일치하지 않습니다."), 400);
    };

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("비밀번호가 일치하지 않습니다."), 400);
    };

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// 유저 정보
const userDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// 유저 정보 변경
const updateUser = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "정보가 변경되었습니다.",
    });
});

// 모든 유저 목록 (관리자)
const getAllUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// 해당 유저 정보 보기 (관리자)
const getSingleUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("해당하는 유저가 없습니다."), 400);
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// 유저 역할 변경 (관리자)
const updateRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

// 유저 강제 탈퇴 (관리자)
const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("해당하는 유저를 찾을 수 없습니다.", 400));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "해당하는 유저를 탈퇴시켰습니다.",
    });
});


export { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, updatePassword, userDetails, updateUser, getAllUsers, getSingleUser, updateRole, deleteUser }