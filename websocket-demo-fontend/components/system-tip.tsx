import type { FC, ReactNode } from "react";

import React, { memo } from "react";

type SystemTipProps = {
  children?: ReactNode;
  message: string;
};

const SystemTip: FC<SystemTipProps> = (props) => {
  const { children, message = "" } = props;

  return (
    <div className="w-full flex justify-center items-center my-2 px-2">
      <div className=" w-96  py-1 border-default-200 dark:border-default-100 bg-default-200/20 flex justify-center items-center rounded-md shadow-s ">
        <span className=" text-xs light:text-gray-300">{message}</span>
      </div>
    </div>
  );
};

export default memo(SystemTip);
