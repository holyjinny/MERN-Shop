import { Schema, model } from 'mongoose';
import { JWT_SECRET, JWT_EXPIRES } from '../config';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "성함을 입력해주세요."],
        minLength: [2, "성함은 최소 두 자리 이상입니다."],
        maxLength: [15, "성함은 15자를 넘길 수 없습니다."],
    },
    email: {
        type: String,
        required: [true, "이메일을 입력해주세요."],
        validate: [validator.isEmail, "이메일 형식을 지켜주세요."],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "비밀번호를 입력해주세요."],
        minLength: [8, "비밀번호는 8자리 이상입니다."],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
});

// Hash 암호화
UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES
    });
};

// 비밀번호 비교
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 비밀번호 찾기
UserSchema.methods.getResetToken = function () {
    // Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding resetPasswordToken to UserSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordTime = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

const User = model("User", UserSchema);

export default User;