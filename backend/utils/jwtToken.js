import { COOKIE_EXPIRES } from '../config';

// 토큰 생성 및 쿠키에 저장
const sendToken = (user, statusCode, res) => {

    const token = user.getJwtToken();

    // 쿠키 옵션
    const options = {
        expires: new Date(
            Date.now() + COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    });
};

export default sendToken