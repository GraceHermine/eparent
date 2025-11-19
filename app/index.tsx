// app/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(screens)/splashscreen");
    }, 0); // Laisse le temps au router de s'initialiser

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}