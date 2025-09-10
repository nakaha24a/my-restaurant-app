// src/components/Notification.tsx
import React, { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 500); // アニメーション後に非表示にする
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, type, onClose]);

  const notificationClass = `notification ${type} ${isVisible ? "show" : ""}`;

  return <div className={notificationClass}>{message}</div>;
};

export default Notification;
