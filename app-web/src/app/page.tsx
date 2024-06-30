"use client"

import { MapView } from "@/componets";
import cls from "./page.module.css";

export default function Home() {
  return (
    <main className={cls.main}>
      <MapView/>
    </main>
  );
}
