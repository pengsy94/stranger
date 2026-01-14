

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col items-center h-full bg-[url('/images/login-visual.svg')] bg-no-repeat bg-bottom bg-size-[auto_calc(100%-60px)] lg:bg-contain">
      {children}
    </main>
  );
}
