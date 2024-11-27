// src/routes/users.router.js

import express from "express";
import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const { mysecretkey, saltRounds } = process.env;
const router = express.Router();

/** 사용자 회원가입 API **/
router.post("/sign-up", async (req, res, next) => {
  try{
  const { id, password, name } = req.body;

  if (!id) {
    return res.status(409).json({ message: "아이디가 입력되어야 합니다." });
  }
  if (!password) {
    return res.status(409).json({ message: "비밀번호가 입력되어야 합니다." });
  }
  if (!name) {
    return res.status(409).json({ message: "이름이 입력되어야 합니다." });
  }
console.log(saltRounds);
  const hashpassword = await bcrypt.hash(password, +saltRounds);

  const isExistUser = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (isExistUser) {
    return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
  }

  // Users 테이블에 사용자를 추가합니다.
  const user = await prisma.user.create({
    data: { id, password: hashpassword, name },
  });

  return res.status(201).json({ message: "회원가입이 완료되었습니다." });

  }
  catch(err){
    console.log(err);
    return res.status(201).json({ message: "서버에 에러가 발생했습니다.." });
  }


});
// src/routes/users.route.js

/** 로그인 API **/
router.post("/sign-in", async (req, res, next) => {
  const { id, password } = req.body;

  const user = await prisma.user.findFirst({ where: { id } });

  if (!user)
    return res.status(401).json({ message: "존재하지 않는 아이디입니다." });
  // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
  else if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  // 로그인에 성공하면, 사용자의 userId를 바탕으로 토큰을 생성합니다.
  const token = jwt.sign(
    {
      userId: user.userId
    },
    mysecretkey
  );

  // authotization 쿠키에 Berer 토큰 형식으로 JWT를 저장합니다.
  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공" });
});
export default router;
