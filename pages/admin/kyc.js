import { useEffect } from "react";
import { useRouter } from "next/router";
export default function KYCRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/admin/compliance"); }, [router]);
  return null;
}
