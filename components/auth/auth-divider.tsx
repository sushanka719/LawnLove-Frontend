export function AuthDivider() {
  return (
    <div className="flex w-full items-center gap-4">
      <div className="h-px flex-1 bg-black/[0.1]" />
      <span className="text-lawn-text-secondary text-sm font-medium">or</span>
      <div className="h-px flex-1 bg-black/[0.1]" />
    </div>
  );
}
