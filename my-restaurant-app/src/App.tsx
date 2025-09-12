import React, { useState } from "react";
import PartyInputScreen from "./components/PartyInputScreen";
import OrderScreen from "./components/OrderScreen"; // CartSidebarも含むように変更
import CheckoutScreen from "./components/CheckoutScreen";
import CompleteScreen from "./components/CompleteScreen";
import { Member, CartItem, Order } from "./types";
import "./App.css";

type Screen = "partyInput" | "order" | "checkout" | "complete";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("partyInput");
  const [members, setMembers] = useState<Member[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);

  const handleStartOrder = (members: Member[]) => {
    setMembers(members);
    setCurrentScreen("order");
  };

  const handleUpdateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
  };

  const handleGoToCheckout = () => {
    setCurrentScreen("checkout");
  };

  const handleCompleteOrder = () => {
    const newOrder: Order = {
      id: Math.floor(Math.random() * 100000),
      members: members,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      timestamp: new Date().toISOString(),
    };
    setOrder(newOrder);
    setCurrentScreen("complete");
  };

  return (
    <div className="app-container">
      {currentScreen === "partyInput" && (
        <PartyInputScreen onStartOrder={handleStartOrder} />
      )}
      {currentScreen === "order" && (
        // OrderScreen内でメニューとカートサイドバーの両方を表示
        <OrderScreen
          members={members}
          cart={cart}
          onUpdateCart={handleUpdateCart}
          onGoToCheckout={handleGoToCheckout}
        />
      )}
      {currentScreen === "checkout" && (
        <CheckoutScreen
          cart={cart}
          members={members}
          onBackToOrder={() => setCurrentScreen("order")}
          onCompleteOrder={handleCompleteOrder}
        />
      )}
      {currentScreen === "complete" && <CompleteScreen order={order} />}
    </div>
  );
};

export default App;
