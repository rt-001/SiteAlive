import React, { useEffect, useState } from "react";

import "./Auth.css";

function Auth() {
  const [singupActive, setSignupActive] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSignup = async () => {
    if (submitButtonDisabled) return;
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("All fields are required");
      return;
    }
    if (!validateEmail(values.email)) {
      setErrorMsg("Email is not valid");
      return;
    }
    if (values.pass.length < 6) {
      setErrorMsg("Password must be of 6 characters");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    const res = await fetch("http://localhost:3000/user/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email,
        password: values.pass,
      }),
    }).catch((err) => {
      setErrorMsg("Error creating the user - ", err.message);
    });
    setSubmitButtonDisabled(false);

    if (!res) {
      setErrorMsg("Error creating the user");
      return;
    }
    const data = await res.json();

    if (!data.status) {
      setErrorMsg(data.message);
      return;
    }

    const tokens = data.data.tokens;

    localStorage.setItem("tokens", JSON.stringify(tokens));

    window.location.reload();
  };

  const handleLogin = async () => {
    if (submitButtonDisabled) return;
    if (!values.email.trim() || !values.pass) {
      setErrorMsg("All fields are required");
      return;
    }
    if (!validateEmail(values.email)) {
      setErrorMsg("Email is not valid");
      return;
    }
    if (values.pass.length < 6) {
      setErrorMsg("Password must be of 6 characters");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    const res = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.pass,
      }),
    }).catch((err) => {
      setErrorMsg("Error in login - ", err.message);
    });
    setSubmitButtonDisabled(false);

    if (!res) {
      setErrorMsg("Error in login");
      return;
    }
    const data = await res.json();

    if (!data.status) {
      setErrorMsg(data.message);
      return;
    }

    const tokens = data.data.tokens;

    localStorage.setItem("tokens", JSON.stringify(tokens));

    window.location.reload();
  };

  useEffect(() => {
    setValues({});
  }, [singupActive]);

  const signupDiv = (
    <div className="box signup">
      <p className={"heading"}>Sign Up</p>

      <div className={"elem"}>
        <label>Name</label>
        <input
          className="input"
          placeholder="Enter name"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))
          }
        />
      </div>

      <div className={"elem"}>
        <label>Email</label>
        <input
          className="input"
          placeholder="Enter email"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
        />
      </div>

      <div className={"elem"}>
        <label>Password</label>
        <input
          className="input"
          type="password"
          placeholder="Enter password"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))
          }
        />
      </div>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <button onClick={handleSignup} disabled={submitButtonDisabled}>
        {submitButtonDisabled ? "Signing up..." : "Signup"}
      </button>

      <p className="bottom-text">
        Already a user ?{" "}
        <span onClick={() => setSignupActive(false)}>Login here</span>
      </p>
    </div>
  );

  const loginDiv = (
    <div className="box signup">
      <p className={"heading"}>Login</p>

      <div className={"elem"}>
        <label>Email</label>
        <input
          className="input"
          placeholder="Enter email"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
        />
      </div>

      <div className={"elem"}>
        <label>Password</label>
        <input
          className="input"
          type="password"
          placeholder="Enter password"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))
          }
        />
      </div>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <button onClick={handleLogin} disabled={submitButtonDisabled}>
        {submitButtonDisabled ? "Logging in..." : "Login"}
      </button>

      <p className="bottom-text">
        New user ?{" "}
        <span onClick={() => setSignupActive(true)}>Signup here</span>
      </p>
    </div>
  );

  return <div className="container">{singupActive ? signupDiv : loginDiv}</div>;
}

export default Auth;
