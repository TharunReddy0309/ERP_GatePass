import React from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomNav, { type BottomNavKey } from "../BottomNav/BottomNav";
import { styles } from "./AppShell.styles";
import { SPACING } from "../../utils/constants";

interface AppShellProps {
  activeTab: BottomNavKey;
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function AppShell({
  activeTab,
  children,
  contentContainerStyle,
}: AppShellProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = SPACING.navHeight + Math.max(insets.bottom, 8) + 16;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: bottomPad }, contentContainerStyle]}
      >
        {children}
      </ScrollView>
      <BottomNav activeTab={activeTab} />
    </View>
  );
}
