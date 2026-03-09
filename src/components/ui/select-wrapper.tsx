"use client";

// Wrapper around shadcn's base-ui Select to normalize onValueChange signature
// base-ui passes (value: string | null, event) but we want (value: string)
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import React from "react";

interface SelectProps {
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  [key: string]: unknown;
}

function Select({ onValueChange, ...props }: SelectProps) {
  const handleChange = (value: string | null) => {
    if (value !== null && onValueChange) {
      onValueChange(value);
    }
  };

  return <BaseSelect onValueChange={handleChange as (value: unknown) => void} {...props} />;
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
};
