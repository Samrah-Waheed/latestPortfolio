"use client";

import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { useEffect, useState } from "react";

const Grid = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // ensures client-only code
  }, []);

  if (!isClient) return null; // SSR par kuch render nahi hoga

  return (
    <section id="about">
      <BentoGrid className="w-full py-20">
        {gridItems.map((item, i) => (
          <BentoGridItem
            id={item.id}
            key={i}
            title={item.title}
            description={item.description}
            className={item.className}
            img={item.img}
            imgClassName={item.imgClassName}
            titleClassName={item.titleClassName}
            spareImg={item.spareImg}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Grid;