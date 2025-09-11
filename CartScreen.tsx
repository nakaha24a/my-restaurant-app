import React from "react";
import { CartItem } from "../types";

interface CartScreenProps {
  cart: CartItem[];
  onBackToOrder: () => void;
  onCompleteOrder: (cart: CartItem[]) => void;
}

const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onBackToOrder,
  onCompleteOrder,
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getMemberName = (id: number): string => {
    // Note: members prop is not passed to this component for simplicity.
    // In a real app, you would pass it down from App.tsx.
    return `参加者${id}`; // 仮の表示
  };

  return (
    <div className="screen cart-screen">
      <h2>カート確認</h2>
      <ul className="cart-list">
        {cart.map((item, index) => (
          <li key={index} className="cart-item">
            <span>{item.name}</span>
            <span>x {item.quantity}</span>
            <span>¥{item.price * item.quantity}</span>
            <span>({getMemberName(item.orderedBy)})</span>
          </li>
        ))}
      </ul>
      <div className="total">
        <strong>合計金額: ¥{total}</strong>
      </div>
      <div className="button-group">
        <button onClick={onBackToOrder}>メニューに戻る</button>
        <button onClick={() => onCompleteOrder(cart)}>注文を確定する</button>
      </div>
    </div>
  );
};

export default CartScreen;
