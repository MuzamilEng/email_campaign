import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Toaster, toast } from "sonner";

const Login = () => {
  const apiUrl = import.meta.env.VITE_REACT_API_URL;
  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = `${apiUrl}/auth/login`;
      const { data: res } = await axios.post(url, data);

      localStorage.setItem("token", JSON.stringify(res));
      setLoading(false);
      toast.success("Login Successful");
      setTimeout(() =>
      navigate('/dashboard')
    , 2000)
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.error);
      // setError(error.response.data.error);
      toast.error(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.login_container}>
      <Toaster position="top-center" />

      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            <Link to={"/forgetPassword"}>Forget password</Link>

            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              {loading ? "Loading..." : "Sign in"}
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here ?</h1>
          <img src="/img/login.jpeg" alt="login" className="w-full max-w-[18vw] rounded-lg" />
          <Link to="/signup">
            <div className="mt-[1vw]">
            <button type="button" className={styles.white_btn}>
              Sing Up
            </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
