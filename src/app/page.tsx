"use client"

import Index from "@/components/home/Index";
import Chat from "@/components/home/Chat";
import useAppStore from "@/stores/useAppStore";

export default function Home() {

  const { connect } = useAppStore();

  return connect.status ? <Chat /> : <Index />
}


