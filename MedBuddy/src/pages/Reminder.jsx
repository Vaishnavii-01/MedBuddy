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

  useEffect(() => {
    const fetchMedicines = async () => {
      const user = auth.currentUser; 
      if (!user) return; 
      const q = query(collection(db, "medicines"), where("userId", "==", user.uid)); 
      const data = await getDocs(q); 
      const localTimesMedicines = data.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          timesArray: (docData.timesArray || []).map((utcTime) => {
            const [hours, minutes] = utcTime.split(":").map(Number);
            const date = new Date(Date.UTC(1970, 0, 1, hours, minutes));
            const local = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
            return local;
          }),
        };
      });
      setMedicines(localTimesMedicines);
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

    const utcTimesArray = selectedTimes.map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const localDate = new Date();
      localDate.setHours(hours, minutes);
      const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
      return utcDate.toISOString().slice(11, 16);
    });

    if (editingMedicineId) {
      const medicineRef = doc(db, "medicines", editingMedicineId);
      await updateDoc(medicineRef, {
        userId: user.uid,
        medicineName,
        doctorName,
        dosageRate,
        dosageTimes,
        timesArray: utcTimesArray,
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
        timesArray: utcTimesArray,
        medicineCount,
        pillsPerDosage,
      });
    }

    const q = query(collection(db, "medicines"), where("userId", "==", user.uid));
    const updatedData = await getDocs(q);
    const updatedLocalTimes = updatedData.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        timesArray: (docData.timesArray || []).map((utcTime) => {
          const [hours, minutes] = utcTime.split(":").map(Number);
          const date = new Date(Date.UTC(1970, 0, 1, hours, minutes));
          const local = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
          return local;
        }),
      };
    });

    setMedicines(updatedLocalTimes);

    setMedicineName("");
    setDoctorName("");
    setDosageRate("daily");
    setDosageTimes(1);
    setSelectedTimes([]);
    setMedicineCount(0);
    setPillsPerDosage(1);
  };

  const handleEditMedicine = (id) => {
    const medicineToEdit = medicines.find((med) => med.id === id);
    if (medicineToEdit) {
      setMedicineName(medicineToEdit.medicineName);
      setDoctorName(medicineToEdit.doctorName);
      setDosageRate(medicineToEdit.dosageRate);
      setDosageTimes(medicineToEdit.dosageTimes);
      setSelectedTimes([...medicineToEdit.timesArray]); // These are now local times
      setMedicineCount(medicineToEdit.medicineCount);
      setPillsPerDosage(medicineToEdit.pillsPerDosage || 1); 
      setEditingMedicineId(id);
    }
  };

  const handleDeleteMedicine = async (id) => {
    await deleteDoc(doc(db, "medicines", id));
    setMedicines(medicines.filter((med) => med.id !== id));
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
        <h2 className="text-2xl font-semibold mb-4">Add Medicine</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddMedicine(); }}>
          <div className="mb-4">
            <label className="block text-lg font-medium">Medicine Name:</label>
            <input type="text" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} className="w-full p-3 border rounded-lg" />
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
            <label className="block text-lg font-medium">Dosage Times:</label>
            <input type="number" value={dosageTimes} onChange={(e) => setDosageTimes(Number(e.target.value))} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Number of Pills per packet:</label>
            <input type="number" value={pillsPerDosage} onChange={(e) => setPillsPerDosage(Number(e.target.value))} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Set Dosage Times:</label>
            {Array.from({ length: dosageTimes }, (_, index) => (
              <div key={index} className="flex items-center mb-2">
                <input type="time" value={selectedTimes[index] || ""} onChange={(e) => handleTimeChange(index, e.target.value)} className="p-2 border rounded-lg" />
              </div>
            ))}
          </div>
          <button type="submit" className="w-full p-3 bg-indigo-600 text-white rounded-lg">
            {editingMedicineId ? "Update Medicine" : "Add Medicine"}
          </button>
        </form>
      </div>

      <div className="w-1/2">
        <div className="bg-slate-100 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Medicines List</h2>
          <ul className="space-y-4">
            {medicines.map((medicine) => (
              <li key={medicine.id} className="border-b pb-4">
                <strong>{medicine.medicineName}</strong> (Prescribed by: {medicine.doctorName || "N/A"})
                <div className="mt-2">
                  <span>Dosage: {medicine.dosageRate}, Times per day: {medicine.dosageTimes}</span>
                  <div>Times: {medicine.timesArray.map(convertTo12HourFormat).join(", ")}</div>
                  <div>Pills per Dosage: {medicine.pillsPerDosage}</div>
                </div>
                <button onClick={() => handleEditMedicine(medicine.id)} className="bg-yellow-500 px-4 py-2 rounded-lg m-2">Edit</button>
                <button onClick={() => handleDeleteMedicine(medicine.id)} className="bg-red-500 px-4 py-2 ml-4 rounded-lg m-2">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reminder;
