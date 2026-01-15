"use client"

import Index from "@/components/home/Index";
import Chat from "@/components/home/Chat";
import useAppStore from "@/stores/useAppStore";

export default function Home() {

  const { connect } = useAppStore();

  return (
    <main className="flex flex-col items-center h-full bg-[url('/images/login-visual.svg')] bg-no-repeat bg-bottom bg-size-[auto_calc(100%-60px)] lg:bg-contain">
      {connect.status ? <Chat /> : <Index />}
    </main>
  )
}


