import { useState } from "react";
import { loginUser, registerUser } from "../../../firebase/auth";

export const useLoginForm = () => {
  const [errorState, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    await loginUser(email, password, setErrorState, setLoading);
  };

  const handleRegister = async (values: {
    email: string;
    reEmail: string;
    password: string;
    confirmPassword: string;
    nameSurname: string;
    birthday: string;
    dailyTarget: string;
  }) => {
    const { email, password, nameSurname } = values;
    await registerUser(nameSurname, email, password, setLoading, setErrorState);
  };

  return {
    errorState,
    loading,
    handleLogin,
    handleRegister,
  };
};
