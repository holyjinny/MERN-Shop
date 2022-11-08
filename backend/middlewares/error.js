import ErrorHandler from '../utils/ErrorHandler';

const Error = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || '서버 간 에러발생'

    // MongoDB id error
    if (err.name === "CastError") {
        const message = `Resources not found with this id..Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // 중복 key error
    if (err.code === 11000) {
        const message = `${Object.keys(err.keyValue)} 가 중복되었습니다.`;
        err = new ErrorHandler(message, 400);
    }

    // 잘못된 토큰 error
    if (err.name === "jsonWebTokenError") {
        const message = `잘못된 토큰입니다.`;
        err = new ErrorHandler(message, 400);
    }

    // 토큰 기간 error
    if (err.name === "TokenExpiredError") {
        const message = `기간이 만료된 토큰입니다.`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default Error