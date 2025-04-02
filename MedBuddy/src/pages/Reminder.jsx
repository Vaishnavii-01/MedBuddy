import React, { useState } from "react";

const Reminder = () => {
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [dosageRate, setDosageRate] = useState("daily");
  const [dosageTimes, setDosageTimes] = useState(1);

  // Handle form submission for adding medicine
  const handleAddMedicine = () => {
    if (!medicineName) {
      alert("Medicine name is required!");
      return;
    }

    const newMedicine = {
      id: Date.now(), // Use current timestamp as unique ID
      medicineName,
      doctorName,
      dosageRate,
      dosageTimes,
      timesArray: [...Array(dosageTimes).keys()].map(() => ""), // Initialize times array
      medicineCount: 0, // Default count to 0
    };

    setMedicines([...medicines, newMedicine]);
    setMedicineName("");
    setDoctorName("");
    setDosageRate("daily");
    setDosageTimes(1);
  };

  // Handle editing a medicine
  const handleEditMedicine = (id) => {
    const medicineToEdit = medicines.find((med) => med.id === id);
    setMedicineName(medicineToEdit.medicineName);
    setDoctorName(medicineToEdit.doctorName);
    setDosageRate(medicineToEdit.dosageRate);
    setDosageTimes(medicineToEdit.dosageTimes);
  };

  // Handle deleting a medicine
  const handleDeleteMedicine = (id) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  // Handle updating dosage time for a particular medicine
  const handleTimeChange = (index, time, medicineId) => {
    const updatedMedicines = medicines.map((med) =>
      med.id === medicineId
        ? {
            ...med,
            timesArray: med.timesArray.map((t, i) =>
              i === index ? time : t
            ),
          }
        : med
    );
    setMedicines(updatedMedicines);
  };

  // Tracker feature
  const handleTrackerCountChange = (id, count) => {
    const updatedMedicines = medicines.map((med) =>
      med.id === id ? { ...med, medicineCount: count } : med
    );
    setMedicines(updatedMedicines);
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
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="dosageRate"
              className="block text-lg font-medium text-gray-700"
            >
              Dosage Rate:
            </label>
            <select
              id="dosageRate"
              value={dosageRate}
              onChange={(e) => setDosageRate(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              Times of Dosage Per Day:
            </label>
            <input
              type="number"
              id="dosageTimes"
              value={dosageTimes}
              onChange={(e) => setDosageTimes(Number(e.target.value))}
              min="1"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Set Dosage Times:
            </label>
            {Array.from({ length: dosageTimes }, (_, index) => (
              <div key={index} className="flex items-center mb-2">
                <label
                  htmlFor={`time${index}`}
                  className="mr-2 text-lg text-gray-700"
                >
                  Time for Dose {index + 1}:
                </label>
                <input
                  type="time"
                  id={`time${index}`}
                  onChange={(e) =>
                    handleTimeChange(index, e.target.value, Date.now())
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
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
                    <span className="font-semibold">Times:</span> {medicine.timesArray.join(", ")}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => handleEditMedicine(medicine.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
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
        <div className="bg-slate-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Medicine Tracker</h2>
          <ul className="space-y-4">
            {medicines.map((medicine) => (
              <li key={medicine.id} className="border-b pb-4">
                <span className="font-semibold">{medicine.medicineName}</span>
                <div className="flex items-center mt-2">
                  <label htmlFor="medicineCount" className="mr-2">Medicine Count:</label>
                  <input
                    type="number"
                    value={medicine.medicineCount || 0}
                    onChange={(e) =>
                      handleTrackerCountChange(medicine.id, e.target.value)
                    }
                    min="0"
                    className="p-2 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reminder;
