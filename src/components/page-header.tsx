export default function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-[22px] font-normal text-ink">{title}</h1>
      {action}
    </div>
  );
}
