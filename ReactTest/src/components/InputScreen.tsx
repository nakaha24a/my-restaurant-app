// src/components/ResultPage.tsx
import React from "react";
import type { OrderItem } from "../types";

interface ResultPageProps {
  participants: string[];
  orders: OrderItem[];
  onReset: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({
  participants,
  orders,
  onReset,
}) => {
  const calculateResult = () => {
    const totalPayments: { [key: string]: number } = {};
    participants.forEach((p) => (totalPayments[p] = 0));

    orders.forEach((order) => {
      const payingParticipants = order.participants;
      if (payingParticipants.length > 0) {
        const splitPrice = order.price / payingParticipants.length;
        payingParticipants.forEach((p) => {
          totalPayments[p] += splitPrice;
        });
      }
    });

    return totalPayments;
  };

  const finalPayments = calculateResult();

  const totalBill = orders.reduce((sum, order) => sum + order.price, 0);

  return (
    <div className="container" id="resultContainer">
      <div className="header">
        <h1>精算結果</h1>
      </div>
      <div className="card">
        <h2>合計金額: ¥{totalBill.toLocaleString()}</h2>
        <table id="resultTable">
          <thead>
            <tr>
              <th>名前</th>
              <th>支払い金額</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((name, index) => (
              <tr key={index}>
                <td>{name}</td>
                <td>¥{Math.round(finalPayments[name]).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-container">
        <button className="primary-action" onClick={onReset}>
          最初からやり直す
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
