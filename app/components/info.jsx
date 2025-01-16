import React from "react";
import Profile from "../(pages)/profile/[id]/page";
import Search from "@/app/components/search";

const Info = ({ selectedComponent, selectedProfileId }) => {
  return (
    <div className="h-full">
     {selectedComponent === "profile" && selectedProfileId && (
        <Profile profileId={selectedProfileId} /> 
      )}
      {selectedComponent === "search" && <Search />}
    </div>
  );
};

export default Info;
