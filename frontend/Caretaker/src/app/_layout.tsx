import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { getAccessToken, getRefreshToken, getUserId, saveTokens, clearTokens } from "../utils/tokenStore";
import { setCaretakerLogoutHandler, setCaretakerLoginHandler } from "../utils/logoutSignal";
import { BASE_URL } from "../api/caretakerApi";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    (async () => {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();
      const userId = await getUserId();

      if (accessToken && refreshToken && userId) {
        setIsLoggedIn(true);
        return;
      }

      if (!accessToken && refreshToken && userId) {
        try {
          const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, refreshToken }),
          });
          if (res.ok) {
            const data = await res.json();
            await saveTokens(data.accessToken, data.refreshToken, data.userid);
            setIsLoggedIn(true);
            return;
          }
        } catch {}
        await clearTokens();
      }

      setIsLoggedIn(false);
    })();
  }, []);

  useEffect(() => {
    setCaretakerLogoutHandler(async () => {
      await clearTokens();
      setIsLoggedIn(false);
    });
    setCaretakerLoginHandler(() => {
      setIsLoggedIn(true);
    });
    return () => {
      setCaretakerLogoutHandler(() => {});
      setCaretakerLoginHandler(() => {});
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn === null) return;
    const firstSeg = segments[0] as string | undefined;
    const onAuthScreen = !firstSeg || firstSeg === "index" || firstSeg === "auth";
    if (!isLoggedIn && !onAuthScreen) {
      router.replace("/");
    } else if (isLoggedIn && onAuthScreen) {
      router.replace("/dashboard" as never);
    }
  }, [isLoggedIn, segments]);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" }}>
        <ActivityIndicator size="large" color="#002147" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthGuard>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Caretaker Login", headerShown: false }} />
        <Stack.Screen name="auth" options={{ title: "Caretaker Login", headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ title: "Caretaker", headerShown: false }} />
        <Stack.Screen name="approvals" options={{ title: "Approvals", headerShown: false }} />
        <Stack.Screen name="currently-out" options={{ title: "Currently Out", headerShown: false }} />
        <Stack.Screen name="students" options={{ title: "Students", headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile", headerShown: false }} />
      </Stack>
    </AuthGuard>
  );
}

