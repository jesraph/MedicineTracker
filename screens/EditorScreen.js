import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useMedicines } from '../context/MedicineContext';

export default function EditorScreen() {
  const {
    medicines,
    addMedicine,
    increaseQuantity,
    decreaseQuantity,
    increaseDispensed,
    deleteMedicine,
  } = useMedicines();

  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a medicine name.');
      return;
    }
    addMedicine(name, qty || '0');
    setName('');
    setQty('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.medName}>{item.name}</Text>

        <View style={styles.statsRow}>
          <Text style={styles.stat}>
            Stock: <Text style={styles.statValue}>{item.quantity}</Text>
          </Text>
          <Text style={styles.stat}>
            Dispensed: <Text style={styles.statValue}>{item.dispensed}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        {/* Stock controls */}
        <View style={styles.controlGroup}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => decreaseQuantity(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.controlText}>−</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, styles.darkBtn]}
            onPress={() => increaseQuantity(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.controlText, styles.darkText]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Dispense button */}
        <TouchableOpacity
          style={styles.dispenseBtn}
          onPress={() => increaseDispensed(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.dispenseText}>Dispense</Text>
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            Alert.alert(
              'Remove medicine',
              `Remove "${item.name}"?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Remove',
                  style: 'destructive',
                  onPress: () => deleteMedicine(item.id),
                },
              ]
            )
          }
        >
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.header}>
        <Text style={styles.title}>Medicine Tracker</Text>
        <Text style={styles.subtitle}>
          {medicines.length} {medicines.length === 1 ? 'medicine' : 'medicines'}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Medicine name"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, styles.qtyInput]}
            placeholder="Qty"
            placeholderTextColor="#94a3b8"
            value={qty}
            onChangeText={setQty}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>Add Medicine</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No medicines yet</Text>
            <Text style={styles.emptyText}>
              Add your first medicine using the form above
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 4,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  nameInput: {
    flex: 1,
  },
  qtyInput: {
    width: 80,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardInfo: {
    marginBottom: 14,
  },
  medName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 18,
  },
  stat: {
    fontSize: 14,
    color: '#64748b',
  },
  statValue: {
    fontWeight: '600',
    color: '#0f172a',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  controlBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkBtn: {
    backgroundColor: '#0f172a',
  },
  controlText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#334155',
  },
  darkText: {
    color: '#ffffff',
  },
  dispenseBtn: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  dispenseText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 22,
    color: '#ef4444',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
  },
});