import type { ItemRevealView, RevealedItem } from "./ItemRevealView";

export interface DomItemRevealOptions {
  /** Heading above the item name. */
  readonly label: string;
  /** How long the card stays if the player doesn't click it. */
  readonly durationMs: number;
}

/** Must match the leave animation in main.css (.item-reveal--leaving). */
const LEAVE_ANIMATION_MS = 250;

/**
 * Plain DOM card mounted inside #narrat (so it inherits the theme tokens).
 * Styling lives in main.css under "Item reveal".
 */
export class DomItemRevealView implements ItemRevealView {
  private current?: { card: HTMLElement; close: () => void };

  constructor(private readonly options: DomItemRevealOptions) {}

  show(item: RevealedItem): Promise<void> {
    const host = document.querySelector("#narrat");
    if (!host) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const card = this.buildCard(item);
      let timer: ReturnType<typeof setTimeout> | undefined;

      const close = () => {
        if (this.current?.card !== card) return;
        this.current = undefined;
        clearTimeout(timer);
        card.classList.add("item-reveal--leaving");
        setTimeout(() => {
          card.remove();
          resolve();
        }, LEAVE_ANIMATION_MS);
      };

      // Clicking the card closes it without advancing the dialogue underneath
      card.addEventListener("click", (event) => {
        event.stopPropagation();
        close();
      });

      this.current = { card, close };
      host.appendChild(card);
      timer = setTimeout(close, this.options.durationMs);
    });
  }

  dismiss(): void {
    this.current?.close();
  }

  private buildCard(item: RevealedItem): HTMLElement {
    const card = element("div", "item-reveal");
    card.setAttribute("role", "status");
    card.setAttribute("aria-live", "polite");

    const icon = element("img", "item-reveal__icon") as HTMLImageElement;
    icon.src = item.iconUrl;
    icon.alt = "";

    const name = element("div", "item-reveal__name", item.name);
    if (item.amount > 1) {
      name.appendChild(
        element("span", "item-reveal__amount", `× ${item.amount}`),
      );
    }

    card.append(
      element("div", "item-reveal__label", this.options.label),
      element("div", "item-reveal__frame", icon),
      name,
    );
    if (item.description) {
      card.appendChild(
        element("p", "item-reveal__description", item.description),
      );
    }
    return card;
  }
}

function element(
  tag: string,
  className: string,
  content?: string | Node,
): HTMLElement {
  const el = document.createElement(tag);
  el.className = className;
  if (typeof content === "string") el.textContent = content;
  else if (content) el.appendChild(content);
  return el;
}
