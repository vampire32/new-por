const control =
  "mt-2 block w-full rounded-md border border-line bg-surface px-3 py-2 text-ink focus:border-accent focus:outline-none";

export default function Field({ label, name, type = "text", defaultValue, hint, required, rows, placeholder }) {
  const id = `f-${name}`;

  if (type === "checkbox") {
    return (
      <label htmlFor={id} className="flex items-start gap-3">
        <input id={id} name={name} type="checkbox" defaultChecked={Boolean(defaultValue)} className="mt-1 size-4 accent-accent" />
        <span>
          <span className="block font-medium">{label}</span>
          {hint && <span className="block text-sm text-muted">{hint}</span>}
        </span>
      </label>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-muted"> (required)</span>}
      </label>
      {rows ? (
        <textarea id={id} name={name} rows={rows} defaultValue={defaultValue ?? ""} required={required}
          placeholder={placeholder} className={control} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue ?? ""} required={required}
          placeholder={placeholder} className={control} />
      )}
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
    </div>
  );
}
