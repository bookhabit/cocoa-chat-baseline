"use client";

import React, { FormEvent, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

import styles from "./styles.module.scss";

// user 정보
interface UserType {
  id: number | undefined;
  name: string | undefined;
}

// 메시지 타입 정의
interface ChatMessageType {
  id?: number;
  sender: UserType;
  content: string;
}

// 소켓 연결 초기화
// const socket: Socket = io("http://localhost:8080");

const ChatPage: React.FC = () => {
  const [userData, setUserData] = useState<UserType>();
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 1,
      content: "hi",
      sender: {
        id: 1,
        name: "이현진",
      },
    },
    {
      id: 2,
      content: "안녕",
      sender: {
        id: 2,
        name: "김현태",
      },
    },
  ]);
  const [input, setInput] = useState<string>("");

  // 서버에서 메시지 수신
  useEffect(() => {
    // socket.on("message", (message: ChatMessageType) => {
    //   setMessages((prevMessages) => [...prevMessages, message]);
    // });
    // return () => {
    //   socket.off("message");
    // };
  }, []);

  // 메시지 보내기 함수
  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      const chatMessage: ChatMessageType = {
        id: 3,
        sender: {
          id: userData?.id,
          name: userData?.name,
        },
        content: input,
      };

      setMessages((prevMessages) => [...prevMessages, chatMessage]);

      // socket.emit("chat.send", chatMessage);
      setInput(""); // 메시지 전송 후 입력창 초기화
    }
  };

  // 로그인
  const handleLogin = () => {
    setUserData({
      id: 1,
      name: userName,
    });
  };

  return (
    <>
      {userData?.id ? (
        <div className={styles.container}>
          <div className={styles.chatBox}>
            {messages.map((msg, index) =>
              msg.sender.id === userData.id ? (
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
              <button disabled={!input}>전송</button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.loginContainer}>
          <input
            placeholder="이름"
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={handleLogin}>로그인</button>
        </div>
      )}
    </>
  );
};

export default ChatPage;
