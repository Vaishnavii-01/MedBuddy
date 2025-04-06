import React, { useState } from "react";
import { db } from "../firebase"; 
import { collection, addDoc } from "firebase/firestore";

const Doctor = () => {
  const [problem, setProblem] = useState("");
  const [doctorType, setDoctorType] = useState("");
  const [availability, setAvailability] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const doctorTypes = [
    "General Practitioner",
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Gynecologist",
    "Neurologist",
    "Oncologist",
    "Ophthalmologist",
    "Orthopedic Surgeon",
    "Otolaryngologist (ENT)",
    "Pediatrician",
    "Psychiatrist",
    "Pulmonologist",
    "Radiologist",
    "Rheumatologist",
    "Urologist",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        problem,
        doctorType,
        availability,
        appointmentDate: availability === "Get an appointment" ? appointmentDate : "",
        startTime: availability === "Get an appointment" ? startTime : "",
        endTime: availability === "Get an appointment" ? endTime : "",
        timestamp: new Date(),
      };

      await addDoc(collection(db, "appointments"), formData);

      if (availability === "Get an appointment") {
        alert(
          `Appointment fixed with a ${doctorType} on ${appointmentDate} from ${startTime} to ${endTime}.`
        );
      } else {
        alert(`Looking for ${doctorType} available ${availability.toLowerCase()}.`);
      }

      setProblem("");
      setDoctorType("");
      setAvailability("");
      setAppointmentDate("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      alert("Failed to submit. Try again.");
    }
  };

  return (
    <div className="bg-sky-200 flex justify-center align-center p-4">
      <div className="bg-slate-100 p-6 border-black border-solid border-2 w-[50vw] h-[86vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">
              Describe your problem: <span className="text-red-500">*</span>
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">
              Type of Doctor: <span className="text-red-500">*</span>
            </label>
            <select
              value={doctorType}
              onChange={(e) => setDoctorType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a doctor type</option>
              {doctorTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">
              Availability: <span className="text-red-500">*</span>
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select availability</option>
              <option value="Immediately">Immediately</option>
              <option value="Within an hour">Within an hour</option>
              <option value="Get an appointment">Get an appointment</option>
            </select>
          </div>

          {availability === "Get an appointment" && (
            <>
              <div>
                <label className="block mb-1">
                  Select Date: <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">
                  Start Time: <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">
                  End Time: <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              {availability === "Get an appointment"
                ? "Fix Appointment"
                : "Look for Doctors"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Doctor;