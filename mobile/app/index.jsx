import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../src/contexts/authContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();
  useEffect(() => {
    console.log('=== INDEX.JSX DEBUG ===');
    console.log('isLoading:', isLoading);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
  }, [isLoading, isAuthenticated, user]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Redirect href="/(admin)" />;
    }
    if (user?.role === 'user') {
      return <Redirect href="/(user)" />;
    }
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

// import { useEffect, useState, useMemo } from 'react';
// import { SafeAreaView, Text, SectionList, StyleSheet, View, Button, Alert } from 'react-native';
// import TaskItem from '../src/components/TaskItem';
// import FilterToolbarFancy from '../src/components/FilterToolbarFancy';
// import AddCategoryModal from '../src/components/AddCategoryModal';
// import { loadTasks, updateTask, deleteTask, clearTasks as clearAllTasks } from '../src/storage/taskStorage';
// import { loadCategories, saveCategories } from '../src/storage/categoryStorage';
// import { pickColor } from '../src/constants/categories';
// import { weightOfPriority } from '../src/constants/priorities';
// import 'expo-router/entry';
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';

// export default function Home() {
//   // DATA
//   const [tasks, setTasks] = useState([]);
//   const [categories, setCategories] = useState([]);

//   // FILTER
//   const [statusFilter, setStatusFilter] = useState('all');     // all|todo|done
//   const [categoryFilter, setCategoryFilter] = useState('all'); // all|Umum
//   const [priorityFilter, setPriorityFilter] = useState('all'); // all|Low|Medium|High

//   // Modal tambah kategori
//   const [showCatModal, setShowCatModal] = useState(false);

//   const refresh = async () => {
//     const [ts, cs] = await Promise.all([loadTasks(), loadCategories()]);
//     setTasks(ts);
//     setCategories(cs);
//   };

//   // useEffect(() => { refresh(); }, []);
//   useFocusEffect(
//     useCallback(() => {
//       refresh();
//     }, [])
//   );

//   // Toggle status (server)
//   const handleToggle = async (task) => {
//     const next = task.status === 'done' ? 'pending' : 'done';
//     const ok = await updateTask(task.id, { status: next });
//     if (ok) {
//       setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t));
//     } else {
//       Alert.alert('Error', 'Gagal memperbarui status di server');
//     }
//   };

//   // Hapus task (server)
//   const handleDelete = async (task) => {
//     Alert.alert('Konfirmasi', 'Hapus tugas ini?', [
//       { text: 'Batal' },
//       {
//         text: 'Ya',
//         onPress: async () => {
//           const ok = await deleteTask(task.id);
//           if (ok) {
//             setTasks(prev => prev.filter(t => t.id !== task.id));
//           } else {
//             Alert.alert('Error', 'Gagal menghapus di server');
//           }
//         }
//       }
//     ]);
//   };

//   // Ringkasan
//   const doneCount = useMemo(() => tasks.filter(t => t.status === 'done').length, [tasks]);
//   const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
//   const overdueCount = useMemo(() =>
//     tasks.filter(t => t.deadline && t.deadline < today && t.status !== 'done').length,
//     [tasks, today]
//   );

//   // Clear
//   const handleClearDone = () => {
//     if (!doneCount) {
//       Alert.alert('Info', 'Tidak ada tugas Done.');
//       return;
//     }
//     Alert.alert('Hapus Tugas Selesai', `Yakin hapus ${doneCount} tugas selesai?`, [
//       { text: 'Batal' },
//       {
//         text: 'Hapus', style: 'destructive', onPress: async () => {
//           const toDelete = tasks.filter(t => t.status === 'done');
//           await Promise.all(toDelete.map(t => deleteTask(t.id)));
//           setTasks(prev => prev.filter(t => t.status !== 'done'));
//         }
//       }
//     ]);
//   };

//   const handleClearAll = () => {
//     if (!tasks.length) {
//       Alert.alert('Info', 'Daftar tugas kosong.');
//       return;
//     }
//     Alert.alert('Konfirmasi', 'Hapus semua tugas?', [
//       { text: 'Batal' },
//       {
//         text: 'Ya', onPress: async () => {
//           await clearAllTasks();
//           setTasks([]);
//         }
//       }
//     ]);
//   };

