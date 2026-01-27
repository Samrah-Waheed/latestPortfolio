"use client";

import Head from "next/head";

// ✅ Tumhare fixed components (same as before)
import { BackgroundGradientAnimation } from "@/components/ui/GradientBg";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { InfiniteMovingCards } from "@/components/ui/InfiniteCards";

export default function Page() {
  const sampleItems = [
    { quote: "This is a sample quote", name: "John Doe", title: "Developer" },
    { quote: "Another inspiring quote", name: "Jane Smith", title: "Designer" },
  ];

  return (
    <div>
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="Personal Portfolio" />
      </Head>

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BackgroundGradientAnimation>
          <h1 style={{ fontSize: "4rem", margin: "14px 0", color: "white" }}>
            Welcome to My Portfolio
          </h1>

          <TextGenerateEffect words="Frontend Developer • React • Next.js" />

          {/* Cards animation – same */}
          <InfiniteMovingCards items={sampleItems} />
        </BackgroundGradientAnimation>
      </main>
    </div>
  );
}