"use client";

import React from "react";
import { HTMLMotionProps } from "framer-motion";
import { EclairButton, EclairButtonProps } from "./style/EclairButton";
import { TiramisuButton, TiramisuButtonProps } from "./style/TiramisuButton";
import { IceCreamSandwichButton, IceCreamSandwichButtonProps } from "./style/IceCreamSandwichButton";

type BaseButtonProps = {
  /** The style variant of the cake button */
  variant?: "eclair" | "tiramisu" | "macaron" | "ice-cream-sandwich";
};

// We use conditional typing to enforce the correct props based on the variant
export type ButtonProps =
  | (BaseButtonProps & { variant?: "eclair" } & EclairButtonProps)
  | (BaseButtonProps & { variant: "tiramisu" } & TiramisuButtonProps)
  | (BaseButtonProps & { variant: "ice-cream-sandwich" } & IceCreamSandwichButtonProps);

export function Button(props: ButtonProps) {
  const { variant = "eclair", ...rest } = props;

  if (variant === "tiramisu") {
    return <TiramisuButton {...(rest as TiramisuButtonProps)} />;
  }

  if (variant === "ice-cream-sandwich") {
    return <IceCreamSandwichButton {...(rest as IceCreamSandwichButtonProps)} />;
  }

  return <EclairButton {...(rest as EclairButtonProps)} />;
}
