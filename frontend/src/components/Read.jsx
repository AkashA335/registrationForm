import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const Read = () => {
  const [employees, setEmployees] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/employees`)
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error("Failed to fetch employee data."));
  }, []);

  const handleEditClick = (employee) => {
    setEditRow(employee.employeeID);
    setEditedValues(employee);
  };

  const handleCancelClick = () => {
    setEditRow(null);
    setEditedValues({});
  };

  const handleChange = (e) => {
    setEditedValues({ ...editedValues, [e.target.name]: e.target.value });
  };

  const handleSaveClick = () => {
    axios
      .put(`${BACKEND_URL}/employees/${editedValues.employeeID}`, editedValues)
      .then(() => {
        toast.success("Employee details updated successfully!");
        setEmployees((prev) =>
          prev.map((employee) =>
            employee.employeeID === editedValues.employeeID
              ? { ...editedValues }
              : employee
          )
        );
        setEditRow(null);
      })
      .catch(() => toast.error("Failed to update employee details."));
  };

  const handleDeleteClick = (employeeID) => {
    axios
      .delete(`${BACKEND_URL}/employees/${employeeID}`)
      .then(() => {
        toast.success("Employee deleted successfully!");
        setEmployees((prev) => prev.filter((employee) => employee.employeeID !== employeeID));
      })
      .catch(() => toast.error("Failed to delete employee."));
  };

  return (
    <div>
      <h2>Employee List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employeeID}>
              {editRow === employee.employeeID ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editedValues.name}
                      onChange={handleChange}
                    />
                  </td>
                  <td>{employee.employeeID}</td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editedValues.email}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editedValues.phoneNumber}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="department"
                      value={editedValues.department}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={editedValues.dateOfJoining.split("T")[0]}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="role"
                      value={editedValues.role}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{employee.name}</td>
                  <td>{employee.employeeID}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>{employee.department}</td>
                  <td>{employee.dateOfJoining.split("T")[0]}</td>
                  <td>{employee.role}</td>
                  <td>
                    <button onClick={() => handleEditClick(employee)}>Edit</button>
                    <button onClick={() => handleDeleteClick(employee.employeeID)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/">
        <button>Add Details</button>
      </Link>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Read;
