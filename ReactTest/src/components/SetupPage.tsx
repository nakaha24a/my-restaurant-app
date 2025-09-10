// src/components/SetupPage.tsx
import React, { useState } from "react";
import Notification from "./Notification";

interface SetupPageProps {
  onStart: (names: string[]) => void;
}

const SetupPage: React.FC<SetupPageProps> = ({ onStart }) => {
  const [names, setNames] = useState<string[]>(Array(3).fill(""));
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleAddMember = () => {
    setNames([...names, ""]);
  };

  const handleDeleteMember = (index: number) => {
    if (names.length <= 2) {
      showNotification("メンバーは2人以上必要です。", "error");
      return;
    }
    setNames(names.filter((_, i) => i !== index));
  };

  const handleStart = () => {
    let trimmedNames = names.map((name) => name.trim());
    if (trimmedNames.some((name) => name === "")) {
      trimmedNames = trimmedNames.map(
        (name, index) => name || `参加者${index + 1}`
      );
    }
    const uniqueNames = new Set(trimmedNames);

    if (trimmedNames.length !== uniqueNames.size) {
      showNotification("メンバー名が重複しています。", "error");
      return;
    }

    onStart(trimmedNames);
  };

  return (
    <div className="container" id="setupContainer">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="header">
        <h1>メンバー設定</h1>
        <p>
          メンバーの名前を入力してください。（未入力の場合は自動で設定されます）
        </p>
      </div>
      <div className="card">
        <h2>メンバーの名前</h2>
        <div id="nameForm">
          {names.map((name, index) => (
            <div className="input-group" key={index}>
              <label>メンバー{index + 1}:</label>
              <input
                type="text"
                placeholder="名前を入力"
                value={name || ""}
                onChange={(e) => handleNameChange(index, e.target.value)}
              />
              <button
                className="small-btn danger-outline"
                onClick={() => handleDeleteMember(index)}
              >
                削除
              </button>
            </div>
          ))}
        </div>
        <div className="button-container">
          <button className="small-btn" onClick={handleAddMember}>
            メンバーを追加
          </button>
        </div>
        <div className="button-container">
          <button id="goToApp" className="primary-action" onClick={handleStart}>
            注文をはじめる
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
