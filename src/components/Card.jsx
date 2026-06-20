function Card({ card, isOpen, isMatched, disabled, onClick }) {
  return (
    <button
      className={`memory-card ${isOpen ? "is-open" : ""} ${
        isMatched ? "is-matched" : ""
      }`}
      onClick={() => onClick(card)}
      disabled={disabled || isMatched}
      aria-label={isOpen ? card.label : "Hidden animal card"}
    >
      <span className="card-inner">
        <span className="card-face card-back">🐾</span>
        <span className="card-face card-front">
          <span className="animal-emoji">{card.icon}</span>
          <span className="animal-name">{card.label}</span>
        </span>
      </span>
    </button>
  );
}

export default Card;