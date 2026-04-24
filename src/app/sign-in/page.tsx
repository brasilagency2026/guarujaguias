import dynamic from "next/dynamic";
import React from "react";

const SignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignIn),
  { ssr: false }
);

export default function SignInPage() {
  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <SignIn />
    </div>
  );
}
