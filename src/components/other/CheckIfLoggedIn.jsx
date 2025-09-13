import React, { useEffect, useState } from "react";
import { checkUserRecord, createUserRecord } from "../../hooks/userService";

function CheckIfLoggedIn() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    position: "",
    salary: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const result = await checkUserRecord();
        if (!result.exists) {
          setShowForm(true); // Show popup form
        }
      } catch (err) {
        console.error("Error checking user:", err);
      }
    };
    checkUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserRecord(formData);
      setShowForm(false); // Hide popup after saving
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className="">

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
                className="border rounded px-3 py-2"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckIfLoggedIn;
