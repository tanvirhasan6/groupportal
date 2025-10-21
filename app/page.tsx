'use client'
// import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <h1 className="text-9xl">hi</h1>
      <button onClick={()=>router.push("/dashboard")}>Log-in</button>
    </div>
  );
}
