"use client";

import ChatBox from "@/components/chat-box";
import { Badge } from "@nextui-org/badge";
import SystemTip from "@/components/system-tip";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/auth";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { data } from "autoprefixer";

type Message = {
  system: boolean;
  from: string;
  content: string;
  time: string;
};

export default function Home() {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const [onlineCount, setOnlineCount] = useState<number>(0);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(
    username ? `ws://${window.location.hostname}:8082/chat/${username}` : null,
    {
      // retryOnError: true,
      heartbeat: {
        // 心跳检测
        message: "ping",
        returnMessage: "pong",
        timeout: 60000, // 1 minute, if no response is received, the connection will be closed
        interval: 25000, // every 25 seconds, a ping message will be sent
      },
      onOpen: () => {
        console.log("WebSocket connection opened");
      },
      onClose: () => {
        console.log("WebSocket connection closed");
      },
      onError: (event) => {
        console.error("WebSocket error observed:", event);
      },
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 3,
      reconnectInterval: 3000,
      // 过滤心跳信息
      filter: (message) => {
        return message.data !== "pong";
      },
      // filter: (message) => {},
    }
  );
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const handleSend = () => {
    if (message.trim() === "") return;
    sendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    getCookie("username").then((res) => {
      setUsername(res);
    });
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));

      // 截取在线人数
      const data = lastJsonMessage as Message;
      console.log(data);
      if (data.system && data.content.includes("在线人数")) {
        const match = data.content.match(/当前在线人数：(\d+)/);
        if (match) {
          setOnlineCount(Number(match[1]));
        }
      }
      console.log(messageHistory);
    }
  }, [lastMessage]);
  return (
    <Card shadow="sm" className=" w-full h-full mb-8 px-4">
      <CardHeader className="w-full h-12 flex justify-between items-center">
        <span className=" font-medium antialiased text-lg ">聊 天 室</span>
        <div>
          <div>
            <Badge
              content=""
              color="success"
              shape="circle"
              className="mt-5 mr-3"
            >
              <span></span>
            </Badge>
          </div>
          <span>在线人数：{onlineCount}</span>
        </div>
      </CardHeader>
      <CardBody className=" w-full h-96 overflow-auto no-scrollbar">
        {messageHistory.map((item, index) => {
          const { timeStamp, data } = item;
          const { system, from, time, content } = JSON.parse(data) as Message;
          return system ? (
            <SystemTip key={timeStamp} message={content} />
          ) : (
            <ChatBox
              key={timeStamp}
              username={from}
              content={content}
              isReversed={from === username}
            />
          );
        })}
      </CardBody>
      <CardFooter>
        <div className=" w-full flex space-x-2">
          <Input
            placeholder="快说几句话，你个潮吧"
            value={message}
            onValueChange={setMessage}
          />
          <Button
            color="primary"
            isDisabled={readyState !== ReadyState.OPEN}
            onClick={handleSend}
          >
            发 送
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
