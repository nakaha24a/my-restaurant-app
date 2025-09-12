import React, { useState, useEffect } from "react";
import { CartItem, Member } from "../types";

interface CheckoutScreenProps {
  cart: CartItem[];
  members: Member[];
  onBackToOrder: () => void;
  onCompleteOrder: () => void;
}

type SplitMethod = "equal" | "individual" | "perItem";

interface MemberPayment {
  member: Member;
  amount: number;
  items: CartItem[];
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  members,
  onBackToOrder,
  onCompleteOrder,
}) => {
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("equal");
  const [memberPayments, setMemberPayments] = useState<MemberPayment[]>([]);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    calculatePayments(splitMethod);
  }, [splitMethod, cart, members]); // splitMethod, cart, membersが変更されたら再計算

  const getMemberName = (id: number): string => {
    const member = members.find((m) => m.id === id);
    return member?.name || `参加者${id}`;
  };

  const calculatePayments = (method: SplitMethod) => {
    const payments: MemberPayment[] = members.map((member) => ({
      member,
      amount: 0,
      items: [],
    }));

    if (method === "equal") {
      const amountPerMember = totalAmount / members.length;
      payments.forEach((p) => (p.amount = amountPerMember));
    } else if (method === "individual") {
      members.forEach((member) => {
        const memberItems = cart.filter((item) => item.orderedBy === member.id);
        const memberTotal = memberItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const payment = payments.find((p) => p.member.id === member.id);
        if (payment) {
          payment.amount = memberTotal;
          payment.items = memberItems;
        }
      });
    } else if (method === "perItem") {
      // 各アイテムを誰が食べたか選択する複雑なロジックが必要
      // 今回は簡易的に、個別払いと同じロジックを初期値として設定
      // より詳細な実装では、アイテムごとにメンバーを選択するUIが必要
      members.forEach((member) => {
        const memberItems = cart.filter((item) => item.orderedBy === member.id);
        const memberTotal = memberItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const payment = payments.find((p) => p.member.id === member.id);
        if (payment) {
          payment.amount = memberTotal;
          payment.items = memberItems;
        }
      });
    }
    setMemberPayments(payments);
  };

  return (
    <div className="screen checkout-screen">
      <h2>会計</h2>
      <ul className="checkout-list">
        {cart.map((item, index) => (
          <li key={index} className="checkout-item">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>¥{item.price * item.quantity}</span>
            <span>({getMemberName(item.orderedBy)})</span>
          </li>
        ))}
      </ul>
      <div className="total">
        <strong>合計金額: ¥{totalAmount}</strong>
      </div>

      <div className="split-bill-section">
        <h3>割り勘方法を選択</h3>
        <div className="split-bill-options">
          <button
            onClick={() => setSplitMethod("equal")}
            className={splitMethod === "equal" ? "active" : ""}
          >
            均等割り
          </button>
          <button
            onClick={() => setSplitMethod("individual")}
            className={splitMethod === "individual" ? "active" : ""}
          >
            個別払い (注文者ごと)
          </button>
          {/*
          <button
            onClick={() => setSplitMethod("perItem")}
            className={splitMethod === "perItem" ? "active" : ""}
          >
            商品ごとに誰が食べたか選択
          </button>
          */}
        </div>

        <div className="split-bill-details">
          {memberPayments.map((payment, index) => (
            <div key={payment.member.id} className="split-member-item">
              <span>{payment.member.name}:</span>
              <span>¥{payment.amount.toLocaleString()}</span>
              {payment.items.length > 0 && (
                <ul className="split-item-list">
                  {payment.items.map((item) => (
                    <li key={`${item.id}-${item.orderedBy}-split`}>
                      {item.name} x {item.quantity} (¥
                      {item.price * item.quantity})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button onClick={onBackToOrder}>メニューに戻る</button>
        <button onClick={onCompleteOrder}>決済に進む</button>
      </div>
    </div>
  );
};

export default CheckoutScreen;
