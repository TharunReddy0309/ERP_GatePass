import React from "react";
import { Platform, StyleProp, Text, View, ViewStyle } from "react-native";
import { SymbolView } from "expo-symbols";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./GatepassSymbol.styles";

type SymbolName = React.ComponentProps<typeof SymbolView>["name"];
type SymbolWeight = React.ComponentProps<typeof SymbolView>["weight"];

interface GatepassSymbolProps {
  name: SymbolName;
  size?: number;
  color?: string;
  fallback?: string;
  weight?: SymbolWeight;
  style?: StyleProp<ViewStyle>;
}

function renderAndroidIcon(name: string, size: number, color: string) {
  switch (name) {
    case "square.grid.2x2.fill":
      return <Ionicons name="grid" size={size} color={color} />;
    case "arrow.right.square":
      return <MaterialCommunityIcons name="arrow-right-box" size={size} color={color} />;
    case "rectangle.portrait.and.arrow.right":
      return <MaterialCommunityIcons name="exit-to-app" size={size} color={color} />;
    case "person.circle":
      return <Ionicons name="person-circle" size={size} color={color} />;
    case "person":
    case "person.fill":
      return <Ionicons name="person" size={size} color={color} />;
    case "calendar":
      return <Ionicons name="calendar-outline" size={size} color={color} />;
    case "house":
      return <Ionicons name="home-outline" size={size} color={color} />;
    case "arrow.up.right":
      return <Ionicons name="arrow-up" size={size} color={color} />;
    case "bolt":
    case "bolt.fill":
      return <Ionicons name="flash" size={size} color={color} />;
    case "keyboard":
      return <Ionicons name="keypad" size={size} color={color} />;
    case "qrcode.viewfinder":
      return <Ionicons name="qr-code" size={size} color={color} />;
    case "checkmark":
    case "checkmark.circle":
    case "checkmark.circle.fill":
      return <Ionicons name="checkmark-circle" size={size} color={color} />;
    case "checkmark.shield":
    case "checkmark.shield.fill":
      return <Ionicons name="shield-checkmark" size={size} color={color} />;
    case "xmark":
    case "xmark.circle":
    case "xmark.circle.fill":
      return <Ionicons name="close-circle" size={size} color={color} />;
    case "arrow.clockwise":
      return <Ionicons name="refresh" size={size} color={color} />;
    case "exclamationmark.triangle":
    case "exclamationmark.triangle.fill":
      return <Ionicons name="warning" size={size} color={color} />;
    case "clock.arrow.circlepath":
      return <Ionicons name="time" size={size} color={color} />;
    case "eye":
      return <Ionicons name="eye" size={size} color={color} />;
    case "plus.circle":
      return <Ionicons name="add-circle" size={size} color={color} />;
    case "info.circle":
      return <Ionicons name="information-circle" size={size} color={color} />;
    case "envelope":
      return <Ionicons name="mail" size={size} color={color} />;
    case "phone":
      return <Ionicons name="call" size={size} color={color} />;
    case "building.2":
    case "building.columns":
      return <Ionicons name="business" size={size} color={color} />;
    case "door.left.hand.open":
      return <MaterialCommunityIcons name="door-open" size={size} color={color} />;
    case "headphones":
      return <Ionicons name="headset" size={size} color={color} />;
    case "doc.badge.clock":
      return <Ionicons name="document-text" size={size} color={color} />;
    default:
      return null;
  }
}

export default function GatepassSymbol({
  name,
  size = 20,
  color = "#000A1E",
  fallback = "",
  weight = "semibold",
  style,
}: GatepassSymbolProps) {
  if (Platform.OS === "android") {
    const androidIcon = renderAndroidIcon(String(name), size, color);
    if (androidIcon) {
      return <View style={style}>{androidIcon}</View>;
    }
  }

  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight={weight}
      resizeMode="scaleAspectFit"
      style={[styles.symbol, { width: size, height: size }, style]}
      fallback={
        <Text
          style={[
            styles.fallback,
            { color, fontSize: Math.max(11, size * 0.65), lineHeight: size },
          ]}
        >
          {fallback}
        </Text>
      }
    />
  );
}


