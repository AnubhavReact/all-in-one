"use client";

import { MessageCircle } from "lucide-react";
import { askAvtar } from "@/components/shell/events";
import { Button, type ButtonVariant } from "./Button";

/** Opens AVTAR, optionally with a first question. */
export function AskAvtarButton({
  question = "",
  label = "Ask AVTAR",
  variant = "secondary",
  size = "md",
}: {
  question?: string;
  label?: string;
  variant?: ButtonVariant;
  size?: "md" | "lg";
}) {
  return (
    <Button variant={variant} size={size} icon={MessageCircle} onClick={() => askAvtar(question)}>
      {label}
    </Button>
  );
}
