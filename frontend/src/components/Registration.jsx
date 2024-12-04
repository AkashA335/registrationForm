import React from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = import.meta.env.VITE_API_URL ;

const Registration = () => {
  const [values, setValues] = React.useState({
    name: '',
    employeeID: '',
    email: '',
    phoneNumber: '',
    department: '',
    dateOfJoining: '',
    role: '',
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};

    if (!values.name.trim()) errors.name = 'Name is required';
    if (!values.employeeID.trim()) errors.employeeID = 'Employee ID is required';
    if (!values.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email is not valid';
    if (!values.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(values.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!values.department.trim()) errors.department = 'Department is required';
    if (!values.dateOfJoining.trim()) errors.dateOfJoining = 'Date of joining is required';
    if (!values.role.trim()) errors.role = 'Role is required';

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }

    axios
      .post(`${BACKEND_URL}/register`, values)
      .then((res) => {
        toast.success('Registration Successful!');
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          if (err.response.data.message === 'Email already exists') {
            toast.error('Email already exists. Please use a different email.');
          } else if (err.response.data.message === 'Employee ID already exists') {
            toast.error('Employee ID already exists. Please use a different ID.');
          }
        } else {
          toast.error('Error during registration. Please try again.');
        }
      });
  };

  const handleReset = () => {
    toast.dismiss();
    setValues({
      name: '',
      employeeID: '',
      email: '',
      phoneNumber: '',
      department: '',
      dateOfJoining: '',
      role: '',
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name (First and Last)</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your full name"
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="employeeID">Employee ID</label>
          <input
            type="text"
            name="employeeID"
            id="employeeID"
            maxLength={10}
            placeholder="Enter Employee ID"
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="Enter 10-digit phone number"
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="department">Department</label>
          <select name="department" id="department" onChange={handleChange}>
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateOfJoining">Date of Joining</label>
          <input
            type="date"
            name="dateOfJoining"
            id="dateOfJoining"
            max={new Date().toISOString().split('T')[0]}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="role">Role</label>
          <input
            type="text"
            name="role"
            id="role"
            placeholder="Enter your role"
            onChange={handleChange}
          />
        </div>

        <div>
          <button type="submit">Submit</button>
          <button type="reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Registration;
