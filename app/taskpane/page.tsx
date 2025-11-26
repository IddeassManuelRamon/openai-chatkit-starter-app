"use client";

import { useState } from "react";
import Home from "./components/Home";
import SmartDoc from "./components/SmartDoc";
import SmartForm from "./components/SmartForm";
import SmartChat from "./components/SmartChat";

export type ModuleType = "home" | "smartdoc" | "smartform" | "smartchat";

export default function TaskpanePage() {
  const [currentModule, setCurrentModule] = useState<ModuleType>("home");

  const navigateTo = (module: ModuleType) => {
    setCurrentModule(module);
  };

  const goHome = () => {
    setCurrentModule("home");
  };

  return (
    <>
      {currentModule === "home" && <Home onNavigate={navigateTo} />}
      {currentModule === "smartdoc" && <SmartDoc onBack={goHome} />}
      {currentModule === "smartform" && <SmartForm onBack={goHome} />}
      {currentModule === "smartchat" && <SmartChat onBack={goHome} />}
    </>
  );
}
