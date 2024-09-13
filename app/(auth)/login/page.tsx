"use client";

import React, {  useState } from "react";

import styles from "./login.module.scss";

import { useRouter } from "next/navigation";


// user 정보
export interface UserType {
  id: number | undefined;
  name: string | undefined;
}

const LoginPage: React.FC = () => {
  const [userName, setUserName] = useState("");

  const router =useRouter()

  // 로그인
  const handleLogin = () => {
    localStorage.setItem("user", JSON.stringify({
      id: 1,
      name: userName,
    }));
    console.log('으로 이동')
    router.push("/")
  };

  return (
    <div className={styles.loginContainer}>
    <input
      placeholder="이름"
      onChange={(e) => setUserName(e.target.value)}
    />
    <button onClick={handleLogin}>로그인</button>
  </div>
  );
};

export default LoginPage;
