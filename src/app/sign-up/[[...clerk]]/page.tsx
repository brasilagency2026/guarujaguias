"use client";
import dynamic from "next/dynamic";
import React from "react";

const SignUp = dynamic(() => import("@clerk/nextjs").then((m) => m.SignUp), { ssr: false });

export default function SignUpCatchAll() {
  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <SignUp />
    </div>
  );
}
