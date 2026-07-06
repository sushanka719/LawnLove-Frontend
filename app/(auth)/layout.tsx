export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/auth/signup-background.png)" }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-[480px]">{children}</div>
    </main>
  );
}
