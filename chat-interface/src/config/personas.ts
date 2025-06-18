import type { Persona } from "@/types/chat";

export const PERSONAS: Persona[] = [
  {
    id: "emily",
    name: "Emily",
    description: "Start een gesprek!",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "jason",
    name: "Jason",
    description: "Start een gesprek!",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "kellan",
    name: "Kellan",
    description: "Start een gesprek!",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "jessica",
    name: "Jessica",
    description: "Start een gesprek!",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "kevin",
    name: "Kevin",
    description: "Start een gesprek!",
    color: "from-indigo-500 to-purple-500",
  },
];

export const INITIAL_MESSAGES: Record<string, string> = {
  Emily:
    "Hoi, ik ben Emily. Ik ben 24 jaar oud en gevlucht uit Hongkong na de protesten van 2019. In Taipei bouw ik met mijn vriend Jason aan een nieuw leven.",
  Jason:
    "Er waren jaren waarin ik mezelf verbood te praten over wat er gebeurde. Tot ik besefte dat zwijgen hen juist sterker maakte.",
  Kellan:
    "In mijn land leer je al jong om te zwijgen over wie je bent. Elke dag voelt als toneelspelen — maar dit is mijn echte stem",
  Jessica:
    "Ze zeiden dat mijn verhaal niet mocht, dat het vertrouwelijk was. Maar wie beschermt er eigenlijk wie als niemand luistert?",
  Kevin:
    "Mijn opa vertelde verhalen die nergens zijn opgeschreven. Als ik zwijg, verdwijnt niet alleen zijn stem — maar ook ons bestaan.",
};

export const getInitialMessage = (name: string): string => {
  return INITIAL_MESSAGES[name] || `Hi! I'm ${name}. How can I help you today?`;
};
