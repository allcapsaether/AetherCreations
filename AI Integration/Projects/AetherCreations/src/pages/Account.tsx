import { useState, type FormEvent } from "react";
import { href, navigate } from "../router";
import { useSession } from "../state/session";
import { useToast } from "../state/toast";

type RowProps = {
  id: string;
  label: string;
  value: string;
  empty: string;
  multiline?: boolean;
  onSave: (value: string) => void;
};

function EditableRow({ id, label, value, empty, multiline = false, onSave }: RowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = (event: FormEvent) => {
    event.preventDefault();
    onSave(draft.trim());
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="detail">
        <dt>{label}</dt>
        <dd className={value ? undefined : "detail__empty"}>{value || empty}</dd>
        <dd>
          <button
            type="button"
            className="text-button"
            aria-label={`Edit ${label.toLowerCase()}`}
            onClick={() => {
              setDraft(value);
              setEditing(true);
            }}
          >
            {value ? "Edit" : "Add"}
          </button>
        </dd>
      </div>
    );
  }

  return (
    <div className="detail detail--editing">
      <dt>{label}</dt>
      <dd>
        <form onSubmit={save}>
          {multiline ? (
            <textarea id={id} aria-label={label} rows={3} value={draft} autoFocus onChange={(event) => setDraft(event.target.value)} />
          ) : (
            <input id={id} aria-label={label} value={draft} autoFocus onChange={(event) => setDraft(event.target.value)} />
          )}
          <div className="detail__actions">
            <button type="submit" className="btn btn--sm">Save</button>
            <button type="button" className="text-button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      </dd>
    </div>
  );
}

export default function Account() {
  const { user, signOut, updateUser } = useSession();
  const { notify } = useToast();

  if (!user) {
    return (
      <section className="container page-top">
        <h1 className="page-title">Account</h1>
        <div className="empty">
          <h2>Sign in to see your account.</h2>
          <p>Save your details, follow your build, and hear first about new releases.</p>
          <div className="empty__actions">
            <a className="btn btn--lg" href={href("signin")}>Sign in</a>
            <a className="btn btn--outline btn--lg" href={href("signup")}>Create account</a>
          </div>
        </div>
      </section>
    );
  }

  const firstName = user.name.split(" ")[0];

  return (
    <section className="container page-top">
      <h1 className="page-title">Hello, {firstName}.</h1>
      <div className="account-grid">
        <div>
          <h2 className="section-title">Your details</h2>
          <dl className="details">
            <EditableRow
              id="edit-name"
              label="Name"
              value={user.name}
              empty="Not added"
              onSave={(name) => {
                if (name) {
                  updateUser({ name });
                  notify("Name saved.");
                }
              }}
            />
            <div className="detail">
              <dt>Email address</dt>
              <dd>{user.email}</dd>
              <dd />
            </div>
            <EditableRow
              id="edit-address"
              label="Shipping address"
              value={user.address}
              empty="Not added yet"
              multiline
              onSave={(address) => {
                updateUser({ address });
                notify("Shipping address saved.");
              }}
            />
          </dl>
        </div>

        <aside className="account-side">
          <h2 className="section-title">Orders</h2>
          <p className="account-side__lead">No orders yet.</p>
          <p>When you place an order, build progress and tracking will appear here.</p>
          <div className="account-side__actions">
            <a className="btn" href={href("systems")}>Browse systems</a>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                signOut();
                notify("You've been signed out.");
                navigate("home");
              }}
            >
              Sign out
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
