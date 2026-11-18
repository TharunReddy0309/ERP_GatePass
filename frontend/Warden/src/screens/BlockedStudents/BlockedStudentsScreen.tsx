import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';

import AppShell from '../../components/AppShell/AppShell';
import HeroHeader from '../../components/HeroHeader/HeroHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import {
  getMe,
  getAllBlocked,
  getAllPassActions,
  unblockStudent,
  getStudentsByHostel,
} from '../../api/wardenApi';
import type { BlockedStudent } from '../../services/wardenService';
import { styles } from './BlockedStudentsScreen.styles';

export default function BlockedStudentsScreen() {
  const [students, setStudents] = useState<BlockedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [unblockedIds, setUnblockedIds] = useState<string[]>([]);
  const [wardenId, setWardenId] = useState<string | null>(null);
  const [modalUri, setModalUri] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await getMe();
      const hid = me.hostel?.Block_Id;
      setWardenId(me.user?.Id ?? null);

      if (!hid) {
        setStudents([]);
        return;
      }

      const [blockedRecords, actions, hostelStudents] = await Promise.all([
        getAllBlocked().catch(() => []),
        getAllPassActions().catch(() => []),
        getStudentsByHostel(hid).catch(() => []),
      ]);

      const myBlocked = blockedRecords.filter((b) => b.Hostel_id === hid);
      const studentMap = new Map(hostelStudents.map((s) => [s.Roll_NO, s]));

      const mapped: BlockedStudent[] = myBlocked.map((b) => {
        const studentActions = actions
          .filter((a) => a.passID === b.Roll_No)
          .sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());

        const latestRemark = studentActions[0]?.Remarks ?? null;
        const studentData = studentMap.get(b.Roll_No);

        return {
          id: b.id,
          rollNo: b.Roll_No,
          name: studentData?.Name ?? b.Roll_No,
          hostelId: b.Hostel_id,
          date: new Date(b.BlockedAt).toLocaleDateString(),
          remark: latestRemark,
          reason: (b.Reason === 'MISCAN_PROXY' ? 'MISCAN_PROXY' : 'LATE_ARRIVAL') as 'LATE_ARRIVAL' | 'MISCAN_PROXY',
          proofUrl: b.Proof_Url ?? null,
        };
      });

      setStudents(mapped);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load blocked students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const visibleStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return students.filter((student) => {
      if (unblockedIds.includes(student.rollNo)) return false;
      if (!normalizedQuery) return true;

      return [student.name, student.rollNo, student.date, student.remark].some((value) =>
        value && value.toLowerCase().includes(normalizedQuery),
      );
    });
  }, [query, unblockedIds, students]);

  const handleUnblock = async (rollNo: string) => {
    if (!wardenId) return;
    try {
      await unblockStudent(rollNo, wardenId);
      setUnblockedIds((curr) => [...curr, rollNo]);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to unblock');
    }
  };

  return (
    <AppShell activeTab="dashboard">
      <HeroHeader
        height={192}
        title="Blocked Students"
        subtitle="Manage student access restrictions"
      />
      <View style={styles.main}>
        <SearchBar
          placeholder="Search by Name or Roll No..."
          value={query}
          onChangeText={setQuery}
        />

        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <ActivityIndicator size="large" color="#002147" />
          </View>
        ) : error ? (
          <Text style={{ color: '#BA1A1A', textAlign: 'center', margin: 16 }}>{error}</Text>
        ) : (
          <View style={styles.list}>
            {visibleStudents.map((student) => (
              <View key={student.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.name}>{student.name}</Text>
                    <Text style={styles.date}>{student.date}</Text>
                  </View>
                  <Ionicons name="ban-outline" size={20} color="#E51B23" />
                </View>

                <View style={styles.reasonBand}>
                  {student.reason === 'MISCAN_PROXY' ? (
                    <View style={styles.badgeMiscan}>
                      <Text style={styles.badgeText}>Miscan (Proxy)</Text>
                    </View>
                  ) : (
                    <View style={styles.badgeLateArrival}>
                      <Text style={styles.badgeText}>Late Arrival</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardBody}>
                  {student.reason === 'MISCAN_PROXY' && student.proofUrl ? (
                    <Pressable onPress={() => setModalUri(student.proofUrl)} style={styles.proofThumbContainer}>
                      <Image
                        source={{ uri: student.proofUrl }}
                        style={styles.proofThumb}
                        contentFit="cover"
                      />
                    </Pressable>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleUnblock(student.rollNo)}
                    style={styles.unblockButton}
                  >
                    <Text style={styles.unblockText}>Unblock</Text>
                  </Pressable>
                </View>
              </View>
            ))}
            {!visibleStudents.length ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No blocked students found.</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      <Modal visible={!!modalUri} animationType="fade" statusBarTranslucent transparent>
        <View style={styles.modalOverlay}>
          <Image
            source={{ uri: modalUri ?? undefined }}
            style={styles.modalImage}
            contentFit="contain"
          />
          <Pressable style={styles.modalCloseButton} onPress={() => setModalUri(null)}>
            <Text style={styles.modalCloseText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </AppShell>
  );
}
