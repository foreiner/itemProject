// src/routes/users.router.js

import express from "express";
import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

/** 아이템 생성 API **/
router.post("/items/add", async (req, res, next) => {
  try {
    
    console.log("아이템 생성");
    const {  item_name, item_stat, item_price } = req.body;
    
    if (!item_name|| !item_stat|| !item_price) {
      //       # 400 body를 입력받지 못한 경우
      throw new Error("400 데이터 형식이 올바르지 않습니다.");
    }

    // const isExistUser = await prisma.item.findFirst({
    //   where: {
    //     item_code,
    //   },
    // });

    // if (isExistUser) {
    //   throw new Error("409 이미 존재하는 캐릭터명입니다.");
    // }
    // items 테이블에 아이템을 추가합니다.
    const user = await prisma.item.create({
      data: { item_name, item_stat, item_price } 
    });

    return res.status(201).json({ message: "아이템 생성 성공" });
  } catch (err) {
    next(err);
    // console.log(err);
    // return res.status(201).json({ message: "서버에 에러가 발생했습니다.." });
  }
});
/** 아이템 수정 API **/
router.patch("/items/:item_code", async (req, res, next) => {
  try {
    console.log("아이템 수정");
    const { item_code } = req.params;
    const { item_name, item_stat } = req.body;
    
    if (!item_code || !item_name|| !item_stat|| !item_price) {
      //       # 400 body를 입력받지 못한 경우
      throw new Error("400 데이터 형식이 올바르지 않습니다.");
    }

    const isExistUser = await prisma.item.findFirst({
      where: {
        item_code,
      },
    });

    if (!isExistUser) {
      throw new Error("409 존재하지 않는 아이템입니다.");
    }
    // items 테이블에 아이템을 수정합니다.
    const user = await prisma.item.update({
      where:{
        item_code,
      },
      data: { item_name, item_stat }
    });

    return res.status(200).json({ message: "아이템 수정 성공" });
  } catch (err) {
    next(err);
    // console.log(err);
    // return res.status(201).json({ message: "서버에 에러가 발생했습니다.." });
  }
});
/** 아이템 목록 조회 API **/
router.get("/items", async (req, res, next) => {
  try {
    console.log("아이템 목록 조회");
    

    const isExistUser = await prisma.item.findMany({
      select:{
        item_code: true,
        item_name: true,
        item_price: true,
      }
    });

    // if (!isExistUser) {
    //   throw new Error("409 존재하지 않는 아이템입니다.");
    // }

    return res.status(200).json({ ...isExistUser });
  } catch (err) {
    next(err);
  }
});

/** 아이템 목록 조회 API **/
router.get("/items/:item_code", async (req, res, next) => {
  try {
    console.log("아이템 조회");
    const { item_code } = req.params;
    

    const isExistUser = await prisma.item.findMany({
      select:{
        item_code: true,
        item_name: true,
        item_stat: true,
        item_price: true,
      },
      where:{item_code: +item_code}
    });

    // if (!isExistUser) {
    //   throw new Error("409 존재하지 않는 아이템입니다.");
    // }

    return res.status(200).json({ ...isExistUser });
  } catch (err) {
    next(err);
  }
});


export default router;
