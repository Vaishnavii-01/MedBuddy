import React, { useState } from "react";

const Reminder = () => {
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [dosageRate, setDosageRate] = useState("daily");
  const [dosageTimes, setDosageTimes] = useState(1);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [medicineCount, setMedicineCount] = useState(0);
  const [editingMedicineId, setEditingMedicineId] = useState(null);

  const handleAddMedicine = () => {
    if (!medicineName) {
      alert("Medicine name is required!");
      return;
    }
  
    if (editingMedicineId !== null) {
      // Update existing medicine
      setMedicines((prevMedicines) =>
        prevMedicines.map((med) =>
          med.id === editingMedicineId
            ? { ...med, medicineName, doctorName, dosageRate, dosageTimes, timesArray: selectedTimes, medicineCount }
            : med
        )
      );
      setEditingMedicineId(null); // Reset editing state
    } else {
      // Add new medicine
      const newMedicine = {
        id: Date.now(),
        medicineName,
        doctorName,
        dosageRate,
        dosageTimes,
        timesArray: selectedTimes,
        medicineCount, // Include medicine count
      };
      setMedicines([...medicines, newMedicine]);
    }
  
    // Reset form fields
    setMedicineName("");
    setDoctorName("");
    setDosageRate("daily");
    setDosageTimes(1);
    setSelectedTimes([]);
    setMedicineCount(0); // Reset medicine count
  };
  
  
  
  const handleEditMedicine = (id) => {
    const medicineToEdit = medicines.find((med) => med.id === id);
    if (medicineToEdit) {
      setMedicineName(medicineToEdit.medicineName);
      setDoctorName(medicineToEdit.doctorName);
      setDosageRate(medicineToEdit.dosageRate);
      setDosageTimes(medicineToEdit.dosageTimes);
      setSelectedTimes([...medicineToEdit.timesArray]); // Fetch ALL dosage times properly
      setMedicineCount(medicineToEdit.medicineCount); // Fetch existing count
      setEditingMedicineId(id); // Set medicine ID for editing
    }
  };
  
  // Handle deleting a medicine
  const handleDeleteMedicine = (id) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  // Handle updating dosage time for a particular medicine
  const handleTimeChange = (index, time) => {
    const updatedTimes = [...selectedTimes];
    updatedTimes[index] = time;
    setSelectedTimes(updatedTimes);
  };

  // Tracker feature
  // const handleTrackerCountChange = (id, count) => {
  //   const updatedMedicines = medicines.map((med) =>
  //     med.id === id ? { ...med, medicineCount: count } : med
  //   );
  //   setMedicines(updatedMedicines);
  // };

  const convertTo12HourFormat = (time) => {
    if (!time) return ""; // Handle empty values
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };
  

  return (
    <div className="flex justify-between gap-12 w-[100vw] mx-auto px-20 py-6 bg-sky-200">
      {/* Left side - Reminder Form */}
      <div className="w-1/2 bg-slate-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Add Medicine</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMedicine();
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="medicineName"
              className="block text-lg font-medium text-gray-700"
            >
              Medicine Name <span className="text-red-500">*</span>:
            </label>
            <input
              type="text"
              id="medicineName"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="doctorName"
              className="block text-lg font-medium text-gray-700"
            >
              Prescribed By (Doctor's Name - Optional):
            </label>
            <input
              type="text"
              id="doctorName"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="dosageRate"
              className="block text-lg font-medium text-gray-700"
            >
              Dosage Rate <span className="text-red-500">*</span>:
            </label>
            <select
              id="dosageRate"
              value={dosageRate}
              onChange={(e) => setDosageRate(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="dosageTimes"
              className="block text-lg font-medium text-gray-700"
            >
              Times of Dosage Per Day <span className="text-red-500">*</span>:
            </label>
            <input
              type="number"
              id="dosageTimes"
              value={dosageTimes}
              onChange={(e) => setDosageTimes(Number(e.target.value))}
              required
              min="1"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Set Dosage Times <span className="text-red-500">*</span>:
            </label>
            {Array.from({ length: dosageTimes }, (_, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="time"
                  value={selectedTimes[index] || ""} // Show correct values when editing
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  className="ml-2 p-2 bg-green-500 text-white rounded-lg"
                  onClick={() => handleTimeChange(index, selectedTimes[index])} // Save selected time
                >
                  Set Time
                </button>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Medicine Count:
            </label>
            <input
              type="number"
              value={medicineCount}
              onChange={(e) => setMedicineCount(Number(e.target.value))}
              min="0"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
          >
            Add Medicine
          </button>
        </form>
      </div>

      {/* Right side - Reminder List and Tracker */}
      <div className="w-1/2">
        <div className="bg-slate-100 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Medicines List</h2>
          <ul className="space-y-4">
            {medicines.map((medicine) => (
              <li key={medicine.id} className="border-b pb-4">
                <strong className="text-xl">{medicine.medicineName}</strong>{" "}
                (Prescribed by: {medicine.doctorName || "N/A"})
                <div className="mt-2">
                  <span className="font-semibold">Dosage:</span>{" "}
                  {medicine.dosageRate}, <span className="font-semibold">Times per day:</span>{" "}
                  {medicine.dosageTimes}
                  <div className="mt-2">
                    <span className="font-semibold">Times:</span>{" "}
                    {medicine.timesArray
                      .map((time) => convertTo12HourFormat(time)) // Convert each time before displaying
                      .join(", ")}
                  </div>

                  <div className="mt-4">
                  <button
                    onClick={() => handleEditMedicine(medicine.id)}
                    disabled={editingMedicineId !== null && editingMedicineId !== medicine.id} 
                    className={`px-4 py-2 rounded-lg transition ${
                      editingMedicineId !== null && editingMedicineId !== medicine.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteMedicine(medicine.id)}
                    className="bg-red-500 text-white px-4 py-2 ml-4 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tracker Feature */}
        <div className="w-1/2">
          <div className="bg-slate-100 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Medicine Tracker</h2>
            <ul className="space-y-4">
              {medicines.map((medicine) => (
                <li key={medicine.id} className="border-b pb-4">
                  <span className="font-semibold">{medicine.medicineName}</span>
                  <div className="mt-2">
                    <span className="font-semibold">Medicine Count:</span> {medicine.medicineCount}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminder;
