import { useEffect, useMemo, useState } from "react";
import Card from "./components/Card.jsx";
import { LEVELS, THEMES } from "./data/gameData.js";
import "./App.css";

function shuffleCards(cards) {
  return [...cards].sort(() => Math.random() - 0.5);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function createDeck(levelKey, themeKey) {
  const level = LEVELS[levelKey];
  const theme = THEMES[themeKey];

  const selectedAnimals = theme.animals.slice(0, level.pairs);

  const duplicatedCards = selectedAnimals.flatMap((animal) => [
    {
      ...animal,
      uid: `${animal.id}-a`,
      matchId: animal.id,
    },
    {
      ...animal,
      uid: `${animal.id}-b`,
      matchId: animal.id,
    },
  ]);

  return shuffleCards(duplicatedCards);
}

function App() {
  // These are the settings currently selected on the left panel.
  // They should not affect the active board until the user starts a new challenge.
  const [difficulty, setDifficulty] = useState("hard");
  const [themeKey, setThemeKey] = useState("wild");

  // These are the settings used by the current active game.
  const [activeDifficulty, setActiveDifficulty] = useState("hard");
  const [activeThemeKey, setActiveThemeKey] = useState("wild");

  const [screen, setScreen] = useState("setup");
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCardIds, setMatchedCardIds] = useState([]);

  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [feedback, setFeedback] = useState(
    "Choose your level and theme to begin."
  );

  // Preview settings: used only for the setup screen and left-side descriptions.
  const selectedLevel = LEVELS[difficulty];
  const selectedTheme = THEMES[themeKey];

  // Active game settings: used during playing and result.
  const level = LEVELS[activeDifficulty];
  const theme = THEMES[activeThemeKey];

  const totalPairs = cards.length / 2;
  const matchedPairs = matchedCardIds.length / 2;

  const timeRemaining = level.timeLimit
    ? Math.max(level.timeLimit - elapsed, 0)
    : null;

  const displayedTime = level.timeLimit
    ? formatTime(timeRemaining)
    : formatTime(elapsed);

  const finalScore = useMemo(() => {
    const timeBonus = level.timeLimit ? timeRemaining * 5 : 0;
    return score + timeBonus;
  }, [score, timeRemaining, level.timeLimit]);

  const gameCompleted =
    cards.length > 0 && matchedCardIds.length === cards.length;

  const timeIsUp = Boolean(level.timeLimit) && elapsed >= level.timeLimit;

  useEffect(() => {
    if (screen !== "playing") return;

    const timer = setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "playing") return;

    if (gameCompleted) {
      setFeedback("Challenge complete!");
      const resultTimer = setTimeout(() => {
        setScreen("result");
      }, 700);

      return () => clearTimeout(resultTimer);
    }

    if (timeIsUp && !gameCompleted) {
      setFeedback("Time is up!");
      const resultTimer = setTimeout(() => {
        setScreen("result");
      }, 700);

      return () => clearTimeout(resultTimer);
    }
  }, [screen, gameCompleted, timeIsUp]);

  function startGame() {
    // Only here do the selected difficulty/theme become the active game settings.
    setActiveDifficulty(difficulty);
    setActiveThemeKey(themeKey);

    const newDeck = createDeck(difficulty, themeKey);

    setCards(newDeck);
    setSelectedCards([]);
    setMatchedCardIds([]);
    setMoves(0);
    setScore(0);
    setElapsed(0);
    setFeedback("Find all matching animal pairs!");
    setScreen("playing");
  }

  function handleCardClick(card) {
    if (screen !== "playing") return;
    if (timeIsUp || gameCompleted) return;
    if (selectedCards.length === 2) return;
    if (selectedCards.some((selected) => selected.uid === card.uid)) return;
    if (matchedCardIds.includes(card.uid)) return;

    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      setMoves((current) => current + 1);

      const [firstCard, secondCard] = newSelection;

      if (firstCard.matchId === secondCard.matchId) {
        setFeedback("MATCH! +100 POINTS");
        setScore((current) => current + 100);

        setTimeout(() => {
          setMatchedCardIds((current) => [
            ...current,
            firstCard.uid,
            secondCard.uid,
          ]);
          setSelectedCards([]);
        }, 500);
      } else {
        setFeedback("Missed match. -10 points");
        setScore((current) => Math.max(0, current - 10));

        setTimeout(() => {
          setSelectedCards([]);
        }, 900);
      }
    }
  }

  function changeLevel() {
    setScreen("setup");
    setCards([]);
    setSelectedCards([]);
    setMatchedCardIds([]);
    setMoves(0);
    setScore(0);
    setElapsed(0);
    setFeedback("Choose your level and theme to begin.");
  }

  function getRating() {
    if (!gameCompleted) return "Keep Practicing";
    if (finalScore >= 1200) return "Great Focus";
    if (finalScore >= 900) return "Strong Memory";
    return "Good Effort";
  }

  return (
    <main className="app">
      <section className="game-shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-badge">
              <svg
                className="paw-icon"
                width="42"
                height="42"
                viewBox="0 0 64 64"
                fill="#ffd91f"
                aria-hidden="true"
              >
                <ellipse cx="20" cy="18" rx="6" ry="8" />
                <ellipse cx="31" cy="13" rx="6" ry="8" />
                <ellipse cx="43" cy="18" rx="6" ry="8" />
                <ellipse cx="49" cy="30" rx="5" ry="7" />
                <path d="M22 33c-6 4-8 10-5 15 3 5 10 7 15 4 2-1 4-1 6 0 5 3 12 1 15-4 3-5 1-11-5-15-7-5-19-5-26 0z" />
              </svg>
            </div>

            <div>
              <p>ANIMAL MEMORY</p>
              <h1>MATCH CHALLENGE</h1>
            </div>
          </div>

          <div className="player-status">
          

            <div className="player">
              <span className="avatar">★</span>
              <div>
                <strong>Player</strong>
                <small>Ready to compete</small>
              </div>
            </div>
          </div>
        </header>

        <div className="content-grid">
          <aside className="control-panel">
            <h2 className="main-title">
              <span className="title-line title-white">ANIMAL MEMORY</span>
              <span className="title-line title-yellow">MATCH CHALLENGE</span>
            </h2>

            <p className="intro">
              Match all animal pairs as fast as possible with the fewest moves.
            </p>

            <div className="divider" />

            <section className="option-section">
              <h3>◎ Choose Difficulty</h3>

              <div className="option-row">
                {Object.entries(LEVELS).map(([key, value]) => (
                  <button
                    key={key}
                    className={`option-button ${
                      difficulty === key ? "selected" : ""
                    }`}
                    onClick={() => setDifficulty(key)}
                  >
                    <span>★</span>
                    {value.label}
                  </button>
                ))}
              </div>

              <p className="hint">⚡ {selectedLevel.description}</p>
            </section>

            <section className="option-section">
              <h3>🐾 Choose Theme</h3>

              <div className="theme-row">
                {Object.entries(THEMES).map(([key, value]) => (
                  <button
                    key={key}
                    className={`theme-button ${
                      themeKey === key ? "selected" : ""
                    }`}
                    onClick={() => setThemeKey(key)}
                  >
                    <span>{value.icon}</span>
                    {value.label}
                  </button>
                ))}
              </div>
            </section>

            <button className="primary-button" onClick={startGame}>
              🏆 {screen === "setup" ? "Start Challenge" : "New Challenge"}
            </button>
          </aside>

          <section className="play-panel">
            {screen === "setup" && (
              <div className="preview-panel">
                <div className="panel-heading">
                  <h3>💪 Challenge Preview</h3>
                </div>

                <div className="preview-stats">
                  <div>
                    <strong>{selectedLevel.pairs * 2}</strong>
                    <span>Cards</span>
                  </div>

                  <div>
                    <strong>
                      {selectedLevel.timeLimit
                        ? `${selectedLevel.timeLimit}`
                        : "∞"}
                    </strong>
                    <span>Seconds</span>
                  </div>

                  <div>
                    <strong>--</strong>
                    <span>Best Moves</span>
                  </div>
                </div>

                <div
                  className="preview-grid"
                  style={{ "--columns": selectedLevel.columns }}
                >
                  {selectedTheme.animals
                    .slice(0, selectedLevel.pairs)
                    .map((animal, index) => (
                      <div className="preview-card" key={animal.id}>
                        {index % 2 === 0 ? (
                          <span>{animal.icon}</span>
                        ) : (
                          <span className="card-back-symbol">🐾</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {screen === "playing" && (
              <div className="game-panel">
                <div className="game-stats">
                  <div>
                    <span>⏱️</span>
                    <small>Time</small>
                    <strong>{displayedTime}</strong>
                  </div>

                  <div>
                    <span>👣</span>
                    <small>Moves</small>
                    <strong>{moves}</strong>
                  </div>

                  <div>
                    <span>🐾</span>
                    <small>Matches</small>
                    <strong>
                      {matchedPairs}/{totalPairs}
                    </strong>
                  </div>

                  <div>
                    <span>⭐</span>
                    <small>Score</small>
                    <strong>{score}</strong>
                  </div>
                </div>

                <div className="feedback">{feedback}</div>

                <div
                  className="card-grid"
                  style={{ "--columns": level.columns }}
                >
                  {cards.map((card) => {
                    const isOpen =
                      selectedCards.some(
                        (selected) => selected.uid === card.uid
                      ) || matchedCardIds.includes(card.uid);

                    return (
                      <Card
                        key={card.uid}
                        card={card}
                        isOpen={isOpen}
                        isMatched={matchedCardIds.includes(card.uid)}
                        disabled={selectedCards.length === 2}
                        onClick={handleCardClick}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {screen === "result" && (
              <div className="result-panel">
                <div className="trophy">🏆</div>

                <h2>{gameCompleted ? "Challenge Complete!" : "Time Is Up!"}</h2>

                <p>
                  {gameCompleted
                    ? "Great job! You completed the challenge."
                    : "Try again to complete all matches."}
                </p>

                <div className="summary-grid">
                  <div>
                    <small>Level</small>
                    <strong>{level.label}</strong>
                  </div>

                  <div>
                    <small>Theme</small>
                    <strong>{theme.label}</strong>
                  </div>

                  <div>
                    <small>Final Time</small>
                    <strong>{formatTime(elapsed)}</strong>
                  </div>

                  <div>
                    <small>Moves</small>
                    <strong>{moves}</strong>
                  </div>

                  <div>
                    <small>Final Score</small>
                    <strong>{finalScore}</strong>
                  </div>

                  <div>
                    <small>Rating</small>
                    <strong>{getRating()}</strong>
                  </div>
                </div>

                <div className="result-actions">
                  <button onClick={startGame}>↻ Play Again</button>

                  <button className="yellow" onClick={startGame}>
                    ⚡ Try to Beat Score
                  </button>

                  <button onClick={changeLevel}>☰ Change Level</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;

