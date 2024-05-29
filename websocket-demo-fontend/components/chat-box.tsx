import React, { memo } from "react";
import type { FC, ReactNode } from "react";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import { Card, CardBody } from "@nextui-org/card";

type ChatBoxProps = {
  children?: ReactNode;
  username: string;
  content: string;
  isReversed?: boolean;
};

const ChatBox: FC<ChatBoxProps> = (props) => {
  const { children, username = "", content = "", isReversed = false } = props;
  return (
    <div
      className={`flex flex-col ${
        isReversed ? "items-end" : "items-start"
      } my-2`}
    >
      <div
        className={`flex items-center space-x-4 ${
          isReversed ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <Avatar
          isBordered
          radius="full"
          src="https://i.pravatar.cc/150?u=a04258114e29026708c"
          color="secondary"
        />
        <span>{username}</span>
      </div>

      <div className={`w-1/3  ${isReversed ? "mr-12" : "ml-12"}`}>
        <Card className="px-2">
          <CardBody>
            <p className=" font-sans antialiased light:text-slate-700">
              {content}
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default memo(ChatBox);
