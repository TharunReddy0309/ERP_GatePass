import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface GatepassSymbolProps {
  name: string;
  size?: number;
  color?: string;
  fallback?: string;
  weight?: string;
  style?: StyleProp<ViewStyle>;
  androidIcon?: string;
}

function getIcon(name: string, size: number, color: string) {
  switch (name) {
    case "building.columns":
      return <Ionicons name="business" size={size} color={color} />;
    case "ticket":
      return <Ionicons name="ticket" size={size} color={color} />;
    case "plus.circle":
    case "plus.circle.fill":
      return <Ionicons name="add-circle" size={size} color={color} />;
    case "person":
    case "person.fill":
      return <Ionicons name="person" size={size} color={color} />;
    case "person.text.rectangle":
      return <MaterialCommunityIcons name="card-account-details-outline" size={size} color={color} />;
    case "lock.fill":
    case "lock":
      return <Ionicons name="lock-closed" size={size} color={color} />;
    case "seal.fill":
    case "seal":
      return <Ionicons name="shield-checkmark" size={size} color={color} />;
    case "clock":
    case "clock.fill":
      return <Ionicons name="time-outline" size={size} color={color} />;
    case "square.and.arrow.down":
      return <Ionicons name="download-outline" size={size} color={color} />;
    case "square.and.arrow.up":
      return <Ionicons name="share-outline" size={size} color={color} />;
    case "magnifyingglass":
      return <Ionicons name="search" size={size} color={color} />;
    case "doc.text.magnifyingglass":
      return <MaterialCommunityIcons name="file-search-outline" size={size} color={color} />;
    case "qrcode":
    case "qrcode.viewfinder":
      return <Ionicons name="qr-code" size={size} color={color} />;
    case "xmark":
    case "xmark.circle":
    case "xmark.circle.fill":
      return <Ionicons name="close-circle" size={size} color={color} />;
    case "checkmark":
    case "checkmark.circle":
    case "checkmark.circle.fill":
      return <Ionicons name="checkmark-circle" size={size} color={color} />;
    case "arrow.clockwise":
      return <Ionicons name="refresh" size={size} color={color} />;
    case "exclamationmark.triangle":
      return <Ionicons name="warning" size={size} color={color} />;
    case "calendar":
      return <Ionicons name="calendar-outline" size={size} color={color} />;
    default:
      return <Ionicons name="help-circle-outline" size={size} color={color} />;
  }
}

export default function GatepassSymbol({
  name,
  size = 20,
  color = "#000A1E",
  style,
  androidIcon,
}: GatepassSymbolProps) {
  if (androidIcon) {
    return (
      <View style={style}>
        <Ionicons name={androidIcon as any} size={size} color={color} />
      </View>
    );
  }

  return <View style={style}>{getIcon(name, size, color)}</View>;
}
