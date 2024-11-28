// app.js

import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./routes/users.router.js";
import {validationOrRefresh} from './middlewares/tokens.middleware.js'
import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";
import charactersRouter from './routes/characters.router.js'
const app = express();
const PORT = 3018;


app.use(express.json());
app.use(cookieParser());

app.use("/api", validationOrRefresh, [UsersRouter, charactersRouter]);
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
