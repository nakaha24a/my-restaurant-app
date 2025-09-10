import React, { useState } from "react";
import menuData from "../data/menuData.json";
import { Member, CartItem, MenuItem } from "../types";

interface OrderScreenProps {
  members: Member[];
  onConfirmOrder: (cart: CartItem[]) => void;
}

const OrderScreen: React.FC<OrderScreenProps> = ({
  members,
  onConfirmOrder,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (item: MenuItem, memberId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === item.id && cartItem.orderedBy === memberId
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && cartItem.orderedBy === memberId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1, orderedBy: memberId }];
      }
    });
  };

  const getMemberName = (id: number): string => {
    const member = members.find((m) => m.id === id);
    return member ? member.name : `参加者${id}`;
  };

  return (
    <div className="screen order-screen">
      <h2>メニュー</h2>
      <div className="menu-list">
        {menuData.map((item: MenuItem) => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>¥{item.price}</p>
              {members.length > 1 && (
                <select
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleAddToCart(item, Number(e.target.value))
                  }
                >
                  <option value="">注文者を選択</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              )}
              {members.length <= 1 && (
                <button onClick={() => handleAddToCart(item, members[0].id)}>
                  カートに追加
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="goto-cart-btn" onClick={() => onConfirmOrder(cart)}>
        カートへ ({cart.length} 品)
      </button>
    </div>
  );
};

export default OrderScreen;