//   // Filter
//   const filtered = useMemo(() => {
//     return tasks.filter(t => {
//       const byStatus = statusFilter === 'all' || (statusFilter === 'todo' ? t.status !== 'done' : t.status === 'done');
//       const byCategory = categoryFilter === 'all' || (t.category ?? 'Umum') === categoryFilter;
//       const byPriority = priorityFilter === 'all' || (t.priority ?? 'Low') === priorityFilter;
//       return byStatus && byCategory && byPriority;
//     });
//   }, [tasks, statusFilter, categoryFilter, priorityFilter]);

//   // Sort: priority weight desc, deadline asc
//   const sorted = useMemo(() => {
//     return [...filtered].sort((a, b) => {
//       const wa = weightOfPriority(a.priority ?? 'Low');
//       const wb = weightOfPriority(b.priority ?? 'Low');
//       if (wa !== wb) return wb - wa;
//       if (!a.deadline && !b.deadline) return 0;
//       if (!a.deadline) return 1;
//       if (!b.deadline) return -1;
//       return new Date(a.deadline) - new Date(b.deadline);
//     });
//   }, [filtered]);

//   // Grouping -> SectionList
//   const sections = useMemo(() => {
//     const map = new Map();
//     for (const t of sorted) {
//       const key = t.category ?? 'Umum';
//       if (!map.has(key)) map.set(key, []);
//       map.get(key).push(t);
//     }
//     const entries = categoryFilter === 'all'
//       ? [...map.entries()]
//       : [[categoryFilter, map.get(categoryFilter) || []]];
//     return entries.map(([title, data]) => ({ title, data }));
//   }, [sorted, categoryFilter]);

//   // Tambah kategori dari Home (opsional)
//   const handleSubmitCategory = async (cat) => {
//     if (categories.some(c => c.key.toLowerCase() === cat.key.toLowerCase())) {
//       Alert.alert('Info', 'Nama kategori sudah ada.');
//       setShowCatModal(false);
//       return;
//     }
//     const color = cat.color || pickColor(categories.length);
//     const next = [...categories, { key: cat.key, color }];
//     await saveCategories(next);
//     setCategories(next);
//     setCategoryFilter(cat.key);
//     setShowCatModal(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

//       {/* Toolbar filter */}
//       <View style={{ paddingHorizontal: 16, gap: 12 }}>
//         <FilterToolbarFancy
//           categories={categories}
//           categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
//           statusFilter={statusFilter} setStatusFilter={setStatusFilter}
//           priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
//         />

//         {/* Ringkasan */}
//         <View style={styles.toolbar}>
//           <Text style={styles.toolbarText}>Done: {doneCount} / {tasks.length}</Text>
//           <Text style={[styles.toolbarText, { color: overdueCount ? '#dc2626' : '#334155' }]}>
//             Overdue: {overdueCount}
//           </Text>
//           <View style={{ flexDirection: 'row', gap: 8 }}>
//             <Button title="Clear Done" onPress={handleClearDone} disabled={!doneCount} />
//             <Button title="Clear All" onPress={handleClearAll} />
//           </View>
//         </View>
//       </View>

//       {/* SectionList by category */}
//       <SectionList
//         sections={sections}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ padding: 16 }}
//         renderSectionHeader={({ section: { title } }) =>
//           <Text style={styles.sectionHeader}>{title}</Text>
//         }
//         renderItem={({ item }) =>
//           <TaskItem task={item} categories={categories} onToggle={handleToggle} onDelete={handleDelete} />
//         }
//         ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>}
//       />

//       {/* Modal tambah kategori */}
//       <AddCategoryModal
//         visible={showCatModal}
//         onClose={() => setShowCatModal(false)}
//         onSubmit={handleSubmitCategory}
//         suggestedColor={pickColor(categories.length)}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8fafc' },
//   header: { fontSize: 20, fontWeight: '700', padding: 16 },
//   toolbar: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 8, paddingHorizontal: 12, gap: 6  },
//   toolbarText: { fontWeight: '600', color: '#334155' },
//   sectionHeader: { fontSize: 14, fontWeight:'800', color:'#0f172a', marginTop: 12, marginBottom: 6, textTransform: 'uppercase'}
// });
