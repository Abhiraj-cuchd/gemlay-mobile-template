import { View, Pressable, ViewProps } from "react-native";
import { ReactNode } from "react";

interface CardProps extends ViewProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

export const Card = ({
  children,
  onPress,
  variant = "default",
  padding = "md",
  className = "",
  ...props
}: CardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "default":
        return "bg-white";
      case "elevated":
        return "bg-white shadow-lg";
      case "outlined":
        return "bg-white border border-gray-200";
      default:
        return "bg-white";
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case "none":
        return "";
      case "sm":
        return "p-2";
      case "md":
        return "p-4";
      case "lg":
        return "p-6";
      default:
        return "p-4";
    }
  };

  const baseClasses = `
    rounded-xl
    ${getVariantClasses()}
    ${getPaddingClasses()}
    ${className}
  `;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${baseClasses} active:opacity-80`}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseClasses} {...props}>
      {children}
    </View>
  );
};
