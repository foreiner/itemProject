// src/middlewares/error-handling.middleware.js

export default function (err, req, res, next) {
    // 에러를 출력합니다.
    console.error(err);

    let httpStatusCode = ('' + err).split(' ')[1];
    console.log(httpStatusCode);
    httpStatusCode = Number(httpStatusCode) ? httpStatusCode : 500;
    console.log(httpStatusCode);

    // 클라이언트에게 에러 메시지를 전달합니다.
    if(httpStatusCode == 500) res.status(500).json({ errorMessage: '서버 내부 에러가 발생했습니다.' });
    else res.status(httpStatusCode).json({ errorMessage: '' + err });
  }