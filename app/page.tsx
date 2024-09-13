"use client"; // 클라이언트 사이드에서만 실행됨

import React, { useEffect } from "react";
import { redirect } from "next/navigation";

export default function RootPage() {
  console.log('루트 렌더링')
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      
      redirect("/login");
    } else {
      
      
      redirect("/chat");
    }
  }, []);

  return (
    <div>Loading...</div> // 로딩 중일 때 표시
  );
}
