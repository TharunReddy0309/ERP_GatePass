import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Warden Login", headerShown: false }}
      />
      <Stack.Screen
        name="auth"
        options={{ title: "Warden Login", headerShown: false }}
      />
      <Stack.Screen
        name="dashboard"
        options={{ title: "Warden", headerShown: false }}
      />
      <Stack.Screen
        name="approvals"
        options={{ title: "Approvals", headerShown: false }}
      />
      <Stack.Screen
        name="audit"
        options={{ title: "Audit", headerShown: false }}
      />
      <Stack.Screen
        name="blocked-students"
        options={{ title: "Blocked Students", headerShown: false }}
      />
      <Stack.Screen
        name="currently-out"
        options={{ title: "Currently Out", headerShown: false }}
      />
      <Stack.Screen
        name="students"
        options={{ title: "Students", headerShown: false }}
      />
      <Stack.Screen
        name="profile"
        options={{ title: "Profile", headerShown: false }}
      />
    </Stack>
  );
}
