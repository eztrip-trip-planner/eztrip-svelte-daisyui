/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export type BrandColor = "primary" | "secondary" | "accent";

export type FunctionalColor = "info" | "success" | "warning" | "error";

export type AdditionalColor = "ghost" | "link";

export type Size = "tiny" | "small" | "medium" | "large";

export type Shape = "square" | "circle";

export interface ButtonProps {
  /**
   * @default null
   */
  color?: import("@eztrip/types").Nullable<
    BrandColor | FunctionalColor | AdditionalColor
  >;

  /**
   * @default null
   */
  size?: import("@eztrip/types").Nullable<Size>;

  /**
   * @default null
   */
  shape?: import("@eztrip/types").Nullable<Shape>;

  /**
   * @default false
   */
  active?: boolean;

  /**
   * @default false
   */
  block?: boolean;

  /**
   * @default false
   */
  outline?: boolean;

  /**
   * @default false
   */
  loading?: boolean;

  /**
   * @default false
   */
  disabled?: boolean;

  /**
   * @default false
   */
  noAnim?: boolean;

  /**
   * @default null
   */
  class?: import("../utils").Nullable<string>;
}

export default class Button extends SvelteComponentTyped<
  ButtonProps,
  { click: WindowEventMap["click"] },
  { default: {} }
> {}
