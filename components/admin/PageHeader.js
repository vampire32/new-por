export default function PageHeader({ title, description, children }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-4xl tracking-tight">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
