// app.js

import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./routes/users.router.js";
import {validationOrRefresh} from './middlewares/tokens.middleware.js'
import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";

const app = express();
const PORT = 3018;


app.use(express.json());
app.use(cookieParser());

app.use(validationOrRefresh);
app.use("/api", [UsersRouter]);
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
