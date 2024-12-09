import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types";
import clsx from "clsx";
import type { CSSProperties } from "react";

const strokeSize = 2;
const terminalSize = 8;
const offsetToAlignTerminalWithLine = (strokeSize - terminalSize) / 2;

type Orientation = "horizontal" | "vertical";
const edgeToOrientationMap: Record<Edge, Orientation> = {
  top: "horizontal",
  bottom: "horizontal",
  left: "vertical",
  right: "vertical",
};

const orientationStyles: Record<Orientation, string> = {
  horizontal:
    "h-[--line-thickness] left-[--terminal-radius] right-0 before:left-[--negative-terminal-size]",
  vertical:
    "w-[--line-thickness] top-[--terminal-radius] bottom-0 before:top-[--negative-terminal-size]",
};

const edgeStyles: Record<Edge, string> = {
  top: "top-[--line-offset] before:top-[--offset-terminal]",
  right: "right-[--line-offset] before:right-[--offset-terminal]",
  bottom: "bottom-[--line-offset] before:bottom-[--offset-terminal]",
  left: "left-[--line-offset] before:left-[--offset-terminal]",
};

export function DropIndicator({ edge, gap }: { edge: Edge; gap: number }) {
  const lineOffset = `calc(-0.5 * (${gap}px + ${strokeSize}px))`;
  const orientation = edgeToOrientationMap[edge];

  return (
    <div
      style={
        {
          "--line-thickness": `${strokeSize}px`,
          "--line-offset": `${lineOffset}`,
          "--terminal-size": `${terminalSize}px`,
          "--terminal-radius": `${terminalSize / 2}px`,
          "--negative-terminal-size": `-${terminalSize}px`,
          "--offset-terminal": `${offsetToAlignTerminalWithLine}px`,
        } as CSSProperties
      }
      className={clsx(
        "pointer-events-none absolute z-10 box-border bg-blue-600 before:absolute before:h-[--terminal-size] before:w-[--terminal-size] before:rounded-full before:border-[length:--line-thickness] before:border-solid before:border-blue-600 before:content-['']",
        orientationStyles[orientation],
        edgeStyles[edge],
      )}
    />
  );
}
