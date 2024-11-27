// src/routes/users.router.js

import express from "express";
import { prisma } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = process.env;

let tokenStorage = {}; // Refresh Token을 저장할 객체

/** 로그인시 Access Token, Refresh Token 발급 API **/
export let loginAccessToken = (req, res) => {
  const { id } = req.body;
  const accessToken = createAccessToken(id);
  const refreshToken = createRefreshToken(id);

  tokenStorage[refreshToken] = {
    id: id, // 사용자에게 전달받은 ID를 저장합니다.
    ip: req.ip, // 사용자의 IP 정보를 저장합니다.
    userAgent: req.headers["user-agent"], // 사용자의 User Agent 정보를 저장합니다.
  };

  res.cookie("accessToken", accessToken); // Access Token을 Cookie에 전달한다.
  res.cookie("refreshToken", refreshToken); // Refresh Token을 Cookie에 전달한다.
  return true;
};

export function validationOrRefresh(err, req, res, next) {
  //access token 확인
  //확인시 통과
  //access token 없거나 validate 하지 않으면 refresh 확인
  //확인시 새 access token 생성 및 통과
  //에러처리
  try{
    const accessToken = req.cookies.accessToken;
    let payload = validateToken(accessToken, ACCESS_TOKEN_SECRET_KEY);
  
    if (!accessToken || !payload) {
      const refreshToken = req.cookies.refreshToken;
  
      if (!refreshToken)
        throw new error('Refresh Token이 존재히지 않습니다.');
  
      payload = validateToken(refreshToken, REFRESH_TOKEN_SECRET_KEY);
      if (!payload) {
        throw new error('Refresh Token이 유효하지 않습니다.');
      }
  
      const userInfo = tokenStorage[refreshToken];
      if (!userInfo)
        throw new error('Refresh Token의 정보가 서버에 존재하지 않습니다.');

      const newAccessToken = createAccessToken(userInfo.id);
  
      res.cookie("accessToken", newAccessToken);
    }
    next();
  }
  catch(err){
    return res.json({
      message: err,
    });
  }
}


// Token을 검증하고 Payload를 반환합니다.
function validateToken(token, secretKey) {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

// Access Token을 생성하는 함수
function createAccessToken(id) {
  const accessToken = jwt.sign(
    { id: id }, // JWT 데이터
    ACCESS_TOKEN_SECRET_KEY, // Access Token의 비밀 키
    { expiresIn: "10s" } // Access Token이 10초 뒤에 만료되도록 설정합니다.
  );

  return accessToken;
}

// Refresh Token을 생성하는 함수
function createRefreshToken(id) {
  const refreshToken = jwt.sign(
    { id: id }, // JWT 데이터
    REFRESH_TOKEN_SECRET_KEY, // Refresh Token의 비밀 키
    { expiresIn: "7d" } // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
  );

  return refreshToken;
}

