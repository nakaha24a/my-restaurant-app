// src/components/WarikanApp.tsx
import React, { useState } from "react";
import type { Product } from "../types";
import ParticipantModal from "./ParticipantModal";
import Notification from "./Notification";

interface WarikanAppProps {
  participants: string[];
  onFinalize: (participants: string[], products: Product[]) => void;
}

const WarikanApp: React.FC<WarikanAppProps> = ({
  participants,
  onFinalize,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);
  const [newParticipantName, setNewParticipantName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(productPrice);
    if (!productName || isNaN(price) || price <= 0 || productQuantity <= 0) {
      showNotification("正しい品目、金額、数量を入力してください。", "error");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      price: price * productQuantity,
      quantity: productQuantity,
      participants: participants.map(() => true),
    };
    setProducts([...products, newProduct]);
    setProductName("");
    setProductPrice("");
    setProductQuantity(1);
    showNotification("リストにアイテムを追加しました。", "success");
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    showNotification("品目を削除しました。", "success");
  };

  const calculateSplitPrice = (product: Product): number => {
    const checkedCount = product.participants.filter(Boolean).length;
    return checkedCount > 0 ? Math.round(product.price / checkedCount) : 0;
  };

  const openModal = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const saveModal = () => {
    if (currentProduct) {
      setProducts(
        products.map((p) =>
          p.id === currentProduct.id
            ? { ...p, participants: currentProduct.participants }
            : p
        )
      );
    }
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleModalToggle = (index: number) => {
    if (currentProduct) {
      const newParticipants = [...currentProduct.participants];
      newParticipants[index] = !newParticipants[index];
      setCurrentProduct({
        ...currentProduct,
        participants: newParticipants,
      });
    }
  };

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newParticipantName.trim();
    if (!trimmedName) {
      showNotification("名前を入力してください。", "error");
      return;
    }
    if (participants.includes(trimmedName)) {
      showNotification("その名前は既に使用されています。", "error");
      return;
    }

    const newParticipantsList = [...participants, trimmedName];
    setProducts(
      products.map((product) => ({
        ...product,
        participants: [...product.participants, true],
      }))
    );
    onFinalize(newParticipantsList, products);
    setNewParticipantName("");
    showNotification(`${trimmedName}さんを追加しました。`, "success");
  };

  const removeParticipant = (name: string) => {
    if (!window.confirm(`${name}さんを削除しますか？`)) {
      return;
    }
    const indexToRemove = participants.indexOf(name);
    const newParticipantsList = participants.filter((p) => p !== name);

    setProducts(
      products.map((product) => ({
        ...product,
        participants: product.participants.filter(
          (_, i) => i !== indexToRemove
        ),
      }))
    );
    onFinalize(newParticipantsList, products);
    showNotification(`${name}さんを削除しました。`, "success");
  };

  return (
    <div className="container" id="appContainer">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="header">
        <h1>スマート割り勘</h1>
      </div>
      <div className="top-cards-container">
        <div className="card" id="member-card">
          <h2>メンバー</h2>
          <div className="participant-list-container">
            {participants.map((name, index) => (
              <div key={index} className="participant-tag">
                {name}
                <button onClick={() => removeParticipant(name)}>×</button>
              </div>
            ))}
          </div>
          <div className="input-group">
            <input
              type="text"
              id="newParticipant"
              placeholder="途中参加のメンバー名"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
            />
            <button onClick={addParticipant}>追加</button>
          </div>
        </div>
        <div className="card" id="item-add-card">
          <h2>買ったもの</h2>
          <form onSubmit={addProduct}>
            <div className="input-group vertical">
              <input
                type="text"
                id="productName"
                placeholder="品目（例：ピザ）"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <input
                type="number"
                id="productPrice"
                placeholder="単価（円）"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
              <input
                type="number"
                id="productQuantity"
                placeholder="数量（例：3）"
                min="1"
                value={productQuantity}
                onChange={(e) => setProductQuantity(Number(e.target.value))}
              />
              <button type="submit">リストに追加</button>
            </div>
          </form>
        </div>
      </div>
      <div className="card">
        <h2>支払いリスト</h2>
        <div className="table-container">
          <table id="productTable">
            <thead>
              <tr id="tableHeader">
                <th>品目</th>
                <th>金額</th>
                <th>1人分</th>
                <th>選択</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    まだ何もありません。
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.name}（×{product.quantity}）
                    </td>
                    <td>¥{product.price.toLocaleString()}</td>
                    <td>¥{calculateSplitPrice(product).toLocaleString()}</td>
                    <td>
                      <button
                        className="small-btn"
                        onClick={() => openModal(product)}
                      >
                        選択
                      </button>
                    </td>
                    <td>
                      <button
                        className="small-btn danger-outline"
                        onClick={() => deleteProduct(product.id)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="button-container">
        <button
          className="primary-action"
          onClick={() => onFinalize(participants, products)}
        >
          精算する
        </button>
      </div>
      {isModalOpen && currentProduct && (
        <ParticipantModal
          participants={participants}
          productName={currentProduct.name}
          checkedParticipants={currentProduct.participants}
          onToggle={handleModalToggle}
          onSave={saveModal}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default WarikanApp;
