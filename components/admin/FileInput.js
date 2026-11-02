// Shows the current file, lets the admin replace it or remove it.
export default function FileInput({ label, name, current, accept = "image/*", hint }) {
  const id = `f-${name}`;
  const isImage = accept.startsWith("image");

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        {current &&
          (isImage ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview, any size
            <img src={current} alt="" className="size-16 rounded-md border border-line object-cover" />
          ) : (
            <a href={current} target="_blank" rel="noopener" className="text-sm text-accent underline">Current file</a>
          ))}
        <input id={id} name={name} type="file" accept={accept}
          className="text-sm file:mr-3 file:rounded-md file:border file:border-line file:bg-surface file:px-3 file:py-1.5 file:text-ink" />
        {current && (
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name={`${name}__remove`} className="size-4 accent-accent" />
            Remove
          </label>
        )}
      </div>
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
    </div>
  );
}
