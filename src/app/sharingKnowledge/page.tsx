"use client";
import React from "react";
import dynamic from "next/dynamic";
import Topbar from "../components/TopBar";
import { Input } from "@/components/ui/input";

const DynamicCom = dynamic(() => import("../components/EnhancedQuillEditor"), {
  ssr: false,
});

const SharingKnowledgePage: React.FC = () => {
  return (
    <div>
      <Topbar />
      <div className="mt-40">
        <Input type="text" placeholder="Title" />
        <DynamicCom />
      </div>
    </div>
  );
};

export default SharingKnowledgePage;
