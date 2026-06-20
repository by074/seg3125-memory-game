export const LEVELS = {
  easy: {
    label: "Easy",
    description: "Perfect for beginners",
    pairs: 6,
    timeLimit: null,
    columns: 4,
  },
  medium: {
    label: "Medium",
    description: "A bit more of a challenge",
    pairs: 8,
    timeLimit: 90,
    columns: 4,
  },
  hard: {
    label: "Hard",
    description: "More cards, timer enabled",
    pairs: 10,
    timeLimit: 60,
    columns: 5,
  },
};

export const THEMES = {
  farm: {
    label: "Farm Animals",
    icon: "🏡",
    animals: [
      { id: "cow", label: "Cow", icon: "🐮" },
      { id: "pig", label: "Pig", icon: "🐷" },
      { id: "chicken", label: "Chicken", icon: "🐔" },
      { id: "sheep", label: "Sheep", icon: "🐑" },
      { id: "horse", label: "Horse", icon: "🐴" },
      { id: "goat", label: "Goat", icon: "🐐" },
      { id: "duck", label: "Duck", icon: "🦆" },
      { id: "dog", label: "Dog", icon: "🐶" },
      { id: "cat", label: "Cat", icon: "🐱" },
      { id: "rabbit", label: "Rabbit", icon: "🐰" },
    ],
  },
  wild: {
    label: "Wild Animals",
    icon: "🐾",
    animals: [
      { id: "lion", label: "Lion", icon: "🦁" },
      { id: "tiger", label: "Tiger", icon: "🐯" },
      { id: "elephant", label: "Elephant", icon: "🐘" },
      { id: "giraffe", label: "Giraffe", icon: "🦒" },
      { id: "zebra", label: "Zebra", icon: "🦓" },
      { id: "gorilla", label: "Gorilla", icon: "🦍" },
      { id: "monkey", label: "Monkey", icon: "🐵" },
      { id: "fox", label: "Fox", icon: "🦊" },
      { id: "bear", label: "Bear", icon: "🐻" },
      { id: "panda", label: "Panda", icon: "🐼" },
    ],
  },
  ocean: {
    label: "Ocean Animals",
    icon: "🌊",
    animals: [
      { id: "dolphin", label: "Dolphin", icon: "🐬" },
      { id: "whale", label: "Whale", icon: "🐳" },
      { id: "fish", label: "Fish", icon: "🐟" },
      { id: "octopus", label: "Octopus", icon: "🐙" },
      { id: "crab", label: "Crab", icon: "🦀" },
      { id: "shrimp", label: "Shrimp", icon: "🦐" },
      { id: "seal", label: "Seal", icon: "🦭" },
      { id: "turtle", label: "Turtle", icon: "🐢" },
      { id: "shark", label: "Shark", icon: "🦈" },
      { id: "shell", label: "Shell", icon: "🐚" },
    ],
  },
};