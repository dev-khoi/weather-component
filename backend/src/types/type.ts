import { JwtPayload } from "jsonwebtoken";

type ResizeHandle = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";

export interface Layout {
  /**
   * A string corresponding to the component key.
   * Uses the index of components instead if not provided.
   */
  i: string;

  /**
   * X position in grid units.
   */
  x: number;

  /**
   * Y position in grid units.
   */
  y: number;

  /**
   * Width in grid units.
   */
  w: number;

  /**
   * Height in grid units.
   */
  h: number;

  /**
   * Minimum width in grid units.
   */
  minW?: number | undefined;

  /**
   * Maximum width in grid units.
   */
  maxW?: number | undefined;

  /**
   * Minimum height in grid units.
   */
  minH?: number | undefined;

  /**
   * Maximum height in grid units.
   */
  maxH?: number | undefined;

  /**
   * set by DragEvents (onDragStart, onDrag, onDragStop) and ResizeEvents (onResizeStart, onResize, onResizeStop)
   */
  moved?: boolean | undefined;

  /**
   * If true, equal to `isDraggable: false` and `isResizable: false`.
   */
  static?: boolean | undefined;

  /**
   * If false, will not be draggable. Overrides `static`.
   */
  isDraggable?: boolean | undefined;

  /**
   * If false, will not be resizable. Overrides `static`.
   */
  isResizable?: boolean | undefined;

  /**
   * By default, a handle is only shown on the bottom-right (southeast) corner.
   * Note that resizing from the top or left is generally not intuitive.
   */
  resizeHandles?: ResizeHandle[] | undefined;

  /**
   * If true and draggable, item will be moved only within grid.
   */
  isBounded?: boolean | undefined;

  active?: boolean | undefined;
}

export interface MyJwtPayload extends JwtPayload {
  userId?: string | number;
}

export interface CustomError extends Error {
  status?: number;
  msg?: string;
}
