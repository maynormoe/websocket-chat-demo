"use client";

import type { FC, ReactNode } from "react";

import React, { memo, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

import { createCookie, getCookie } from "@/utils/auth";

type LoginProps = {
  children?: ReactNode;
};

const Login: FC<LoginProps> = (props) => {
  const { children } = props;
  const [username, setUsername] = useState("");
  const [userNameError, setUsernameError] = useState(0);
  const router = useRouter();

  const handleLogin = async () => {
    if (!isInvalid) {
      await createCookie({
        name: "username",
        value: username,
      });
      const cookie = await getCookie("username");

      console.log(cookie);
      if (cookie) {
        router.push("/");
      }
    }
  };

  const validateUsername = (value: string) => {
    const regex = /^[a-zA-Z0-9_]*$/;

    console.log(value.trim().length);
    if (value.trim().length === 0) {
      setUsernameError(1);

      return false;
    }
    if (
      value.trim().length < 4 ||
      value.trim().length > 15 ||
      !regex.test(value)
    ) {
      setUsernameError(2);

      return false;
    }

    return true;
  };

  const isInvalid = React.useMemo(() => {
    return validateUsername(username) ? false : true;
  }, [username]);

  const handleValueChange = (value: string) => {
    setUsername(value);
  };

  return (
    <div className=" h-full m-0 p-0 overflow-auto flex flex-col items-center bg-loginBg bg-cover bg-repeat bg-clip-padding">
      <Card className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mt-16 sm:mt-24 md:mt-32">
        <CardBody className=" flex flex-col justify-center space-y-3">
          <Input
            errorMessage={
              userNameError === 1
                ? "请填写你的用户名"
                : "请填写大于4小于15个字节没有特殊符号的用户名"
            }
            isInvalid={isInvalid}
            placeholder="想让大家怎么称呼你？"
            type="text"
            value={username}
            onValueChange={handleValueChange}
          />
          <Button color="primary" onClick={handleLogin}>
            开 始 聊 天
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default memo(Login);
