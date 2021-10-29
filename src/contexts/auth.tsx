import { createContext, ReactNode, useEffect, useState } from "react";
import { StateRequestEnum } from "../interface/StateRequest";
import { api } from "../services/api";

interface StateRequest {
  signIn: StateRequestEnum;
  profile: StateRequestEnum;
}

type User = {
  id: string;
  name: string;
  avatar_url: string;
  login: string;
};

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
  stateRequest: StateRequest;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  };
};

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);
  const [stateRequest, setStateRequest] = useState<StateRequest>({
    signIn: StateRequestEnum.SUCCESS,
    profile: StateRequestEnum.SUCCESS,
  });

  const signInUrl =
    "https://github.com/login/oauth/authorize?schope=user&client_id=8545343194f8aa7e99cd";

  async function signIn(gitHubCode: string) {
    setStateRequest((prevState) => ({
      ...prevState,
      signIn: StateRequestEnum.FETCH,
    }));
    const response = await api.post<AuthResponse>("authenticate", {
      code: gitHubCode,
    });

    const { token, user } = response.data;

    localStorage.setItem("@doWhile:token", token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
    setStateRequest((prevState) => ({
      ...prevState,
      signIn: StateRequestEnum.SUCCESS,
    }));
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("@doWhile:token");
  }

  useEffect(() => {
    setStateRequest((prevState) => ({
      ...prevState,
      signIn: StateRequestEnum.FETCH,
    }));
    const token = localStorage.getItem("@doWhile:token");

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>("profile").then((response) => {
        setUser(response.data);

        setStateRequest((prevState) => ({
          ...prevState,
          profile: StateRequestEnum.SUCCESS,
        }));
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGitHubCode = url.includes("?code=");

    if (hasGitHubCode) {
      const [urlWithoutCode, gitHubCode] = url.split("?code=");

      window.history.pushState({}, "", urlWithoutCode);

      signIn(gitHubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut, stateRequest }}>
      {props.children}
    </AuthContext.Provider>
  );
}
