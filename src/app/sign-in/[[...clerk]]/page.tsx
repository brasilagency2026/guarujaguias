"use client";
import dynamic from "next/dynamic";
import React from "react";

const SignIn = dynamic(() => import("@clerk/nextjs").then((m) => m.SignIn), { ssr: false });

export default function SignInCatchAll() {
  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <SignIn />
    </div>
  );
}
