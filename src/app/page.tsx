"use client"

import useAppStore from "@/stores/useAppStore";
import Index from "@/components/home/Index";
import Chat from "@/components/home/Chat";

export default function Home() {

  const { connect } = useAppStore();

  return connect.status ? <Chat /> : <Index />
}


