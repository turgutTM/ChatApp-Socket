import Chatprofile from "./chat-profile";
import Chatconv from "./chat-conv";
import React, { useState } from "react";

const Chat = ({
  selectedProfileId,
  selectedProfileData,
  setSelectedProfileId,
  setSelectedProfileData,
}) => {
  const [lastmessagetime, setLastMessageTime] = useState("");
  return (
    <div className="bg-white  flex h-full p-3 rounded-[4.6%]">
      <div className="">
        <Chatprofile
          lastmessagetime={lastmessagetime}
          setSelectedProfileId={setSelectedProfileId}
          selectedProfileId={selectedProfileId}
          setSelectedProfileData={setSelectedProfileData}
        ></Chatprofile>
      </div>
      <div className="w-full">
        <Chatconv
          setLastMessageTime={setLastMessageTime}
          selectedProfileId={selectedProfileId}
          selectedProfileData={selectedProfileData}
        ></Chatconv>
      </div>
    </div>
  );
};

export default Chat;
