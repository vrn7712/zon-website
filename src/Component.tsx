/**
 * Main Landing Page Component
 * Implements a premium, animated landing page with GSAP.
 * Sections: Hero, Marquee, Narrative (New), About, Features, New Features (Music/Widgets), Screenshots, Download.
 */
import { useState } from 'react';
import { ArrowRight, Check, Zap, Clock, Shield, Play, Music, Layout, Timer, Lock, Bell, Palette, ListTodo, Smartphone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from './hooks/useGsap';
import pureFocusImg from './assets/pure-focus.png';
import showcaseImg from './assets/showcase.png';

gsap.registerPlugin(ScrollTrigger);

export function ZonLandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useGsap((_ctx) => {
    // Mouse movement parallax for hero
    const heroSection = containerRef.current?.querySelector('.hero-section');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e: any) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 40;
        const y = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to('.hero-floater', {
          x: x,
          y: y,
          duration: 1,
          ease: 'power2.out'
        });

        gsap.to('.hero-floater-2', {
          x: -x * 1.5,
          y: -y * 1.5,
          duration: 1.2,
          ease: 'power2.out'
        });
      });
    }

    // Custom Cursor Logic
    gsap.set(".custom-cursor", { xPercent: -50, yPercent: -50 });
    gsap.set(".custom-cursor-ring", { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(".custom-cursor", "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(".custom-cursor", "y", { duration: 0.2, ease: "power3" });

    const xToRing = gsap.quickTo(".custom-cursor-ring", "x", { duration: 0.6, ease: "power3" });
    const yToRing = gsap.quickTo(".custom-cursor-ring", "y", { duration: 0.6, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    });

    // Initial Loader Animation
    const tl = gsap.timeline();

    tl.from(".hero-bg-elem", {
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out"
    })
      .from(".char-reveal", {
        y: 150,
        rotateX: -90,
        opacity: 0,
        stagger: 0.05,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
      }, "-=1")
      .from(".hero-glass-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .from(".hero-btn", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.6)"
      }, "-=0.6");

    // Skew scroll effect
    let proxy = { skew: 0 },
      skewSetter = gsap.quickSetter(".skew-elem", "skewY", "deg"),
      clamp = gsap.utils.clamp(-20, 20);

    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew)
          });
        }
      }
    });

    // Marquee Animation with Tilt
    gsap.to(".marquee-inner", {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: "linear"
    });

    gsap.to(".marquee-inner-reverse", {
      xPercent: 50,
      repeat: -1,
      duration: 20,
      ease: "linear"
    });

    // NEW: Narrative Horizontal Scroll (The "Long Sentence")
    const narrativeTrack = containerRef.current?.querySelector(".narrative-track") as HTMLElement;
    const narrativeWrapper = containerRef.current?.querySelector(".narrative-wrapper") as HTMLElement;

    if (narrativeTrack && narrativeWrapper) {
      // Calculate the correct scroll amount
      // We need to wait for layout or force a calculation.
      // Usually simple calculation is enough if font loaded.

      const getScrollDist = () => -(narrativeTrack.scrollWidth - window.innerWidth);

      gsap.to(narrativeTrack, {
        x: getScrollDist,
        ease: "none",
        scrollTrigger: {
          trigger: narrativeWrapper,
          start: "top top",
          end: () => `+=${narrativeTrack.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // Animate individual words/icons within the track for extra flair
      gsap.utils.toArray(".narrative-item").forEach((item: any) => {
        gsap.from(item, {
          opacity: 0.3,
          y: 50,
          scale: 0.9,
          scrollTrigger: {
            trigger: item,
            containerAnimation: gsap.getTweensOf(narrativeTrack)[0],
            start: "left 80%",
            end: "center center",
            scrub: true,
          }
        });
      });
    }

    // Features Horizontal Scroll with Card Tilt
    const races = containerRef.current?.querySelector(".races") as HTMLElement;
    const racesWrapper = containerRef.current?.querySelector(".races-wrapper") as HTMLElement;

    if (races && racesWrapper) {
      function getScrollAmount() {
        return -(races.scrollWidth - window.innerWidth);
      }

      const tween = gsap.to(races, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: racesWrapper,
          start: "top top",
          end: () => `+=${races.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      const cards = gsap.utils.toArray(".feature-card");
      cards.forEach((card: any, i) => {
        gsap.from(card, {
          rotateY: 45,
          opacity: 0.5,
          scale: 0.8,
          scrollTrigger: {
            containerAnimation: tween,
            trigger: card,
            start: "left center+=200",
            end: "center center",
            scrub: true,
            id: `card-${i}`
          }
        });
      });

      ScrollTrigger.refresh();
    }

    // Parallax Images & Skeuomorphic depth
    gsap.utils.toArray(".parallax-container").forEach((container: any) => {
      const img = container.querySelector("img");
      if (img) {
        gsap.to(img, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    });

    // Bouncy Text Reveal
    gsap.utils.toArray(".reveal-text").forEach((text: any) => {
      gsap.from(text, {
        opacity: 0,
        y: 100,
        rotate: 5,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: text,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Showcase Image Animation
    const showcaseImgInfo = containerRef.current?.querySelector('.showcase-image');
    if (showcaseImgInfo) {
      gsap.fromTo(showcaseImgInfo,
        {
          scale: 0.8,
          opacity: 0,
          rotateX: 20,
          y: 100
        },
        {
          scale: 1,
          opacity: 1,
          rotateX: 0,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: showcaseImgInfo,
            start: "top 75%",
            end: "center center",
            scrub: 1,
            toggleActions: "play reverse play reverse"
          }
        }
      );
    }

    // Floating shapes animation
    gsap.to(".floating-shape", {
      y: "random(-20, 20)",
      rotation: "random(-10, 10)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });

    // Stamp rotation
    gsap.to(".stamp-rotate", {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "linear"
    });

    // Force refresh on load to ensure accurate start positions
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  });

  return (
    <div ref={containerRef} className="bg-[#E1D9C5] text-[#050505] min-h-screen font-sans selection:bg-[#FF4D00] selection:text-white overflow-x-hidden relative cursor-none">

      {/* Custom Cursor */}
      <div className="custom-cursor fixed top-0 left-0 w-4 h-4 bg-[#FF4D00] rounded-full pointer-events-none z-[9999] mix-blend-exclusion hidden md:block"></div>
      <div className="custom-cursor-ring fixed top-0 left-0 w-10 h-10 border border-[#FF4D00] rounded-full pointer-events-none z-[9998] mix-blend-exclusion opacity-50 hidden md:block"></div>

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center mix-blend-exclusion text-[#E1D9C5]">
        <div className="text-3xl font-black tracking-tighter uppercase font-display italic">Zon</div>
        <div className="hidden md:flex items-center gap-8 font-medium tracking-wide text-sm uppercase">
          {['Features', 'Screens', 'Manifesto', 'Download'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#FF4D00] transition-colors underline-offset-4 decoration-2">{item}</a>
          ))}
        </div>
        <button
          onClick={() => window.open('https://github.com/vrn7712/Zon/releases', '_blank')}
          className="px-6 py-2 rounded-full border border-[#E1D9C5] bg-[#E1D9C5] text-black font-bold text-sm hover:bg-[#FF4D00] hover:border-[#FF4D00] hover:text-white hover:scale-105 transition-all uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] active:translate-y-1 active:shadow-none cursor-pointer"
        >
          Get App
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#E1D9C5] text-[#050505]">

        {/* Technical Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        {/* Big Abstract Background Elements */}
        <div className="hero-bg-elem absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vh] h-[90vh] rounded-full border-[1px] border-black/10 z-0"></div>
        <div className="hero-bg-elem absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] rounded-full border-[1px] border-black/10 z-0"></div>
        <div className="hero-bg-elem absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] rounded-full border-[1px] border-[#FF4D00]/10 z-0 animate-pulse"></div>

        {/* Decorative Stamp */}
        <div className="absolute top-[15%] right-[5%] md:right-[15%] z-10 hidden md:block">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="stamp-rotate absolute w-full h-full text-black" viewBox="0 0 100 100">
              <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
              <text className="text-[10px] font-bold uppercase tracking-[0.2em]" fill="currentColor">
                <textPath href="#curve">
                  • Est. 2025 • Focus Operating System
                </textPath>
              </text>
            </svg>
            <div className="w-16 h-16 bg-[#FF4D00] rounded-full flex items-center justify-center text-white font-black text-2xl">Z</div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="hero-floater absolute top-[25%] left-[10%] w-24 h-24 bg-black/5 backdrop-blur-sm border border-black/10 z-10 floating-shape flex items-center justify-center rounded-2xl rotate-12">
          <Clock size={32} strokeWidth={1.5} className="opacity-50" />
        </div>
        <div className="hero-floater-2 absolute bottom-[20%] right-[10%] w-32 h-32 bg-[#FF4D00]/10 backdrop-blur-sm border border-[#FF4D00]/20 z-10 floating-shape flex items-center justify-center rounded-full">
          <Music size={40} className="text-[#FF4D00] opacity-80" />
        </div>

        <div className="z-20 text-center flex flex-col items-center relative">
          {/* Tagline - Fixed position to avoid overlap */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1 rounded-full border border-black/20 bg-white/30 backdrop-blur-md text-xs font-bold uppercase tracking-widest animate-fade-in-up z-30">
            <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse"></span>
            <span>Version 1.0.0 Flow Now Available</span>
          </div>

          {/* Main Title */}
          <div className="relative mb-8 p-4 md:p-12">
            <h1 className="text-[20vw] md:text-[22vw] leading-[0.75] font-extrabold tracking-tighter font-display uppercase text-black mix-blend-normal whitespace-nowrap drop-shadow-[4px_4px_0px_rgba(255,77,0,0.2)]">
              {['Z', 'O', 'N'].map((char, i) => (
                <span key={i} className="char-reveal inline-block hover:text-[#FF4D00] transition-colors duration-300 cursor-default transform hover:-translate-y-4 hover:rotate-3">{char}</span>
              ))}
            </h1>

            {/* Decorative Absolute Text */}
            <div className="hidden md:block absolute top-10 right-0 text-left">
              <div className="text-xs font-mono border-l-2 border-[#FF4D00] pl-2 mb-2">
                LAT: 40.7128° N<br />LON: 74.0060° W
              </div>
              <div className="text-xs font-mono border-l-2 border-black pl-2">
                SYS: ACTIVE<br />MOD: FOCUS
              </div>
            </div>
          </div>

          {/* Glass Card */}
          <div className="hero-glass-card relative backdrop-blur-xl bg-white/40 border border-white/60 p-8 rounded-3xl max-w-xl mx-auto skew-elem shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(255,77,0,0.2)] transition-shadow">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold animate-bounce shadow-lg z-20">
              <Zap size={20} fill="#FF4D00" stroke="none" />
            </div>

            <p className="text-xl md:text-2xl font-light tracking-wide text-black text-center leading-relaxed">
              Enter the <span className="font-bold italic text-[#FF4D00] bg-black/5 px-2 rounded-lg">Zone</span>.<br />
              <span className="text-base opacity-70 mt-2 block font-mono">
                The operating system for your attention.
              </span>
            </p>
          </div>

          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="hero-btn mt-16 group relative px-10 py-5 bg-black text-[#E1D9C5] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#FF4D00]"
          >
            <span className="relative z-10 font-bold uppercase tracking-wider flex items-center gap-3 text-lg">
              {isHovered ? <Play fill="#E1D9C5" size={20} /> : <ArrowRight size={20} />}
              Start Session
            </span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <div className="w-[1px] h-12 bg-black"></div>
          <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* Tilted Marquee Section */}
      <section className="py-12 bg-[#FF4D00] text-white overflow-hidden relative z-20 -mt-10 origin-top-left -rotate-2 scale-110 shadow-xl border-y-4 border-black">
        <div className="marquee-inner flex items-center gap-12 text-7xl font-black uppercase font-display tracking-tighter">
          {Array(8).fill("Get In The Zone • Stay Focused • ").map((text, i) => (
            <span key={i} className="whitespace-nowrap">{text}</span>
          ))}
        </div>
      </section>

      <section className="py-8 bg-black text-[#FF4D00] overflow-hidden relative z-10 -mt-4 origin-top-right rotate-1 scale-110 border-b-4 border-[#FF4D00]">
        <div className="marquee-inner-reverse flex items-center gap-12 text-5xl font-black uppercase font-display tracking-tighter opacity-80">
          {Array(8).fill("Built-in Music • Custom Widgets • ").map((text, i) => (
            <span key={i} className="whitespace-nowrap stroke-text">{text}</span>
          ))}
        </div>
      </section>

      {/* NEW SECTION: Horizontal Narrative Flow */}
      <section className="narrative-wrapper h-screen bg-black text-[#E1D9C5] overflow-hidden flex items-center relative z-20">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,77,0,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute bottom-10 left-10 text-xs font-mono opacity-30">SCROLL TO READ</div>

        <div className="narrative-track flex items-center pl-[10vw] pr-[10vw] md:pl-[20vw] md:pr-[20vw] gap-12 md:gap-24 w-max">

          <div className="narrative-item flex items-center gap-6">
            <span className="text-6xl md:text-9xl font-black font-display uppercase tracking-tight whitespace-nowrap">Build Your Zone</span>
            <div className="w-24 h-24 bg-[#FF4D00] rounded-full flex items-center justify-center animate-pulse">
              <Layout size={40} className="text-white" />
            </div>
          </div>

          <div className="narrative-item">
            <svg width="120" height="20" className="stroke-[#E1D9C5]" viewBox="0 0 120 20">
              <path d="M0,10 Q60,-10 120,10" fill="none" strokeWidth="4" />
            </svg>
          </div>

          <div className="narrative-item flex items-center gap-6">
            <span className="text-5xl md:text-8xl font-bold font-display tracking-tight text-white/90 whitespace-nowrap">The moment the timer starts,</span>
            <Clock size={60} className="text-[#FF4D00] animate-spin-slow" />
          </div>

          <div className="narrative-item flex items-center gap-6">
            <div className="w-px h-32 bg-[#FF4D00]/50"></div>
            <span className="text-6xl md:text-9xl font-black font-display uppercase tracking-tight text-[#FF4D00] whitespace-nowrap">the world stops</span>
            <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-white rounded-full flex items-center justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="narrative-item">
            <ArrowRight size={80} className="text-white/50" />
          </div>

          <div className="narrative-item flex items-center gap-8">
            <span className="text-5xl md:text-8xl font-bold font-display tracking-tight text-white/90 whitespace-nowrap">you are no longer</span>
            <span className="text-5xl md:text-8xl font-black font-display tracking-tight text-white line-through decoration-[#FF4D00] decoration-8 whitespace-nowrap">just tracking time,</span>
          </div>

          <div className="narrative-item flex items-center justify-center w-40 h-40 bg-[#111] border border-[#333] rounded-full">
            <Shield size={60} className="text-[#E1D9C5]" />
          </div>

          <div className="narrative-item flex items-center gap-6">
            <span className="text-6xl md:text-9xl font-black font-display uppercase tracking-tight whitespace-nowrap">you are <span className="text-[#FF4D00] italic">defending</span> it.</span>
            <Lock size={80} className="text-[#FF4D00]" />
          </div>

          <div className="narrative-item w-[50vw]"></div>
        </div>
      </section>

      {/* Uneven About Section */}
      <section id="manifesto" className="py-40 px-6 md:px-12 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row gap-16 relative">
          <div className="w-full md:w-1/2 z-10 pt-20">
            <h2 className="reveal-text text-6xl md:text-8xl font-black mb-12 font-display leading-[0.8] mix-blend-difference skew-elem">
              PURE<br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D00] to-black" style={{ WebkitTextStroke: '1px black' }}>FOCUS</span>
            </h2>

            <div className="glass-panel p-8 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_#FF4D00] transition-shadow duration-300 reveal-text skew-elem">
              <p className="text-xl font-medium leading-relaxed mb-6">
                Zon isn't just a timer. It's a complete operating system for your attention. Now with curated focus music and interactive widgets.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-black rounded-full text-[#E1D9C5]">
                  <Music size={16} />
                  <span className="font-bold uppercase tracking-widest text-xs">Focus Music</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#FF4D00] rounded-full text-white">
                  <Layout size={16} />
                  <span className="font-bold uppercase tracking-widest text-xs">Widgets</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 md:absolute md:right-0 md:top-0 h-[800px] parallax-container rounded-[3rem] overflow-hidden border-4 border-black shadow-2xl skew-elem origin-bottom-right rotate-2 hover:rotate-0 transition-transform duration-700">
            <img
              src={pureFocusImg}
              alt="Zen workspace"
              className="w-full h-[120%] object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute bottom-10 left-10 p-6 bg-[#FF4D00] text-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-mono text-xs uppercase mb-2 opacity-80">Now Playing</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center animate-spin-slow">
                  <Music size={16} />
                </div>
                <div>
                  <div className="font-bold font-display leading-none text-lg">Deep Flow</div>
                  <div className="text-xs opacity-70">Binaural Beats</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Features - Skeuomorphic Cards */}
      <section id="features" className="races-wrapper h-screen overflow-hidden bg-[#050505] text-[#E1D9C5] relative z-20">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#E1D9C5] to-transparent z-10 pointer-events-none opacity-10"></div>

        <div className="races flex h-full items-center pl-10 md:pl-32 bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)] bg-[length:20px_20px] w-max">
          <div className="min-w-[40vw] pr-20 relative">
            <h2 className="text-6xl md:text-[10rem] font-black font-display leading-none text-white mix-blend-difference">
              THE<br /><span className="text-[#FF4D00]">ZON</span> KIT
            </h2>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-[#FF4D00] rounded-full absolute -top-4 -right-4 md:-top-10 md:-right-10 flex items-center justify-center animate-spin-slow">
              <Layout size={40} fill="white" className="text-white" />
            </div>
          </div>

          {[
            { title: "POMODORO FOCUS", icon: Timer, desc: "Intervals that adapt to your flow.", color: "#E1D9C5" },
            { title: "Focus Music", icon: Music, desc: "Built-in focus music or Choose Your Own.", color: "#FF4D00" },
            { title: "Live Widgets", icon: Layout, desc: "Control Zon from your Home Screen.", color: "#E1D9C5" },
            { title: "DEEP ANALYTICS", icon: Zap, desc: "Beautiful Insights that matter.", color: "#E1D9C5" },
            { title: "Interactive Notifications", icon: Bell, desc: "Actionable & Interactive alerts.", color: "#E1D9C5" },
            { title: "Now Bar", icon: Smartphone, desc: "Instructions to set up the Now Bar on Samsung.", color: "#FF4D00" },
            { title: "Tasks", icon: ListTodo, desc: "Add tasks to your list according to priority.", color: "#E1D9C5" },
            { title: "Customization", icon: Palette, desc: "Customize the Appearance of the app all you want.", color: "#E1D9C5" },
          ].map((feature, i) => (
            <div key={i} className="feature-card w-[85vw] md:w-[400px] flex-shrink-0 aspect-[3/4] bg-[#111] border border-[#333] rounded-3xl p-8 mr-6 md:mr-12 flex flex-col justify-between relative overflow-hidden group hover:border-[#FF4D00] transition-colors shadow-2xl">
              {/* Skeuomorphic inner shadow/highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none rounded-3xl"></div>

              <div className="relative z-10">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] mb-8 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color === '#FF4D00' ? 'text-white' : 'text-black'}`} />
                </div>
                <h3 className="text-3xl font-bold font-display mb-4 leading-tight">{feature.title}</h3>
                <p className="text-lg opacity-60 font-light">{feature.desc}</p>
              </div>

              <div className="text-[10rem] font-black absolute -bottom-10 -right-10 opacity-5 text-[#222] group-hover:text-[#FF4D00]/10 transition-colors pointer-events-none select-none">
                {i + 1}
              </div>
            </div>
          ))}

          <div className="min-w-[50vw]"></div>
        </div>
      </section>

      {/* NEW: Screenshots Showcase Section */}
      <section id="screens" className="gallery-section py-40 px-6 bg-[#E1D9C5] relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-block px-4 py-1 rounded-full border border-black text-xs font-bold uppercase tracking-widest mb-4 bg-[#FF4D00] text-white">
              Interface
            </div>
            <h2 className="text-5xl md:text-8xl font-black font-display text-black mb-6">
              DESIGNED FOR <span className="text-[#FF4D00]">FLOW</span>
            </h2>
            <p className="max-w-xl mx-auto text-xl text-gray-700">
              A minimalist interface that disappears when you need to focus, and comes alive when you need control.
            </p>
          </div>

          <div className="flex justify-center perspective-[2000px]">
            <div className="showcase-image relative w-full max-w-5xl rounded-[2.5rem] overflow-hidden border-[8px] border-black shadow-2xl skew-elem origin-bottom hover:scale-[1.02] transition-transform duration-500">
              <img src={showcaseImg} alt="App Showcase" className="w-full h-auto object-cover" />
              {/* Reflection/Sheen effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout Section - Broken Grid */}
      <section className="py-40 px-6 bg-[#E1D9C5] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-24">
            <h2 className="reveal-text text-5xl md:text-7xl font-bold font-display text-black">
              HOW IT<br />WORKS
            </h2>
            <p className="hidden md:block max-w-sm text-right font-medium reveal-text">
              A simple three-step process to reclaim your attention span.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Select", text: "Your task. Commit to it.", mt: "0", icon: Check },
              { step: "02", title: "Focus", text: "25 minutes. Set your Pomodoro Timer.", mt: "100px", icon: Timer },
              { step: "03", title: "Rest", text: "5 minutes. Recharge your brain.", mt: "50px", icon: Zap },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal-text group relative bg-white border-2 border-black p-8 rounded-[2rem] hover:-translate-y-4 hover:shadow-[10px_10px_0px_0px_#FF4D00] transition-all duration-300"
                style={{ marginTop: window.innerWidth > 768 ? item.mt : '0' }}
              >
                <div className="absolute -top-6 left-8 bg-black text-[#E1D9C5] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border border-[#E1D9C5] group-hover:bg-[#FF4D00] group-hover:text-white transition-colors">
                  Step {item.step}
                </div>

                <div className="mt-6 h-40 flex items-center justify-center border-b border-dashed border-gray-300 mb-6 group-hover:border-[#FF4D00] transition-colors">
                  <item.icon size={60} strokeWidth={1} className="group-hover:scale-125 transition-transform duration-500 group-hover:text-[#FF4D00]" />
                </div>

                <h3 className="text-3xl font-bold mb-3 font-display">{item.title}</h3>
                <p className="font-medium text-gray-500 group-hover:text-black transition-colors">{item.text}</p>

                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full border border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA - Skeuomorphic & Glass */}
      <section id="download" className="min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden bg-[#050505] text-[#E1D9C5] p-6">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,77,0,0.3),_#050505_80%)]"></div>
        <div className="absolute w-[800px] h-[800px] bg-[#FF4D00] rounded-full blur-[150px] opacity-10 animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <div className="z-10 w-full max-w-4xl relative">
          <div className="glass-panel backdrop-blur-xl bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl reveal-text">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent opacity-80"></div>

            <h2 className="text-[3rem] md:text-[8rem] font-black font-display leading-[0.9] tracking-tighter mb-8 mix-blend-overlay text-white">
              START<br />NOW
            </h2>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12 relative z-20">
              <button
                onClick={() => window.open('https://github.com/vrn7712/Zon/releases', '_blank')}
                className="group relative px-12 py-6 bg-[#FF4D00] text-white text-xl rounded-2xl font-black uppercase tracking-wide hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,77,0,0.4)] overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <span className="relative flex items-center gap-3">
                  Download Zon <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
              </button>

              <button onClick={() => window.open('https://github.com/vrn7712/Zon', '_blank')} className="px-12 py-6 border-2 border-[#E1D9C5]/30 text-[#E1D9C5] text-xl rounded-2xl font-bold uppercase tracking-wide hover:bg-[#FF4D00] hover:text-white hover:border-[#FF4D00] transition-all cursor-pointer">
                GitHub Repo
              </button>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-sm font-mono opacity-40">
              <span>V1.0.0 Flow</span>
              <span>OPEN SOURCE</span>
              <span>GPL-3.0 LICENSE</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center px-10 text-xs font-bold uppercase tracking-widest opacity-30 mix-blend-difference">
          <span>© 2025 Zon App</span>
        </div>
      </section>

      <style>{`
        .font-display {
          font-family: 'Syne', sans-serif;
        }
        
        .stroke-text {
          -webkit-text-stroke: 1px #FF4D00;
          color: transparent;
        }
        
        .perspective-2000 {
          perspective: 2000px;
        }
        
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default ZonLandingPage;