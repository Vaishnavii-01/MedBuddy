import React, { useState } from "react";

const Pharmacy = () => {
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [price, setPrice] = useState("");

  // Handle adding medicine to list
  const handleAddMedicine = () => {
    if (!medicineName || !pharmacyName || !price) {
      alert("All fields are required!");
      return;
    }

    const newMedicine = {
      id: Date.now(),
      medicineName,
      pharmacyName,
      price,
    };

    setMedicines([...medicines, newMedicine]);
    setMedicineName("");
    setPharmacyName("");
    setPrice("");
  };

  // Handle deleting medicine
  const handleDeleteMedicine = (id) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-sky-200 p-6">
      <div className="w-full w-[40vw] bg-slate-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Pharmacy Inventory</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMedicine();
          }}
        >
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Medicine Name:</label>
            <input
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Pharmacy Name:</label>
            <input
              type="text"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
          >
            Add Medicine
          </button>
        </form>

        {/* Medicine List */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Available Medicines</h3>
          <ul className="space-y-4">
            {medicines.map((medicine) => (
              <li key={medicine.id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <span className="font-semibold">{medicine.medicineName}</span> from {medicine.pharmacyName} - ${medicine.price}
                </div>
                <button
                  onClick={() => handleDeleteMedicine(medicine.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;