import React from "react";

const Skeleton = ({ type }) => {
  if (type === "chatprofile") {
    return (
      <div className="w-full gap p-1 flex flex-col ">
        <div className="w-full mt-1 flex flex-col ">
          <div className=" w-full flex">
            <div className="w-12 h-12 rounded-lg bg-gray-300"></div>
            <div className="flex flex-col ml-3 gap-5">
              <div className="w-12 h-4 rounded-lg bg-gray-300"></div>
              <div className="w-16 h-3 mt-3 rounded-lg bg-gray-300"></div>
            </div>
            <div className="bg-gray-300 w-8 h-3 rounded-md ml-[99px]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "chatconv") {
    return (
      <div className="w-full p-1 mt-2 flex flex-col ">
        <div className="flex flex-col gap-4 w-full  mt-11">
          <div className="w-28 h-9 rounded-lg ml-5 bg-gray-300"></div>
          <div className="w-28 h-9 rounded-lg bg-gray-300 flex ml-[39rem]"></div>
          <div className="w-28 h-9 rounded-lg ml-5 bg-gray-300"></div>
          <div className="w-28 h-9 rounded-lg bg-gray-300 flex ml-[39rem]"></div>
          <div className="w-28 h-9 rounded-lg ml-5 bg-gray-300"></div>
          <div className="w-28 h-9 rounded-lg bg-gray-300 flex ml-[39rem]"></div>
          <div className="w-28 h-9 rounded-lg ml-5 bg-gray-300"></div>
          <div className="w-28 h-9 rounded-lg bg-gray-300 flex ml-[39rem]"></div>
          <div className="w-28 h-9 rounded-lg ml-5 bg-gray-300"></div>
          <div className="w-28 h-9 rounded-lg bg-gray-300 flex ml-[39rem]"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default Skeleton;
