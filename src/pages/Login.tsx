import { signInWithEmailAndPassword } from "firebase/auth";
import { ChangeEvent, FormEvent, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import getErrorMessage from "../utilities/get-error-message";

type LoginState = {
  email: string;
  password: string;
};

type LoginAction = {
  type: keyof LoginState | "clear";
  payload?: string;
};

const loginValue: LoginState = {
  email: "",
  password: "",
};

const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case "clear":
      return { email: "", password: "" };
    case "email":
      if (!action.payload) return state;
      return { ...state, email: action.payload };
    case "password":
      if (!action.payload) return state;
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

function Login() {
  const navigate = useNavigate();
  const [{ email, password }, loginDispatch] = useReducer(
    loginReducer,
    loginValue
  );

  const handleLoginInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    return loginDispatch({ type: name as keyof LoginState, payload: value });
  };

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      return getErrorMessage(error);
    }
    loginDispatch({ type: "clear" });
    return navigate("/");
  };

  return (
    <form
      onSubmit={handleLoginSubmit}
      className="m-auto flex min-w-[20rem] flex-col gap-2"
    >
      <h2 className="self-center font-bold uppercase tracking-widest">
        Entrar
      </h2>
      <label htmlFor="email" className="w-fit font-bold">
        E-mail
      </label>
      <input
        onChange={handleLoginInput}
        value={email}
        type="email"
        name="email"
        id="email"
        placeholder="Ex: meu@email.com"
        className="mb-2 flex items-center rounded border border-neutral-300 bg-neutral-50 p-4 shadow outline-none transition-colors duration-300 placeholder:text-neutral-500 hover:border-neutral-500 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500 dark:focus:border-neutral-500"
      />
      <label htmlFor="password" className="w-fit font-bold">
        Senha
      </label>
      <input
        onChange={handleLoginInput}
        value={password}
        type="password"
        name="password"
        id="password"
        placeholder="Mínimo de 6 caractéres"
        className="mb-2 flex items-center rounded border border-neutral-300 bg-neutral-50 p-4 shadow outline-none transition-colors duration-300 placeholder:text-neutral-500 hover:border-neutral-500 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500 dark:focus:border-neutral-500"
      />
      <button
        type="submit"
        className="mb-2 flex items-center self-center rounded bg-blue-700 px-4 py-2 font-bold uppercase text-neutral-50 shadow transition-colors duration-300 hover:bg-blue-500"
      >
        Confirmar
      </button>
      <span className="flex items-center gap-1 self-center text-neutral-500 dark:text-neutral-400">
        Não possui uma conta?
        <Link
          to="/register"
          className="font-bold text-blue-700 transition-colors duration-300 after:block after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-blue-500 after:transition-transform after:duration-300 hover:text-blue-500 hover:after:scale-x-100"
        >
          Criar
        </Link>
      </span>
    </form>
  );
}

export default Login;
