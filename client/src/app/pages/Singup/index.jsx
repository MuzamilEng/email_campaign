import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Toaster, toast } from "sonner";
import { useSignupMutation } from "../../store/storeApi";
import { useGlobalContext } from "../../context/GlobalStateProvider";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    penCardNumber: "",
  });
  const { adminEmail, setAdminEmail } = useGlobalContext();
  const [signupMutation, { isLoading, isError, error, data, isSuccess }] = useSignupMutation();

  const handleChange = ({ currentTarget: input }) => {
    setFormData({ ...formData, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.email === "admin@gmail.com" && formData.password !== "admin") {
        toast.error("Invalid admin credentials. Please check your password.");
        return;
      }

      await signupMutation(formData).unwrap();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        penCardNumber: "",
        phoneNumber: "",
      });
      toast.success("Registered successfully");
      if (formData.email === "admin@gmail.com" && formData.password === "admin") {
        setAdminEmail(formData?.email);
      }
    } catch (err) {
      toast.error(err?.data?.error || "Signup failed");
    }
  };
  if (isSuccess) {
    toast.success("Registered successfully you will recieve a message shortly");
    navigate("/login");
    localStorage.setItem("userData", JSON.stringify(data));
  }
  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <div className={styles.signup_container}>
      <Toaster position="top-center" />
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>...</h1>
          <img
            src="/img/signup.jpg"
            alt="Signup"
            className="w-full m-[1vw] max-w-[18vw] rounded-lg"
          />
          <Link to="/login">
            <div className="mt-[1vw]">
              <button type="button" className={styles.white_btn}>
                Sign in
              </button>
            </div>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
              value={formData.firstName}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
              value={formData.lastName}
              required
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Pen Card Number"
              name="penCardNumber"
              onChange={handleChange}
              value={formData.penCardNumber}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Phone number"
              name="phoneNumber"
              onChange={handleChange}
              value={formData.phoneNumber}
              required
              className={styles.input}
            />
            {isError && <div className={styles.error_msg}>{error?.data?.error}</div>}
            <button type="submit" className={styles.green_btn}>
              {isLoading ? "Loading..." : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
