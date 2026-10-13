import { useState, type FormEvent } from "react";
import { ArrowRight } from "../components/Icons";
import Mark from "../components/Mark";
import Photo from "../components/Photo";
import { authPhoto } from "../data";
import { href, navigate } from "../router";
import { useSession } from "../state/session";
import { useToast } from "../state/toast";

type Mode = "signin" | "signup";
type Field = "username" | "email" | "password";
type Errors = Partial<Record<Field, string>>;

const EMAIL = /^\S+@\S+\.\S+$/;

function validate(mode: Mode, values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (mode === "signup" && (values.username.length < 2 || values.username.length > 24)) {
    errors.username = "Enter a username between 2 and 24 characters.";
  }
  if (!EMAIL.test(values.email)) errors.email = "Enter an email address like name@example.com.";
  if (mode === "signup" ? values.password.length < 8 : values.password.length === 0) {
    errors.password = mode === "signup" ? "Use at least 8 characters." : "Enter your password.";
  }
  return errors;
}

type InputProps = {
  name: Field;
  label: string;
  type?: string;
  autoComplete: string;
  placeholder: string;
  error?: string;
};

function TextField({ name, label, type = "text", autoComplete, placeholder, error }: InputProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const errorId = `${name}-error`;
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <div className="field__control">
        <input
          id={name}
          name={name}
          type={isPassword && visible ? "text" : type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {isPassword && (
          <button type="button" className="text-button field__toggle" aria-pressed={visible} onClick={() => setVisible((v) => !v)}>
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Auth({ mode }: { mode: Mode }) {
  const signup = mode === "signup";
  const { signIn } = useSession();
  const { notify } = useToast();
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values: Record<Field, string> = {
      username: String(data.get("username") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    };
    const found = validate(mode, values);
    setErrors(found);

    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLInputElement | null)?.focus();
      return;
    }

    signIn(values.email, signup ? values.username : undefined);
    notify(signup ? "Account created. Welcome to AetherCreations." : "Signed in.");
    navigate("account");
  };

  return (
    <section className="auth">
      <div className="auth__visual">
        <Photo photo={authPhoto} alt="" widths={[600, 900, 1400]} sizes="50vw" />
        <div className="auth__visual-copy">
          <Mark />
          <p>Precision at every scale.</p>
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__form">
          <h1>{signup ? "Create an account." : "Welcome back."}</h1>
          <p className="auth__lede">
            {signup
              ? "Save your details, follow your build, and receive private product releases."
              : "Sign in to manage your builds, details, and private releases."}
          </p>

          <form noValidate onSubmit={onSubmit}>
            {signup && (
              <TextField name="username" label="Username" autoComplete="username" placeholder="Your username" error={errors.username} />
            )}
            <TextField name="email" label="Email address" type="email" autoComplete="email" placeholder="name@example.com" error={errors.email} />
            <TextField
              name="password"
              label="Password"
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              placeholder={signup ? "At least 8 characters" : "Your password"}
              error={errors.password}
            />
            <button className="btn btn--lg btn--block" type="submit">
              {signup ? "Create account" : "Sign in"} <ArrowRight />
            </button>
          </form>

          <p className="auth__switch">
            {signup ? "Already have an account?" : "New to AetherCreations?"}{" "}
            <a href={href(signup ? "signin" : "signup")}>{signup ? "Sign in" : "Create an account"}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
