"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';

interface ExpandableCardProps {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
}

export default function ExpandableProfileCard({
  imageSrc = "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000",
  title = "Jane Doe",
  subtitle = "Senior UX Designer",
  content
}: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const layoutId = `expandable-profile-card-${title}`;

  useEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
      if (event.key === 'Tab') {
        const controls = closeRef.current?.closest('[role="dialog"]')?.querySelectorAll<HTMLElement>('button, a[href]');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <>
      <div className="w-full max-w-100">
      <motion.button
        ref={triggerRef}
        type="button"
        aria-label={`About ${title}`}
        aria-haspopup="dialog"
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer relative h-[380px] w-full max-w-100 overflow-hidden rounded-xl border border-border group text-left shadow-sm sm:h-[460px] lg:h-[520px]"
        whileHover="hover"
      >
        <motion.img 
          layoutId={`image-${layoutId}`} 
          src={imageSrc} 
          alt={title}
          className="absolute inset-0 h-full w-full object-cover" 
          variants={{
            hover: { scale: 1.05 }
          }}
        />
      </motion.button>
      <div className="mt-5 w-full text-center">
        <h3 className="text-[clamp(32px,3.2vw,46px)] font-extrabold leading-tight tracking-[-0.02em] text-foreground">{title}</h3>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-brand-accent sm:text-base">{subtitle}</p>
      </div>
      </div>

        {isOpen && createPortal(
          <div role="dialog" aria-modal="true" aria-label={`About ${title}`} className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              layoutId={layoutId}
              className="relative w-full max-w-4xl h-[80vh] bg-card rounded-2xl overflow-hidden border border-border z-10 flex flex-col md:flex-row shadow-xl"
            >
              <button 
                ref={closeRef}
                type="button"
                aria-label="Close profile"
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center bg-background/50 hover:bg-accent rounded-full border border-border text-foreground transition-colors backdrop-blur-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              
              <div className="relative h-64 w-full shrink-0 overflow-hidden md:h-full md:w-1/2">
                <motion.img 
                  layoutId={`image-${layoutId}`} 
                  src={imageSrc} 
                  alt={title}
                  className="h-full w-full object-cover" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:hidden" />
              </div>
              
              <div className="p-6 sm:p-8 w-full md:w-1/2 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <motion.p layoutId={`subtitle-${layoutId}`} className="text-white text-xs font-medium tracking-wide uppercase mb-3">{subtitle}</motion.p>
                <motion.h3 layoutId={`title-${layoutId}`} className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-6 pb-4 border-b border-border">{title}</motion.h3>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: 0.2 }}
                  className="text-foreground/80 text-sm leading-relaxed grow"
                >
                  {content || (
                    <div className="flex flex-col gap-6">
                      <p>A passionate UX/UI designer with over 8 years of experience creating intuitive digital products. I specialize in bridging the gap between complex systems and user-friendly interfaces.</p>
                      
                      <div>
                        <h4 className="text-foreground font-semibold tracking-tight mb-2">Background</h4>
                        <p className="text-muted-foreground">Previously led design teams at top fintech startups, focusing on accessibility, seamless transactions, and inclusive design.</p>
                      </div>

                      <div>
                        <h4 className="text-foreground font-semibold tracking-tight mb-2">Current Focus</h4>
                        <p className="text-muted-foreground">Currently exploring the intersection of AI and user experience, building tools that empower creators and simplify daily workflows.</p>
                      </div>
                      
                      <button className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity self-start shadow-sm">
                        Connect with Jane
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>, document.body
        )}
    </>
  );
}
