// src/routes/users.router.js

import express from "express";
import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const { mysecretkey, saltRounds } = process.env;
const router = express.Router();

/** 캐릭터 생성 API **/
router.post("/characters", async (req, res, next) => {
  try {
    console.log("캐릭터 생성");
    const { name, age } = req.body;

    //     - 캐릭터 명을 **request**에서 전달하기 & 캐릭터 ID를 **response**로 돌려받기
    //     - 이 때, 이미 존재하는 캐릭터 명으로 캐릭터 생성을 하려고 하면 생성을 못하게 해주세요!
    //     - 사실은 캐릭터 명 말고도 캐릭터에 대한 여러가지 정보를 서버에 보내야하지만 여기선 간소화합니다!
    // - 캐릭터에는 다음과 같은 스탯이 있습니다. -- 다음값은 default로 처리함
    //     - **health: 500**
    //     - **power: 100**
    //     - 여건이 된다면 다른 스탯들도 정의해주셔도 무관합니다.
    // - 또한, **캐릭터 생성을 할 때마다 캐릭터에 기본 게임 머니를 1만원을 제공합니다.**
    //     - **money: 10000**
    //     - 해당 게임 머니로 아이템을 살 수 있으며 각각의 캐릭터는 고유 게임 머니가 있습니다.

    if (!name) {
      //       # 400 body를 입력받지 못한 경우
      throw new Error("400 데이터 형식이 올바르지 않습니다.");
    }

    const isExistUser = await prisma.character.findFirst({
      where: {
        name,
      },
    });

    if (isExistUser) {
      throw new Error("409 이미 존재하는 캐릭터명입니다.");
    }
    // Users 테이블에 사용자를 추가합니다.
    const user = await prisma.character.create({
      data: { name, age, userId: res.locals.user}
    });

    return res.status(200).json({ id: user.id, message: "캐릭터 생성 성공" });
  } catch (err) {
    next(err);
    // console.log(err);
    // return res.status(201).json({ message: "서버에 에러가 발생했습니다.." });
  }
});
/** 캐릭터 삭제 API **/
router.delete("/characters/:id", async (req, res, next) => {
  try {
    console.log("캐릭터 삭제");
    const { id } = req.params;

    // - 삭제할 캐릭터의 ID는 URI의 **parameter**로 전달하기
    //     - 예시: `DELETE /api/characters/**321**` ← 321번 캐릭터 삭제! 굵은 글씨가 parameter에요!
    // - 내 계정에 있는 캐릭터가 아니라면 삭제시키면 안되겠죠?

    if (!id) {
//       # 400 params를 입력받지 못한 경우
      throw new Error("400 데이터 형식이 올바르지 않습니다.");
    }

    const isExistUser = await prisma.character.findFirst({
      where: {
        id,
        userId: res.locals.user,
      },
    });

    if (!isExistUser) {
      // # 404 character_id에 해당하는 캐릭터가 존재하지 않을 경우
      throw new Error("404 캐릭터 조회에 실패하였습니다.");
    }

    // Users 테이블에 사용자를 추가합니다.
    const user = await prisma.character.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "캐릭터 삭제 성공" });
  } catch (err) {
    next(err);
    // console.log(err);
    // return res.status(201).json({ message: "서버에 에러가 발생했습니다.." });
  }
});

/** 캐릭터 생성 API **/
router.get("/characters/:id", async (req, res, next) => {
  try {
    console.log("캐릭터 생성");
    const { id } = req.params;

    // - 조회할 캐릭터의 ID는 URI의 **parameter**로 전달하기
    // - 캐릭터 이름, HP, 힘 스탯을 전달해주세요!
    //     - 다만, **내 캐릭터를 상세 조회시에는 현재 캐릭터가 갖고있는 게임 머니까지 조회**가 되어야 합니다.

    if (!id) {
      //       # 400 body를 입력받지 못한 경우
        throw new Error("400 데이터 형식이 올바르지 않습니다.");
    }

    const isExistUser = await prisma.character.findFirst({
      where: {
        name,
      },
    });

    if (!isExistUser) {
      // # 404 character_id에 해당하는 캐릭터가 존재하지 않을 경우
      throw new Error("404 캐릭터 조회에 실패하였습니다.");
    }
    const {userId, name, health, power, money} = isExistUser;
    if(userId == res.locals.user){
      return res.status(200).json({  name, health, power, money });

    }
    else{
    return res.status(200).json({  name, health, power });

    }
  } catch (err) {
    next(err);
    // console.log(err);
    // return res.status(201).json({ message: "서버에 에러가 발생했습니다.." });
  }
});

export default router;
