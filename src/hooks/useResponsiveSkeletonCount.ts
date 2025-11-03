import { useEffect, useState } from "react";

export function useResponsiveSkeletonCount() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        // Tablet
        setCount(4);
      } else {
        // Mobile or Desktop
        setCount(3);
      }
    };

    updateCount(); // run initially
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return count;
}
