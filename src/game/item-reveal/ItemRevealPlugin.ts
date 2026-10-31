import {
  NarratPlugin,
  getImageUrl,
  getItemConfig,
  useInventory,
  useNotifications,
} from "narrat";
import type { ItemRevealQueue } from "./ItemRevealQueue";
import type { RevealedItem } from "./ItemRevealView";

interface AddItemArgs {
  id: string;
  amount: number;
}

/**
 * Adapter between narrat's inventory and the reveal queue: every add_item
 * (from scripts or from code) shows the item card instead of narrat's
 * small "Received item" text notification. Writers don't need any new command.
 */
export class ItemRevealPlugin extends NarratPlugin<unknown> {
  pluginId = "item-reveal";
  private unsubscribe?: () => void;

  constructor(private readonly queue: ItemRevealQueue) {
    super();
  }

  onGameMounted(): void {
    const inventory = useInventory();
    const notifications = useNotifications();

    this.unsubscribe = inventory.$onAction(
      ({ name, args, after, onError }) => {
        if (name !== "add") return;

        // narrat notifies synchronously inside add(): mute just that call
        const wasEnabled = notifications.enabled;
        notifications.enabled = false;
        const restore = () => (notifications.enabled = wasEnabled);
        onError(restore);
        after(() => {
          restore();
          this.queue.enqueue(toRevealedItem(args[0] as AddItemArgs));
        });
      },
      true, // keep listening even outside a component scope
    );
  }

  onGameUnmounted(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.queue.clear();
  }
}

function toRevealedItem({ id, amount }: AddItemArgs): RevealedItem {
  const config = getItemConfig(id);
  return {
    id,
    amount,
    name: config.name,
    description: config.description,
    iconUrl: getImageUrl(config.icon),
  };
}
