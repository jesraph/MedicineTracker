import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  // Load saved data when app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('@medicines');
        if (stored) {
          setMedicines(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Failed to load medicines', e);
      }
    };
    loadData();
  }, []);

  // Save data whenever medicines change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@medicines', JSON.stringify(medicines));
      } catch (e) {
        console.log('Failed to save medicines', e);
      }
    };
    saveData();
  }, [medicines]);

  const addMedicine = (name, quantity) => {
    if (!name.trim()) return;
    const newMed = {
      id: Date.now().toString(),
      name: name.trim(),
      quantity: Number(quantity) || 0,
      dispensed: 0,
    };
    setMedicines((prev) => [...prev, newMed]);
  };

  const increaseQuantity = (id) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, quantity: m.quantity + 1 } : m))
    );
  };

  const decreaseQuantity = (id) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, quantity: Math.max(0, m.quantity - 1) } : m
      )
    );
  };

  const increaseDispensed = (id) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          // Optional: also reduce stock when dispensing
          const newQuantity = Math.max(0, m.quantity - 1);
          return {
            ...m,
            dispensed: m.dispensed + 1,
            quantity: newQuantity,
          };
        }
        return m;
      })
    );
  };

  const deleteMedicine = (id) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        addMedicine,
        increaseQuantity,
        decreaseQuantity,
        increaseDispensed,
        deleteMedicine,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicines = () => useContext(MedicineContext);