import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";

const Reminder = () => {
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [dosageRate, setDosageRate] = useState("daily");
  const [dosageTimes, setDosageTimes] = useState(1);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [medicineCount, setMedicineCount] = useState(0);
  const [pillsPerDosage, setPillsPerDosage] = useState(1); 
  const [editingMedicineId, setEditingMedicineId] = useState(null);

  // Convert database time format to local display format
  const dbTimeToLocalDisplay = (timeString) => {
    if (!timeString) return "";
    return timeString; // We'll keep the HH:MM format for now
  };

  // This ensures same format is maintained for backend
  const inputTimeToDbFormat = (timeString) => {
    if (!timeString) return "";
    return timeString; // Keep using HH:MM format that backend expects
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      const user = auth.currentUser; 
      if (!user) return; 
      
      const q = query(collection(db, "medicines"), where("userId", "==", user.uid)); 
      const data = await getDocs(q); 
      
      const fetchedMedicines = data.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          // Keep the times as is but make a copy
          timesArray: [...(docData.timesArray || [])]
        };
      });
      
      setMedicines(fetchedMedicines);
    };
    
    fetchMedicines();
  }, []);

  const handleAddMedicine = async () => {
    if (!medicineName) {
      alert("Medicine name is required!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in!");
      return;
    }

    // Use same time format backend expects
    const timesForDb = selectedTimes.map(inputTimeToDbFormat);

    try {
      if (editingMedicineId) {
        const medicineRef = doc(db, "medicines", editingMedicineId);
        await updateDoc(medicineRef, {
          userId: user.uid,
          medicineName,
          doctorName,
          dosageRate,
          dosageTimes,
          timesArray: timesForDb,
          medicineCount,
          pillsPerDosage,
        });
        setEditingMedicineId(null);
      } else {
        await addDoc(collection(db, "medicines"), {
          userId: user.uid,
          medicineName,
          doctorName,
          dosageRate,
          dosageTimes,
          timesArray: timesForDb,
          medicineCount,
          pillsPerDosage,
        });
      }

      // Refresh medicines list
      const q = query(collection(db, "medicines"), where("userId", "==", user.uid));
      const updatedData = await getDocs(q);
      const updatedMedicines = updatedData.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          timesArray: [...(docData.timesArray || [])]
        };
      });

      setMedicines(updatedMedicines);

      // Reset form
      setMedicineName("");
      setDoctorName("");
      setDosageRate("daily");
      setDosageTimes(1);
      setSelectedTimes([]);
      setMedicineCount(0);
      setPillsPerDosage(1);
    } catch (error) {
      console.error("Error adding/updating medicine:", error);
      alert("Failed to save medicine information.");
    }
  };

  const handleEditMedicine = (id) => {
    const medicineToEdit = medicines.find((med) => med.id === id);
    if (medicineToEdit) {
      setMedicineName(medicineToEdit.medicineName);
      setDoctorName(medicineToEdit.doctorName);
      setDosageRate(medicineToEdit.dosageRate);
      setDosageTimes(medicineToEdit.dosageTimes);
      setSelectedTimes(medicineToEdit.timesArray || []);
      setMedicineCount(medicineToEdit.medicineCount || 0);
      setPillsPerDosage(medicineToEdit.pillsPerDosage || 1);
      setEditingMedicineId(id);
    }
  };

  const handleDeleteMedicine = async (id) => {
    try {
      await deleteDoc(doc(db, "medicines", id));
      setMedicines(medicines.filter((med) => med.id !== id));
    } catch (error) {
      console.error("Error deleting medicine:", error);
      alert("Failed to delete medicine.");
    }
  };

  const handleTimeChange = (index, time) => {
    const updatedTimes = [...selectedTimes];
    updatedTimes[index] = time;
    setSelectedTimes(updatedTimes);
  };

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="flex justify-between gap-12 w-[100vw] mx-auto px-20 py-6 bg-sky-200">
      <div className="w-1/2 bg-slate-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{editingMedicineId ? "Edit Medicine" : "Add Medicine"}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddMedicine(); }}>
          <div className="mb-4">
            <label className="block text-lg font-medium">Medicine Name:</label>
            <input type="text" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} className="w-full p-3 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Doctor's Name:</label>
            <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Dosage Rate:</label>
            <select value={dosageRate} onChange={(e) => setDosageRate(e.target.value)} className="w-full p-3 border rounded-lg">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Dosage Times Per Day:</label>
            <input type="number" min="1" max="10" value={dosageTimes} onChange={(e) => {
              const value = Math.max(1, Math.min(10, Number(e.target.value)));
              setDosageTimes(value);
              // Adjust selectedTimes array length
              if (value < selectedTimes.length) {
                setSelectedTimes(selectedTimes.slice(0, value));
              }
            }} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Number of Pills per Dosage:</label>
            <input type="number" min="1" value={pillsPerDosage} onChange={(e) => setPillsPerDosage(Number(e.target.value))} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Set Dosage Times:</label>
            {Array.from({ length: dosageTimes }, (_, index) => (
              <div key={index} className="flex items-center mb-2">
                <input 
                  type="time" 
                  value={selectedTimes[index] || ""} 
                  onChange={(e) => handleTimeChange(index, e.target.value)} 
                  className="p-2 border rounded-lg" 
                  required 
                />
                <span className="ml-2">({index + 1}/{dosageTimes})</span>
              </div>
            ))}
          </div>
          <button type="submit" className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            {editingMedicineId ? "Update Medicine" : "Add Medicine"}
          </button>
        </form>
      </div>

      <div className="w-1/2">
        <div className="bg-slate-100 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Medicines List</h2>
          {medicines.length === 0 ? (
            <p className="text-gray-500">No medicines added yet.</p>
          ) : (
            <ul className="space-y-4">
              {medicines.map((medicine) => (
                <li key={medicine.id} className="border-b pb-4">
                  <h3 className="text-xl font-medium">{medicine.medicineName}</h3>
                  <div className="mt-2 text-gray-700">
                    <p><span className="font-medium">Prescription by:</span> {medicine.doctorName || "N/A"}</p>
                    <p><span className="font-medium">Dosage schedule:</span> {medicine.dosageRate}, {medicine.dosageTimes} time(s) per day</p>
                    <p><span className="font-medium">Pills per dosage:</span> {medicine.pillsPerDosage || 1}</p>
                    <p><span className="font-medium">Reminder times:</span> {medicine.timesArray.map(convertTo12HourFormat).join(", ")}</p>
                  </div>
                  <div className="mt-3 flex">
                    <button 
                      onClick={() => handleEditMedicine(medicine.id)} 
                      className="bg-yellow-500 px-4 py-2 rounded-lg text-white hover:bg-yellow-600 transition-colors mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteMedicine(medicine.id)} 
                      className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminder;