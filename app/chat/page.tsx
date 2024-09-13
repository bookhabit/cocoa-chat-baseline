"use client";

import React, { FormEvent, useEffect, useState } from "react";

import styles from "./chat.module.scss";
import { UserType } from "../(auth)/login/page";
import { redirect } from "next/navigation";
import {  Stomp,CompatClient } from '@stomp/stompjs';
import SockJS from "sockjs-client";

// 메시지 타입 정의
interface ChatMessageType {
  id?: number;
  sender: UserType;
  content: string;
}

const ChatPage: React.FC = () => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState<string>("");
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);


  // 로그인 상태관리
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      redirect("/login");
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
    } catch (error) {
      console.error("Error parsing user data", error);
      redirect("/login");
    }
  }, []);

  // 소켓 연결
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/topic/public", (msg) => {
        const message = JSON.parse(msg.body) as ChatMessageType;
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      

      client.send(
        "/app/chat.register",
        {},
        JSON.stringify({ sender: userData?.name, type: "JOIN" })
      );

      setStompClient(client);
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [stompClient]);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && userData) {
      const chatMessage: ChatMessageType = {
        id: Date.now(), // 임시 ID 생성
        sender: {
          id: userData.id,
          name: userData.name,
        },
        content: input,
      };

      // setMessages((prevMessages) => [...prevMessages, chatMessage]);

      stompClient?.send("/app/chat", {}, JSON.stringify(chatMessage));
      setInput(""); // 메시지 전송 후 입력창 초기화
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatBox}>
        {messages.map((msg) =>
          msg.sender.id === userData?.id ? (
            <div className={styles.sender} key={msg.id}>
              <p className={styles.chatMessage}>
                {msg.sender.name}: {msg.content}
              </p>
            </div>
          ) : (
            <div className={styles.receiver} key={msg.id}>
              <p className={styles.chatMessage}>
                {msg.sender.name}: {msg.content}
              </p>
            </div>
          )
        )}
      </div>

      <form className={styles.form} onSubmit={sendMessage}>
        <div className={styles.inputBox}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
          />
          <button type="submit" disabled={!input}>전송</button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
