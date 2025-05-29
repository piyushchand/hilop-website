"use client";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap
} from "framer-motion";

interface ParallaxProps {
  children: string;
  baseVelocity?: number;
  repeatCount?: number;
}

export default function ParallaxText({
  children,
  baseVelocity = 100,
  repeatCount = 4
}: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => {
    const wrapped = wrap(-100 / repeatCount, 0, v);
    return `${wrapped}%`;
  });

  let direction = 1;

  useAnimationFrame((t, delta) => {
    if (velocityFactor.get() < 0) {
      direction = -1;
    } else if (velocityFactor.get() > 0) {
      direction = 1;
    }

    let moveBy = direction * baseVelocity * (delta / 24000);
    moveBy += direction * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap mb-16 lg:mb-40">
      <motion.div className="text-5xl font-bold md:text-8xl flex flex-nowrap whitespace-nowrap uppercase" style={{ x }}>
        {Array.from({ length: repeatCount }).map((_, index) => (
          <span key={index} className="block mr-8">{children} </span>
        ))}
      </motion.div>
    </div>
  );
}
