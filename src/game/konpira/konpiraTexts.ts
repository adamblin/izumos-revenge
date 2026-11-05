import type { Hand, LossReason } from "./KonpiraMatch";

/** Every text of the minigame, kept apart from the code so writers can edit it. */
export const KONPIRA_TEXTS = {
  title: "Konpira Fune Fune",
  rules: [
    "Take turns with your rival, on the beat. The song keeps getting faster.",
    "Cup on the tray: tap the tray with your palm, or take the cup.",
    "Your rival has the cup: strike with your fist.",
    "You have the cup: put it back on your next turn.",
    "One wrong hand or one missed beat and the game is over.",
  ],
  start: "Begin",
  continue: "Continue",
  yourTurn: "Your turn",
  rivalTurn: "Rival",
  hands: { palm: "Palm", fist: "Fist", cup: "Cup" } satisfies Record<
    Hand,
    string
  >,
  won: "You win!",
  lost: "You lose",
  rivalSlipped: "Your rival played the wrong hand.",
  lossReasons: {
    "wrong-hand": "You played the wrong hand.",
    "too-late": "You missed the beat.",
  } satisfies Record<LossReason, string>,
  // The traditional song from Kagawa, in romaji
  lyrics: [
    "Konpira fune fune",
    "Oite ni ho kakete",
    "Shura shu shu shu",
    "Mawareba Shikoku wa",
    "Sanshu Naka no Gori",
    "Zozusan",
    "Konpira Daigongen",
    "Ichido mawareba",
  ],
};
