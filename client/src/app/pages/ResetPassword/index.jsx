import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Toaster, toast } from "sonner";
import { useGlobalContext } from "../../context/GlobalStateProvider";

const Login = () => {
  const apiUrl = import.meta.env.VITE_REACT_API_URL;
  const { forgetEmail, setForgetEmail } = useGlobalContext();
  const navigate = useNavigate();
  //   const [data, setData] = useState({ email: "" });
  const [data, setData] = useState({ otp: "", newPassword: "" });
  const [error, setError] = useState("");
  const [otpState, setOtpState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successFulAlert, setSuccessFulAlert] = useState(false);
  const handleChange = (event) => {
    // setData({ ...data, [event.target.name]: event.target.value });
    setForgetEmail({ ...forgetEmail, [event.target.name]: event.target.value });
    console.log(data);
  };

  const handleSubmit = async (e) => {
    console.log("front end call");
    e.preventDefault();
    try {
      setLoading(true);

      const url = `${apiUrl}/reset-password`;
      const res = await axios.post(url, forgetEmail);
      setData({ otp: "", newPassword: "" });
      setLoading(false);
      setSuccessFulAlert(true);
      setForgetEmail({ ...forgetEmail, otp: "", newPassword: "" });
      navigate("/login");
    } catch (error) {
      console.log(error);
      //   setError(error.response.data.error);
      toast.error(error.response.data.error, {
        position: "top-center",
      });
      setLoading(false);
    }
  };
  if (successFulAlert) {
    // alert("Success full reset password");
    toast.success("Successfull reset password", {
      position: "top-center",
    });
  }
  useEffect(() => {
    // alert("Enter OTP from email");
    toast.warning("Enter OTP from email", {
      position: "top-center",
    });
  }, []);
  return (
    <div className={styles.login_container}>
      <Toaster position="top-center" />
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Forget password</h1>

            <input
              type="text"
              placeholder="OTP"
              name="otp"
              onChange={handleChange}
              value={forgetEmail.otp}
              required
              className={styles.input}
            />

            <input
              type="password"
              placeholder="New password"
              name="newPassword"
              onChange={handleChange}
              value={forgetEmail.newPassword}
              required
              className={styles.input}
            />

            <Link to={"/login"}>Login</Link>
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              {loading ? "Loading..." : "Reset password"}
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
