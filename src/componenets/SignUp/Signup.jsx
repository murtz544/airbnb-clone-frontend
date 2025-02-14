import { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import "./Signup.css";
import { useModal } from "../../context/Modal";

const Signup = () => {
  const dispatch = useDispatch();

  // State for form fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const disabled = {};
    if (!email && !username && !firstName && !lastName && !password && !confirmPassword) {
      disabled.form = "Please fill out the sign-up form";
    }
    if (username.length < 4) {
      disabled.username = "Username must be longer than 4 characters";
    }
    if (password.length < 6) {
      disabled.password = "Password must be longer than 6 characters";
    }
    if (!confirmPassword) {
      disabled.confirmPassword =
        "Password and confirm-password must not be empty";
    }
    setErrors(disabled);
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (password !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    const userData = {
      email,
      username,
      firstName,
      lastName,
      password,
    };

    // Dispatch signup action
    const response = await dispatch(signup(userData));

    // Handle errors from backend
    if (response.errors) {
      setErrors(response.errors);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
