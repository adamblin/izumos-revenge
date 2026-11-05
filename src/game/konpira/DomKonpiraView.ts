import { getImageUrl } from "narrat";
import type { CupPosition, Hand, KonpiraOutcome, Seat } from "./KonpiraMatch";
import type { KonpiraView } from "./KonpiraView";
import type { KONPIRA_TEXTS } from "./konpiraTexts";

const ASSETS = "img/minigames/konpira/";
const HANDS: readonly { hand: Hand; key: string; code: string }[] = [
  { hand: "palm", key: "A", code: "KeyA" },
  { hand: "fist", key: "S", code: "KeyS" },
  { hand: "cup", key: "D", code: "KeyD" },
];
const CONFIRM_KEYS = ["Space", "Enter"];

const imageUrl = (name: string) => getImageUrl(`${ASSETS}${name}.svg`);

/**
 * Full-screen DOM overlay mounted inside #narrat (so it inherits the theme tokens).
 * While open it takes every key press, so nothing reaches narrat's dialogue or menus.
 * Styling lives in main.css under "Konpira Fune Fune".
 */
export class DomKonpiraView implements KonpiraView {
  private root?: HTMLElement;
  private board?: HTMLElement;
  private lyric?: HTMLElement;
  private status?: HTMLElement;
  private timer?: HTMLElement;
  private timerAnimation?: Animation;
  private readonly seats = new Map<Seat, HTMLElement>();
  private keyHandler?: (code: string) => void;

  private readonly onKeyDown = (event: KeyboardEvent) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    if (!event.repeat) this.keyHandler?.(event.code);
  };

  constructor(private readonly texts: typeof KONPIRA_TEXTS) {}

  async open(onHand: (hand: Hand) => void): Promise<void> {
    const root = element("div", "konpira");
    // Clicks stay here so they can't reach the game underneath
    root.addEventListener("click", (event) => event.stopPropagation());
    this.root = root;
    document.querySelector("#narrat")?.appendChild(root);
    window.addEventListener("keydown", this.onKeyDown, true);

    await this.showPanel(this.texts.title, this.texts.rules, this.texts.start);
    this.buildBoard(onHand);
  }

  showHand(seat: Seat, hand: Hand, cup: CupPosition, beatMs: number): void {
    const holder = this.seats.get(seat);
    // Taking or returning the cup is done with an open hand
    const pose = hand === "fist" ? "fist" : "palm";
    holder?.querySelector("img")?.setAttribute("src", imageUrl(pose));
    holder?.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(var(--konpira-strike))", offset: 0.35 },
        { transform: "translateY(0)" },
      ],
      { duration: Math.min(beatMs * 0.8, 320), easing: "ease-out" },
    );
    this.board?.setAttribute("data-cup", cup);
    this.setTurn("opponent");
  }

  showPlayerTurn(beatMs: number): void {
    this.setTurn("player");
    this.timerAnimation?.cancel();
    this.timerAnimation = this.timer?.animate(
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      { duration: beatMs, fill: "forwards" },
    );
  }

  showLyric(line: string): void {
    if (this.lyric) this.lyric.textContent = line;
  }

  showResult(outcome: KonpiraOutcome): Promise<void> {
    const won = outcome.loser === "opponent";
    return this.showPanel(
      won ? this.texts.won : this.texts.lost,
      [won ? this.texts.rivalSlipped : this.texts.lossReasons[outcome.reason]],
      this.texts.continue,
    );
  }

  close(): void {
    window.removeEventListener("keydown", this.onKeyDown, true);
    this.keyHandler = undefined;
    this.root?.remove();
    this.root = undefined;
    this.seats.clear();
  }

  /** Paper card over everything, used for the rules and the result. */
  private showPanel(
    title: string,
    lines: readonly string[],
    action: string,
  ): Promise<void> {
    return new Promise((resolve) => {
      const panel = element("div", "konpira__panel");
      panel.appendChild(element("h2", "konpira__title", title));
      for (const line of lines) {
        panel.appendChild(element("p", "konpira__line", line));
      }

      const finish = () => {
        this.keyHandler = undefined;
        panel.remove();
        resolve();
      };
      const button = element("button", "nrt-button konpira__action", action);
      button.addEventListener("click", finish);
      panel.appendChild(button);

      this.keyHandler = (code) => {
        if (CONFIRM_KEYS.includes(code)) finish();
      };
      this.root?.appendChild(panel);
    });
  }

  private buildBoard(onHand: (hand: Hand) => void): void {
    const lyric = element("div", "konpira__lyric");
    const status = element("div", "konpira__status");
    const timer = element("div", "konpira__timer-fill");
    const track = element("div", "konpira__timer");
    track.appendChild(timer);

    const board = element("div", "konpira__board");
    board.setAttribute("data-cup", "tray");
    board.append(
      image("tray", "konpira__tray"),
      image("cup", "konpira__cup"),
      this.buildSeat("opponent"),
      this.buildSeat("player"),
    );

    const buttons = element("div", "konpira__hands");
    for (const { hand, key } of HANDS) {
      const button = element("button", "nrt-button konpira__hand-button");
      button.append(
        image(hand, "konpira__hand-icon"),
        element("span", "", this.texts.hands[hand]),
        element("kbd", "konpira__key", key),
      );
      button.addEventListener("click", () => onHand(hand));
      buttons.appendChild(button);
    }

    this.keyHandler = (code) => {
      const pressed = HANDS.find((entry) => entry.code === code);
      if (pressed) onHand(pressed.hand);
    };

    this.lyric = lyric;
    this.status = status;
    this.timer = timer;
    this.board = board;
    this.root?.append(lyric, board, status, track, buttons);
    this.setTurn("opponent");
  }

  private buildSeat(seat: Seat): HTMLElement {
    const holder = element("div", `konpira__seat konpira__seat--${seat}`);
    holder.appendChild(image("palm", "konpira__hand"));
    this.seats.set(seat, holder);
    return holder;
  }

  private setTurn(seat: Seat): void {
    this.root?.setAttribute("data-turn", seat);
    if (this.status) {
      this.status.textContent =
        seat === "player" ? this.texts.yourTurn : this.texts.rivalTurn;
    }
  }
}

function image(name: string, className: string): HTMLImageElement {
  const img = element("img", className) as HTMLImageElement;
  img.src = imageUrl(name);
  img.alt = "";
  img.draggable = false;
  return img;
}

function element(tag: string, className: string, text?: string): HTMLElement {
  const el = document.createElement(tag);
  el.className = className;
  if (text) el.textContent = text;
  return el;
}
