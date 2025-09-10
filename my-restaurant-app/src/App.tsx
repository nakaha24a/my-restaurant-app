import React, { useState } from "react";
import "./components/styles.css";
import PartyInputScreen from "./components/PartyInputScreen";
import OrderScreen from "./components/OrderScreen";
import CartScreen from "./components/CartScreen";
import CompleteScreen from "./components/CompleteScreen";
import { Member, CartItem, Order } from "./types";

type ScreenState = "partyInput" | "order" | "cart" | "complete";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("partyInput");
  const [members, setMembers] = useState<Member[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);

  const handleStartOrder = (partyMembers: Member[]) => {
    setMembers(partyMembers);
    setCurrentScreen("order");
  };

  const handleConfirmOrder = (cartItems: CartItem[]) => {
    setCart(cartItems);
    setCurrentScreen("cart");
  };

  const handleCompleteOrder = (finalCart: CartItem[]) => {
    const newOrder: Order = {
      id: Date.now(),
      members,
      items: finalCart,
      total: finalCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      timestamp: new Date().toISOString(),
    };
    setOrder(newOrder);
    setCurrentScreen("complete");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "partyInput":
        return <PartyInputScreen onStartOrder={handleStartOrder} />;
      case "order":
        return (
          <OrderScreen members={members} onConfirmOrder={handleConfirmOrder} />
        );
      case "cart":
        return (
          <CartScreen
            cart={cart}
            onBackToOrder={() => setCurrentScreen("order")}
            onCompleteOrder={handleCompleteOrder}
          />
        );
      case "complete":
        return <CompleteScreen order={order} />;
      default:
        return <PartyInputScreen onStartOrder={handleStartOrder} />;
    }
  };

  return <div className="app-container">{renderScreen()}</div>;
};

export default App;
