import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Toaster, toast } from "sonner";
import { useGlobalContext } from "../../context/GlobalStateProvider";

const Login = () => {
  const apiUrl = import.meta.env.VITE_REACT_API_URL;
  const [data, setData] = useState({ input: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmail, setIsEmail] = useState(true); // State to toggle between email and phone number
  const { forgetEmail, setForgetEmail } = useGlobalContext();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setIsEmail(!isEmail);
    setData({ input: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = `${apiUrl}/forgot-password`;
      const payload = isEmail
        ? { email: data.input }
        : { phoneNumber: data.input };
      setForgetEmail({
        ...forgetEmail,
        [isEmail ? "email" : "phoneNumber"]: data.input,
      });

      await axios.post(url, payload);
      setData({ input: "" });
      setLoading(false);
      navigate("/resetPassword");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className={styles.login_container}>
      <Toaster />
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Forget password</h1>
            <input
              type="text"
              placeholder={`you can submit ${
                isEmail ? "email" : "phone number"
              }`}
              name="input"
              onChange={handleChange}
              value={data.input}
              required
              className={styles.input}
            />

            {error && <div className={styles.error_msg}>{error}</div>}
            <Link to={"/login"}>Login</Link>
            <button
              onClick={handleToggle}
              type="button"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${styles.toggle_btn}`}
            >
              Use {isEmail ? "Phone Number" : "Email"}
            </button>

            <button type="submit" className={styles.green_btn}>
              {loading ? "Loading..." : "Forget password"}
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here ?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;