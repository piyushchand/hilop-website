'use client';

import React, { useRef, ElementType } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';

interface ParagraphProps<Tag extends React.ElementType = 'h2'> {
  paragraph: string;
  textColor?: string;
  textSize?: string; 
  align?: 'start' | 'center';
  className?: string;
  highlightedWord?: string;
  highlightedColor?: string;
  as?: Tag;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  textColor: string;
  highlightedWord?: string;
  highlightedColor?: string;
}

interface CharProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  textColor: string;
  highlightedWord?: string;
  highlightedColor?: string;
}

export default function Paragraph<Tag extends React.ElementType = 'h2'>({
  paragraph,
  textColor = 'text-black',
  align = 'start',
  textSize = 'text-4xl sm:text-4xl md:text-5xl xl:text-6xl font-semibold',
  className = '',
  highlightedWord = '',
  highlightedColor = 'text-green-800',
  as,
}: ParagraphProps<Tag extends React.ElementType ? Tag : 'h2'>) {
  const Component = (as || 'h2') as ElementType;

  const containerRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.25'],
  });

  const words = paragraph.split(' ');
  const alignmentClasses = align === 'center' ? 'mx-auto justify-center text-center' : 'justify-start';

  return (
    <Component
    ref={containerRef}
    className={`${alignmentClasses} w-fit font-normal ${textSize} ${className}`}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            textColor={textColor}
            highlightedWord={highlightedWord}
            highlightedColor={highlightedColor}
          >
            {word}
          </Word>
        );
      })}
    </Component>
  );
}

const Word = ({
  children,
  progress,
  range,
  textColor,
  highlightedWord = '',
  highlightedColor = 'text-primary',
}: WordProps) => {
  const amount = range[1] - range[0];
  const step = amount / children.length;

  // FIXED: Only match whole word
  const isHighlighted = highlightedWord.toLowerCase() === children.toLowerCase();

  return (
    <span className="mr-2 whitespace-nowrap">
      {children.split('').map((char, i) => {
        const start = range[0] + i * step;
        const end = range[0] + (i + 1) * step;
        return (
          <Char
            key={i}
            progress={progress}
            range={[start, end]}
            textColor={isHighlighted ? highlightedColor : textColor}
            highlightedWord={highlightedWord}
            highlightedColor={highlightedColor}
          >
            {char}
          </Char>
        );
      })}
    </span>
  );
};

const Char = ({
  children,
  progress,
  range,
  textColor,
  highlightedWord = '',
  highlightedColor = 'text-primary',
}: CharProps) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative inline-block" aria-hidden="true">
      <span className={`absolute left-0 top-0 opacity-30 ${textColor}`}>
        {children}
      </span>
      <motion.span
        style={{ opacity }}
        className={`inline-block ${highlightedWord && textColor === highlightedColor
          ? highlightedColor
          : textColor
          }`}
      >
        {children}
      </motion.span>
      <span className="sr-only">{children}</span>
    </span>
  );
};
