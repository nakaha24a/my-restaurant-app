// src/components/MenuPage.tsx
import React, { useState } from "react";
import type { MenuItem, OrderItem } from "../types";
import Notification from "./Notification";

interface MenuPageProps {
  participants: string[];
  onProceedToResult: (orders: OrderItem[]) => void;
}

// ダミーのメニューデータ
const DUMMY_MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "マルゲリータピザ",
    price: 1500,
    image: "https://via.placeholder.com/150/FFC107/FFFFFF?text=Pizza",
  },
  {
    id: 2,
    name: "シーザーサラダ",
    price: 800,
    image: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=Salad",
  },
  {
    id: 3,
    name: "フライドポテト",
    price: 500,
    image: "https://via.placeholder.com/150/FF9800/FFFFFF?text=Fries",
  },
  {
    id: 4,
    name: "炭酸飲料",
    price: 300,
    image: "https://via.placeholder.com/150/03A9F4/FFFFFF?text=Drink",
  },
];

const MenuPage: React.FC<MenuPageProps> = ({
  participants,
  onProceedToResult,
}) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
  };

  const handleAddOrder = (menuItem: MenuItem) => {
    const newOrder: OrderItem = {
      id: Date.now(),
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      participants: [...participants],
    };
    setOrders([...orders, newOrder]);
    showNotification(`${menuItem.name} を注文に追加しました。`, "success");
  };

  const handleUpdateQuantity = (orderId: number, change: number) => {
    setOrders(
      orders
        .map((order) => {
          if (order.id === orderId) {
            const newQuantity = order.quantity + change;
            if (newQuantity > 0) {
              const menuItem = DUMMY_MENU_ITEMS.find(
                (item) => item.id === order.menuItemId
              );
              const newPrice = menuItem
                ? newQuantity * menuItem.price
                : order.price;
              return { ...order, quantity: newQuantity, price: newPrice };
            }
          }
          return order;
        })
        .filter((order) => order.quantity > 0)
    );
  };

  const handleDeleteOrder = (orderId: number) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    showNotification("注文を削除しました。", "success");
  };

  const handleToggleParticipant = (
    orderId: number,
    participantName: string
  ) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          const newParticipants = order.participants.includes(participantName)
            ? order.participants.filter((name) => name !== participantName)
            : [...order.participants, participantName];
          return { ...order, participants: newParticipants };
        }
        return order;
      })
    );
  };

  const handleProceed = () => {
    if (orders.length === 0) {
      showNotification("注文を追加してください。", "error");
      return;
    }
    const hasUncheckedOrder = orders.some(
      (order) => order.participants.length === 0
    );
    if (hasUncheckedOrder) {
      showNotification(
        "支払いをするメンバーが選択されていない品目があります。",
        "error"
      );
      return;
    }
    onProceedToResult(orders);
  };

  return (
    <div className="container" id="menuContainer">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="header">
        <h1>メニュー</h1>
        <p>注文したい品目を選んでください</p>
      </div>

      <div className="menu-items-container">
        {DUMMY_MENU_ITEMS.map((item) => (
          <div key={item.id} className="menu-item-card">
            <img src={item.image} alt={item.name} className="menu-item-image" />
            <div className="menu-item-info">
              <h3>{item.name}</h3>
              <p>¥{item.price.toLocaleString()}</p>
            </div>
            <button
              className="small-btn primary-action"
              onClick={() => handleAddOrder(item)}
            >
              注文
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>注文リスト</h2>
        {orders.length === 0 ? (
          <p style={{ textAlign: "center", color: "#757575" }}>
            まだ注文がありません。
          </p>
        ) : (
          <div className="order-list-container">
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-item-info">
                  <h4>{order.name}</h4>
                  <p>
                    ¥{order.price.toLocaleString()} ({order.quantity}個)
                  </p>
                </div>
                <div className="order-actions">
                  <button
                    className="small-btn"
                    onClick={() => handleUpdateQuantity(order.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="small-btn"
                    onClick={() => handleUpdateQuantity(order.id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="small-btn danger-outline"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    削除
                  </button>
                </div>
                <div className="order-participants-list">
                  <p>支払いメンバー:</p>
                  {participants.map((p) => (
                    <label key={p}>
                      <input
                        type="checkbox"
                        checked={order.participants.includes(p)}
                        onChange={() => handleToggleParticipant(order.id, p)}
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="button-container">
        <button className="primary-action" onClick={handleProceed}>
          注文を確定して精算へ
        </button>
      </div>
    </div>
  );
};

export default MenuPage;
