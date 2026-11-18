import { ActivityIndicator, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";

import GatepassSymbol from "../../components/GatepassSymbol/GatepassSymbol";
import { SecurityLogo } from "../../components/SecurityLayout/SecurityLayout";
import failedCampus from "../../assets/images/security/failed-campus.png";
import failedLogo from "../../assets/images/security/failed-logo.png";
import successCampus from "../../assets/images/security/success-campus.png";
import successLogo from "../../assets/images/security/success-logo.png";
import { ScanMode } from "../../utils/securityGatepass";
import { api, buildSecuritySig } from "../../api/config";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

type Phase = "result" | "camera" | "preview" | "submitting";

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ScanResultScreen() {
  const { mode, qr } = useLocalSearchParams<{ mode?: string; qr?: string }>();
  const scanMode: ScanMode = mode === "out" ? "out" : "in";
  const insets = useSafeAreaInsets();
  const verificationLabel = scanMode === "out" ? "Check-out" : "Check-in";
  const { width } = useWindowDimensions();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<{
    name: string;
    rollNumber: string;
    passType: string;
    room: string;
    photoUrl: string | null;
  } | null>(null);

  const [phase, setPhase] = useState<Phase>("result");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [proxyError, setProxyError] = useState<string | null>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!qr) {
      setErrorMsg("No QR ID scanned.");
      setLoading(false);
      return;
    }

    const endpoint = `/Passes/Scan/${scanMode}/${qr}`;
    const sig = buildSecuritySig(qr);

    api.get(endpoint, { headers: { "x-security-sig": sig } })
      .then((res: any) => {
        const student = res.data?.student;
        const pass = res.data?.pass;
        if (!student || !pass) {
          throw new Error("Invalid response payload from server.");
        }
        setStudentInfo({
          name: student.Name || "—",
          rollNumber: student.Roll_No || "—",
          passType: pass.passType === "HOME_PASS" || pass.passtype === "HOME_PASS" ? "Home Pass" : "Day Pass",
          room: student.Block_Id || "—",
          photoUrl: student.Photo_Url ?? null,
        });
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || "An unknown error occurred.";
        setErrorMsg(Array.isArray(msg) ? msg.join(", ") : String(msg));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [qr, scanMode]);

  const handleConfirm = async () => {
    if (!qr) return;
    try {
      setLoading(true);
      const endpoint = scanMode === "in" ? `/Passes/Checkin/${qr}` : `/Passes/Checkout/${qr}`;
      const sig = buildSecuritySig(qr);
      await api.put(endpoint, {}, { headers: { "x-security-sig": sig } });
      router.replace("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "An unknown error occurred.";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : String(msg));
      setLoading(false);
    }
  };

  const handleFlagProxy = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) return;
    }
    setPhase("camera");
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) {
      setCapturedUri(photo.uri);
      setPhase("preview");
    }
  };

  const handleSubmitProxy = async () => {
    if (!qr || !capturedUri) return;
    setPhase("submitting");
    setProxyError(null);
    try {
      const sig = buildSecuritySig(qr);
      const formData = new FormData();
      formData.append("qr", qr);
      const filename = capturedUri.split("/").pop() ?? "photo.jpg";
      const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";
      formData.append("photo", { uri: capturedUri, name: filename, type: mimeType } as any);
      await fetch(`${BASE_URL}/Passes/RejectProxy`, {
        method: "POST",
        headers: { "x-security-sig": sig },
        body: formData,
      });
      router.replace("/");
    } catch (err: any) {
      setProxyError(err?.message ?? "Failed to submit. Please try again.");
      setPhase("preview");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000A1E" }}>
        <ActivityIndicator size="large" color="#FFE38A" />
        <Text style={{ color: "#FFFFFF", marginTop: 16, fontWeight: "700" }}>Verifying Gatepass...</Text>
      </View>
    );
  }

  if (errorMsg || !studentInfo) {
    return (
      <View style={styles.failedScreen}>
        <StatusBar barStyle="light-content" />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.failedScroll}>
          <View style={[styles.failedHero, { paddingTop: Math.max(insets.top, 12) }]}>
            <Image source={failedCampus} contentFit="cover" style={StyleSheet.absoluteFillObject} />
            <View style={styles.failedHeroShade} />
            <View style={styles.failedHeader}>
              <View style={styles.brand}>
                <SecurityLogo source={failedLogo} size={44} />
                <Text style={styles.headerTitle}>IIIT Sri City Security</Text>
              </View>
              <GatepassSymbol name="person.circle" size={30} color="#FFFFFF" weight="regular" />
            </View>
          </View>

          <View style={styles.failedCard}>
            <View style={styles.failureMark}>
              <GatepassSymbol name="xmark" size={38} color="#FFFFFF" weight="bold" />
            </View>
            <Text style={styles.failedTitle}>Invalid / Blocked</Text>
            <Text style={styles.failedCopy}>
              {errorMsg || "The student cannot leave or enter using this gatepass. Please check their block status."}
            </Text>

            <View style={styles.failedDetails}>
              <DetailItem label="QR CODE / ID" value={qr || "—"} />
              <DetailItem label="ERROR DETAIL" value={errorMsg || "Verification Failed"} />
            </View>

            <Pressable style={styles.retryButton} onPress={() => router.replace({ pathname: "/scanner", params: { mode: scanMode } } as never)}>
              <GatepassSymbol name="arrow.clockwise" size={20} color="#FFFFFF" weight="semibold" />
              <Text style={styles.retryButtonText}>Retry Scan</Text>
            </Pressable>
            <Pressable style={styles.dashboardLink} onPress={() => router.replace("/")}>
              <Text style={styles.dashboardLinkText}>Return to Dashboard</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  const photoCardWidth = width - 40;

  return (
    <View style={styles.successScreen}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.successHero, { paddingTop: Math.max(insets.top, 12) }]}>
          <Image source={successCampus} contentFit="cover" style={StyleSheet.absoluteFillObject} />
          <View style={styles.successHeroShade} />
          <View style={styles.successHeader}>
            <View style={styles.brand}>
              <SecurityLogo source={successLogo} size={44} />
              <Text style={styles.headerTitle}>IIIT Sri City Security</Text>
            </View>
            <GatepassSymbol name="person.circle" size={30} color="#FFFFFF" weight="regular" />
          </View>
        </View>

        <View style={styles.successBody}>
          <View style={styles.successCard}>
            <View style={[styles.photoContainer, { width: photoCardWidth, aspectRatio: 3 / 4 }]}>
              {studentInfo.photoUrl ? (
                <Image
                  source={{ uri: studentInfo.photoUrl }}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="contain"
                />
              ) : (
                <View style={styles.photoFallback}>
                  <GatepassSymbol name="person.fill" size={72} color="#FFE38A" weight="regular" />
                </View>
              )}
            </View>

            <Text style={styles.studentName}>{studentInfo.name}</Text>
            <Text style={styles.studentRoll}>{studentInfo.rollNumber}</Text>

            <View style={styles.verifyBanner}>
              <GatepassSymbol name="checkmark.shield.fill" size={16} color="#087A54" weight="regular" />
              <Text style={styles.verifyBannerText}>Identity Verified — {verificationLabel}</Text>
            </View>

            <View style={styles.successDetails}>
              <DetailItem label="BLOCK / HOSTEL" value={studentInfo.room} />
              <DetailItem label="PASS TYPE" value={studentInfo.passType} />
            </View>
          </View>

          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <GatepassSymbol name="checkmark" size={21} color="#FFFFFF" weight="bold" />
            <Text style={styles.confirmButtonText}>Confirm {scanMode === "out" ? "Exit" : "Entry"}</Text>
          </Pressable>

          <Pressable style={styles.flagButton} onPress={handleFlagProxy}>
            <GatepassSymbol name="camera.fill" size={19} color="#FFFFFF" weight="bold" />
            <Text style={styles.flagButtonText}>Flag Proxy / Miscan</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={phase === "camera" || phase === "preview" || phase === "submitting"} animationType="slide" statusBarTranslucent>
        <View style={styles.cameraModal}>
          {(phase === "camera") && (
            <>
              <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing="back" />
              <View style={[styles.cameraTopBar, { paddingTop: insets.top + 8 }]}>
                <Pressable onPress={() => setPhase("result")} style={styles.cameraClose}>
                  <GatepassSymbol name="xmark" size={22} color="#FFFFFF" weight="bold" />
                </Pressable>
                <Text style={styles.cameraLabel}>Point camera at person</Text>
              </View>
              <View style={styles.cameraBottom}>
                <Pressable style={styles.captureButton} onPress={handleCapture} />
              </View>
            </>
          )}

          {(phase === "preview" || phase === "submitting") && capturedUri && (
            <>
              <Image source={{ uri: capturedUri }} style={StyleSheet.absoluteFillObject} contentFit="contain" />
              <View style={[styles.previewTopBar, { paddingTop: insets.top + 8 }]}>
                <Text style={styles.previewTitle}>Confirm Proof Photo</Text>
              </View>
              {proxyError ? (
                <View style={styles.proxyErrorBanner}>
                  <Text style={styles.proxyErrorText}>{proxyError}</Text>
                </View>
              ) : null}
              {phase === "submitting" ? (
                <View style={styles.previewBottom}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={styles.submittingText}>Blocking student...</Text>
                </View>
              ) : (
                <View style={styles.previewBottom}>
                  <Pressable style={styles.retakeButton} onPress={() => { setCapturedUri(null); setPhase("camera"); }}>
                    <Text style={styles.retakeText}>Retake</Text>
                  </Pressable>
                  <Pressable style={styles.submitButton} onPress={handleSubmitProxy}>
                    <GatepassSymbol name="exclamationmark.shield.fill" size={18} color="#FFFFFF" weight="bold" />
                    <Text style={styles.submitText}>Submit & Block</Text>
                  </Pressable>
                </View>
              )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  successScreen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  successHero: {
    height: 202,
    overflow: "hidden",
    backgroundColor: "#000A1E",
  },
  successHeroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 10, 30, 0.56)",
  },
  successHeader: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  brand: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingRight: 12,
  },
  headerTitle: {
    flexShrink: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
  },
  successBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Math.max(26, 80),
    gap: 12,
  },
  successCard: {
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    paddingBottom: 20,
    shadowColor: "#00122F",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  photoContainer: {
    backgroundColor: "#0D1B2A",
    overflow: "hidden",
    borderRadius: 0,
    alignSelf: "stretch",
  },
  photoFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D1B2A",
  },
  studentName: {
    color: "#000A1E",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  studentRoll: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 3,
    textAlign: "center",
  },
  verifyBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EDFAF4",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 12,
    marginBottom: 4,
  },
  verifyBannerText: {
    color: "#087A54",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
  },
  successDetails: {
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#E6EAF0",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  detailItem: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E6EAF0",
    gap: 14,
  },
  detailLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
  },
  detailValue: {
    flexShrink: 1,
    color: "#000A1E",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
    textAlign: "right",
  },
  confirmButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 6,
    backgroundColor: "#000A1E",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  flagButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 6,
    backgroundColor: "#C62828",
  },
  flagButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0,
  },
  failedScreen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  failedScroll: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  failedHero: {
    height: 260,
    overflow: "hidden",
    backgroundColor: "#000A1E",
  },
  failedHeroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 10, 30, 0.56)",
  },
  failedHeader: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  failedCard: {
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    marginHorizontal: 20,
    marginTop: -98,
    shadowColor: "#00122F",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  failureMark: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    backgroundColor: "#C62828",
  },
  failedTitle: {
    color: "#000A1E",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 14,
  },
  failedCopy: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
  },
  failedDetails: {
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#E6EAF0",
    marginTop: 20,
  },
  retryButton: {
    alignSelf: "stretch",
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 6,
    backgroundColor: "#000A1E",
    marginTop: 22,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0,
  },
  dashboardLink: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  dashboardLinkText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  cameraModal: {
    flex: 1,
    backgroundColor: "#000000",
  },
  cameraTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 14,
  },
  cameraClose: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cameraLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cameraBottom: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  previewTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  previewTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  proxyErrorBanner: {
    position: "absolute",
    top: 90,
    left: 20,
    right: 20,
    backgroundColor: "rgba(198,40,40,0.9)",
    borderRadius: 8,
    padding: 12,
  },
  proxyErrorText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  previewBottom: {
    position: "absolute",
    bottom: 48,
    left: 20,
    right: 20,
    flexDirection: "row",
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  retakeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  submitButton: {
    flex: 2,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 6,
    backgroundColor: "#C62828",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  submittingText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
  },
});
