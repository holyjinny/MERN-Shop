// 라이브러리
import app from './app';
import mongoose from 'mongoose';

// 환경 설정
import { DB, PORT } from './config';

// DB 연결 및 서버에서 요청 수신
const main = async () => {

    try {
        await mongoose.connect(DB,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        ).then((data) => {
            console.log(`DATABASE: ${DB}, HOST: ${data.connection.host}`);
        });
        app.listen(PORT, () => console.log(`http://localhost:${PORT} 에서 서버가 시작되었습니다.`));

    } catch (error) {
        console.error(`서버를 시작할 수 없습니다. \n${error.message}`);
    }
};

main();