import React from "react";
import { Order } from "../types";

interface CompleteScreenProps {
  order: Order | null;
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({ order }) => {
  if (!order) {
    return (
      <div className="screen complete-screen">
        <h2>注文がありません</h2>
        <p>前の画面に戻って注文を完了してください。</p>
      </div>
    );
  }

  return (
    <div className="screen complete-screen">
      <h2>ご注文完了</h2>
      <p>
        ご注文番号：<strong>#{order.id}</strong>
      </p>
      <p>
        合計金額：<strong>¥{order.total}</strong>
      </p>
      <p>
        この度はご利用いただきありがとうございます。注文が完了しました。担当者がお伺いします。
      </p>
    </div>
  );
};

export default CompleteScreen;
