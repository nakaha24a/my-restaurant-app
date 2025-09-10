// src/App.tsx
import React, { useState } from "react";
import SetupPage from "./components/SetupPage";
import MenuPage from "./components/MenuPage";
import ResultPage from "./components/InputScreen";
import type { OrderItem } from "./types";
import "./warikan.css";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"setup" | "menu" | "result">(
    "setup"
  );
  const [participants, setParticipants] = useState<string[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const handleStart = (names: string[]) => {
    setParticipants(names);
    setCurrentPage("menu");
  };

  const handleProceedToResult = (newOrders: OrderItem[]) => {
    setOrders(newOrders);
    setCurrentPage("result");
  };

  const handleReset = () => {
    setParticipants([]);
    setOrders([]);
    setCurrentPage("setup");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "setup":
        return <SetupPage onStart={handleStart} />;
      case "menu":
        return (
          <MenuPage
            participants={participants}
            onProceedToResult={handleProceedToResult}
          />
        );
      case "result":
        return (
          <ResultPage
            participants={participants}
            orders={orders}
            onReset={handleReset}
          />
        );
      default:
        return <SetupPage onStart={handleStart} />;
    }
  };

  return <div className="app-container">{renderPage()}</div>;
};

export default App;
