import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import clsx from "clsx";
import { GripVerticalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";
import type { Task } from "../types";
import { DropIndicator } from "./DropIndicator";

type ItemState =
  | {
      type: "idle";
    }
  | {
      type: "preview";
      container: HTMLElement;
    }
  | {
      type: "is-dragging";
    }
  | {
      type: "is-dragging-over";
      closestEdge: Edge | null;
    };

const stateStyles: { [Key in ItemState["type"]]?: string } = {
  "is-dragging": "opacity-40",
};

export function TaskItem({ task }: { task: Task }) {
  const ref = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<ItemState>({ type: "idle" });

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(
      draggable({
        element,
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
            render: ({ container }) => {
              setState({ type: "preview", container });
            },
          });
        },
        onDragStart: () => setState({ type: "is-dragging" }),
        onDrop: () => setState({ type: "idle" }),
      }),
      dropTargetForElements({
        element,
        getData: ({ input }) => {
          const data = {};

          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky: () => true,
        onDragStart: ({ self }) => {
          const closestEdge = extractClosestEdge(self.data);

          setState({ type: "is-dragging-over", closestEdge });
        },
        onDrag: ({ self }) => {
          const closestEdge = extractClosestEdge(self.data);

          setState((state) => {
            if (
              state.type === "is-dragging-over" &&
              state.closestEdge === closestEdge
            ) {
              return state;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },
        onDragLeave: () => setState({ type: "idle" }),
        onDrop: () => setState({ type: "idle" }),
      }),
    );
  }, []);

  return (
    <>
      <div className="relative">
        <div
          ref={ref}
          className={clsx(
            "flex items-center rounded border p-2 pl-0 hover:cursor-grab hover:bg-gray-100",
            stateStyles[state.type],
          )}
        >
          <div className="flex w-6 justify-center">
            <GripVerticalIcon size={10} />
          </div>
          <span>Item: ({task.id})</span>
        </div>
        {state.type === "is-dragging-over" && state.closestEdge ? (
          <DropIndicator edge={state.closestEdge} gap={8} />
        ) : null}
      </div>
      {state.type === "preview"
        ? createPortal(<DragPreview task={task} />, state.container)
        : null}
    </>
  );
}

function DragPreview({ task }: { task: Task }) {
  return (
    <div className="w-full rounded border bg-white p-2">Item: ({task.id})</div>
  );
}
