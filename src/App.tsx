import { useContext } from "react";
import styles from "./App.module.scss";
import { Loading } from "./components/Loading";
import { LoginBox } from "./components/LoginBox";
import { MessageList } from "./components/MessageList";
import { SendMessageForm } from "./components/SendMessageForm";
import { AuthContext } from "./contexts/auth";
import { StateRequestEnum } from "./interface/StateRequest";

export function App() {
  const { user, stateRequest } = useContext(AuthContext);

  return (
    <Loading
      open={
        stateRequest.profile === StateRequestEnum.FETCH &&
        stateRequest.signIn === StateRequestEnum.FETCH
      }
    >
      <main
        className={`${styles.contentWrapper} ${
          !!user ? styles.contentSigned : ""
        }`}
      >
        <MessageList />
        {!!user ? <SendMessageForm /> : <LoginBox />}
      </main>
    </Loading>
  );
}
