// 라이브러리
import cors from 'cors';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import Error from './middlewares/error';
import cookieParser from 'cookie-parser';

// 라우터 적용
import productApis from './routes/ProductRoute';
import userApis from './routes/UserRoute';
import orderApis from './routes/OrderRoute';

// express init
const app = express();

// middleware 적용
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// 의존성 주입
app.use('/products', productApis);
app.use('/users', userApis);
app.use('/orders', orderApis);

// 전반적인 에러처리
app.use(Error);

export default app;