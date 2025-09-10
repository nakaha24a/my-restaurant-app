// src/components/ParticipantModal.tsx
import React from "react";

interface ParticipantModalProps {
  participants: string[];
  productName: string;
  checkedParticipants: boolean[];
  onToggle: (index: number) => void;
  onSave: () => void;
  onClose: () => void;
}

const ParticipantModal: React.FC<ParticipantModalProps> = ({
  participants,
  productName,
  checkedParticipants,
  onToggle,
  onSave,
  onClose,
}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>「{productName}」の支払いメンバー</h3>
        <p>支払いをするメンバーにチェックを入れてください</p>
        <div id="modalParticipantList">
          {participants.map((name, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={checkedParticipants[index]}
                onChange={() => onToggle(index)}
              />
              {name}
            </label>
          ))}
        </div>
        <div className="button-container">
          <button id="saveModal" onClick={onSave}>
            決定
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantModal;
