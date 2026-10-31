import { NarratPlugin, useDialogStore } from "narrat";

/**
 * Comic-panel style dialogue: the box only shows the current line instead of
 * piling up every previous one. It does the same as calling clear_dialog before
 * each line, so the player can still read past lines with the History button.
 */
export class SingleLineDialogPlugin extends NarratPlugin<unknown> {
  pluginId = "single-line-dialog";
  private unsubscribe?: () => void;

  onGameMounted(): void {
    const dialog = useDialogStore();
    this.unsubscribe = dialog.$onAction(
      ({ name }) => {
        // Runs before the line is pushed, so only the new line stays visible
        if (name === "addDialog") dialog.clearDialog();
      },
      true, // keep listening even outside a component scope
    );
  }

  onGameUnmounted(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }
}
