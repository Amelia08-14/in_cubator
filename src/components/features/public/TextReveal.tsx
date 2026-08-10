'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  text: string;
  subtitle?: string;
  superTitle?: string;
  className?: string;
}

export default function TextReveal({ text, subtitle, superTitle, className }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = text.split(" ");
  const subtitleWords = subtitle ? subtitle.split(" ") : [];

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Select all words in the container (both main text and subtitle)
    const wordSpans = containerRef.current.querySelectorAll('.word');

    // Ensure initial state
    gsap.set(wordSpans, { opacity: 0.15 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        end: "bottom 50%",
        scrub: 1, // Add slight smoothing to the scrub
      }
    });

    tl.to(wordSpans, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
    });
    
    return () => {
      // Clean up scroll trigger instances related to this component
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={className || "min-h-[70vh] flex flex-col items-center justify-center text-center w-full mb-8 mt-16 px-4 py-20"}>
      {superTitle && (
        <div className="flex flex-col items-center mb-8">
          <span className="word text-[#964594] font-extrabold text-[12px] tracking-widest uppercase leading-none">
            {superTitle}
          </span>
          <div className="word h-[2px] w-8 bg-[#964594] mt-3"></div>
        </div>
      )}
      <h2 
        className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-extrabold text-[#47295C] leading-[1.2] tracking-tight max-w-6xl mx-auto flex flex-wrap justify-center"
      >
        {words.map((word, i) => (
          <span key={`text-${i}`} className="word mr-[0.25em] mb-2 lg:mb-4">
            {word}
          </span>
        ))}
      </h2>
      {subtitle && (
        <p className="text-gray-500 font-light text-lg md:text-xl max-w-2xl mx-auto mt-8 flex flex-wrap justify-center">
          {subtitleWords.map((word, i) => (
            <span key={`sub-${i}`} className="word mr-[0.25em] mb-1">
              {word}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
