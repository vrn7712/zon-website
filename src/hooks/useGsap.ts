import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsap(effect: (ctx: gsap.Context) => void, deps: any[] = []) {
  const scope = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(effect, scope);
    return () => ctx.revert();
  }, deps);

  return scope;
}