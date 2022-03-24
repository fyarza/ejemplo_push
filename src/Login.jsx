import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Login({ setToken }) {
  const initialValues = {
    email: "johnson.allie@example.net",
    password: "Tablef0_3456",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email Valido").required("Email Requerido"),
    password: Yup.string().min(3, "min:3").required("Password Requerido"),
  });

  const singIn = async (email, password) => {
    try {
      const result = await axios.request({
        baseURL: "http://localhost:8000",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "post",
        url: "/sign_in",
        data: {
          email,
          password,
        },
      });
      if (result.data.code === 200) {
        setToken(result.data.data.api_token);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const onSubmit = (values, action) => {
    console.log("values", values);
    singIn(values.email, values.password);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", width: 300 }}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange("email")}
              placeholder="Email"
            />
            {"email" in formik.errors && <p>{formik.errors.email}</p>}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              placeholder="password"
            />
            {"password" in formik.errors && <p>{formik.errors.password}</p>}
            <button type="submit">Enviar</button>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default Login;
