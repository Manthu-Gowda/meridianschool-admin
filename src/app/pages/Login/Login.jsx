
import { useState } from "react";
import "./Login.scss";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputField from "../../components/InputField/InputField";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { errorToast, successToast } from "../../services/ToastHelper";
import { ADMIN_LOGIN } from "../../utils/apiPath";
import { postApi } from "../../utils/apiService";
import { saveAuthToSession } from "../../services/auth";

import AuthLogo from "../../assets/auth-logo.webp";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [login, setLogin] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    let errObj = { ...initialValues };

    if (!login.email) {
      errObj.email = "This field is required";
    } else if (/\s/.test(login.email)) {
      errObj.email = "Email should not contain spaces";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(login.email)) {
      errObj.email = "Please enter a valid email address";
    } else {
      errObj.email = "";
    }

    if (!login.password) {
      errObj.password = "This field is required";
    } else if (/\s/.test(login.password)) {
      errObj.password = "Password should not contain spaces";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(login.password)
    ) {
      errObj.password =
        "Password must be 8+ characters, with uppercase, lowercase, number, and special character.";
    } else {
      errObj.password = "";
    }

    setErrors((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "" || x === null);
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    const payload = { email: login.email, password: login.password };

    const { statusCode, data, message } = await postApi(ADMIN_LOGIN, payload);

    if (statusCode === 200) {
      saveAuthToSession(data);
      successToast("Successfully Logged In");
      setIsLoading(false);
      navigate("/home");
    } else {
      setIsLoading(false);
      errorToast(message);
    }
  };

  return (
    <div className="login-page">
      {isLoading && <Loader />}

      <div className="login-wrap">
        <div className="login-logo">
          <img src={AuthLogo} alt="main-logo" />
        </div>

        <div className="login-card">
          <h1 className="title">Welcome Back!</h1>
          <p className="subtitle">Please enter your details to continue</p>

          <div className="form">
            <InputField
              title="Email"
              name="email"
              value={login.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              errorText={errors.email}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            <InputField
              title="Password"
              name="password"
              type="password"
              value={login.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              errorText={errors.password}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            <ButtonComponent type="submit" variant="primary" onClick={handleLogin}>
              Sign In
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;