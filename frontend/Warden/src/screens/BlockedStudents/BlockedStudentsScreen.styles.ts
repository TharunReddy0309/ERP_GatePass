import { StyleSheet } from "react-native";

import { COLORS, SPACING } from "../../utils/constants";

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 24,
    gap: 24,
  },
  list: {
    gap: 24,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(196, 198, 207, 0.5)",
    backgroundColor: COLORS.surface,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardHeader: {
    minHeight: 69,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    color: COLORS.textStrong,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  reasonBand: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(242, 244, 246, 0.3)",
    flexDirection: "row",
  },
  badgeLateArrival: {
    backgroundColor: "#FFF3CD",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeMiscan: {
    backgroundColor: "#FFDAD6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textStrong,
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  proofThumbContainer: {
    alignSelf: "flex-start",
    borderRadius: 6,
    overflow: "hidden",
  },
  proofThumb: {
    width: 60,
    height: 80,
    borderRadius: 6,
  },
  unblockButton: {
    minHeight: 36,
    borderRadius: 4,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  unblockText: {
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  emptyState: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: "90%",
    height: "70%",
    borderRadius: 10,
  },
  modalCloseButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  modalCloseText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
