import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } from "firebase/firestore";

const Pharmacy = () => {
  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null); 

  useEffect(() => {
    const fetchMedicines = async () => {
      const user = auth.currentUser; 
      if (!user) return;

      const q = query(collection(db, "medicines"), where("userId", "==", user.uid)); 
      const data = await getDocs(q);

      setMedicines(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchMedicines();
  }, []);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!medicineName || !pharmacyName || !price) {
      alert("All fields are required!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to add medicines!");
      return;
    }

    const newDoc = await addDoc(collection(db, "medicines"), {
      medicineName,
      pharmacyName,
      price,
      userId: user.uid,
    });

    setMedicines([...medicines, { id: newDoc.id, medicineName, pharmacyName, price, userId: user.uid }]);
    setMedicineName("");
    setPharmacyName("");
    setPrice("");
  };

  const handleDeleteMedicine = async (id) => {
    await deleteDoc(doc(db, "medicines", id));
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  const handleEditMedicine = (medicine) => {
    setEditingId(medicine.id);
    setMedicineName(medicine.medicineName);
    setPharmacyName(medicine.pharmacyName);
    setPrice(medicine.price);
  };

  const handleSaveEdit = async () => {
    if (!medicineName || !pharmacyName || !price) {
      alert("All fields are required!");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    const medicineRef = doc(db, "medicines", editingId);
    await updateDoc(medicineRef, {
      medicineName,
      pharmacyName,
      price,
      userId: user.uid, 
    });

    setMedicines((prevMedicines) =>
      prevMedicines.map((med) =>
        med.id === editingId ? { id: med.id, medicineName, pharmacyName, price, userId: user.uid } : med
      )
    );

    setEditingId(null);
    setMedicineName("");
    setPharmacyName("");
    setPrice("");
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-sky-200 p-6">
      <div className="w-[40vw] bg-slate-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Pharmacy Inventory</h2>

        <form onSubmit={editingId ? handleSaveEdit : handleAddMedicine}>
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
            className={`w-full p-3 mt-4 font-bold rounded-lg transition ${
              editingId ? "bg-green-600 hover:bg-green-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {editingId ? "Save Changes" : "Add Medicine"}
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Your Medicines</h3>
          {medicines.length === 0 ? (
            <p className="text-gray-500">No medicines found. Add some!</p>
          ) : (
            <ul className="space-y-4">
              {medicines.map((medicine) => (
                <li key={medicine.id} className="border-b pb-2 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{medicine.medicineName}</span> from {medicine.pharmacyName} - $
                    {medicine.price}
                  </div>
                  <div>
                    <button
                      onClick={() => handleEditMedicine(medicine)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
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

export default Pharmacy;