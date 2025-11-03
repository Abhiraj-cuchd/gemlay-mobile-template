import { Pressable, Text, ActivityIndicator } from "react-native";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button = ({
  children,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
}: ButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary active:bg-primary-dark";
      case "secondary":
        return "bg-secondary active:bg-secondary-dark";
      case "outline":
        return "bg-transparent border-2 border-primary active:bg-primary/10";
      case "ghost":
        return "bg-transparent active:bg-gray-100";
      default:
        return "bg-primary";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-2 px-4";
      case "md":
        return "py-3 px-6";
      case "lg":
        return "py-4 px-8";
      default:
        return "py-3 px-6";
    }
  };

  const getTextVariantClasses = () => {
    switch (variant) {
      case "primary":
      case "secondary":
        return "text-white";
      case "outline":
        return "text-primary";
      case "ghost":
        return "text-text-primary";
      default:
        return "text-white";
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-base";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        rounded-lg items-center justify-center flex-row
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? "w-full" : ""}
        ${isDisabled ? "opacity-50" : ""}
        ${className}
      `}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? "#D4AF37" : "#FFFFFF"}
          className="mr-2"
        />
      )}
      <Text
        className={`
          font-semibold
          ${getTextVariantClasses()}
          ${getTextSizeClasses()}
        `}
      >
        {children}
      </Text>
    </Pressable>
  );
};
