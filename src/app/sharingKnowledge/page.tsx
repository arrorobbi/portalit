"use client";
import dynamic from "next/dynamic";
import Topbar from "../components/TopBar";

const DynamicCom = dynamic(() => import("../components/EnhancedQuillEditor"), {
  ssr: false,
});

const SharingKnowledgePage: React.FC = () => {
  return (
    <div>
      <Topbar />
      <div className="pt-28">
        <DynamicCom />
      </div>
    </div>
  );
};

export default SharingKnowledgePage;
