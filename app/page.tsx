'use client';

import { useEffect, useRef } from 'react';

export default function Home() {
  const l1Ref = useRef<HTMLSpanElement>(null);
  const l2Ref = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const soonRef = useRef<HTMLParagraphElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const fMsgRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz8KHi--vdFZchafNQg8ePwIH8i0X_gZ8uix0KhfehaRHyIMbfyfk-vAJuLgoo7P3M/exec";
    const line1 = "Tout le monde t'a dit que ton projet était bien.";
    const line2 = "Et s'ils t'avaient tous menti ?";
    const STORAGE_KEY = 'dismantle_submitted';

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    const fadeIn = (el: HTMLElement, duration: number) =>
      new Promise<void>(r => {
        el.style.animation = `fadein ${duration}ms ease forwards`;
        setTimeout(r, duration);
      });

    const fadeOut = (el: HTMLElement, duration: number) =>
      new Promise<void>(r => {
        el.style.animation = `fadeout ${duration}ms ease forwards`;
        setTimeout(r, duration);
      });

    const flickerLetter = (el: HTMLElement) =>
      new Promise<void>(r => {
        el.style.animation = 'flicker-in 1.1s ease forwards';
        setTimeout(r, 1100);
      });

    const typeText = async (el: HTMLElement, text: string, speed: number) => {
      for (let i = 0; i < text.length; i++) {
        el.textContent += text[i];
        await wait(speed);
      }
    };

    const isAlreadySubmitted = (email: string) => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return stored.includes(email.toLowerCase());
      } catch { return false; }
    };

    const markAsSubmitted = (email: string) => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        stored.push(email.toLowerCase());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch {}
    };

    const run = async () => {
      await wait(400);
      const letters = document.querySelectorAll<HTMLElement>('.t-letter');
      for (let i = 0; i < letters.length; i++) {
        flickerLetter(letters[i]);
        await wait(140);
      }
      await wait(900);

      if (barsRef.current) {
        barsRef.current.innerHTML = '<div class="bar1"></div><div class="bar2"></div>';
        await fadeIn(barsRef.current, 250);
      }
      await wait(200);

      if (l1Ref.current) await typeText(l1Ref.current, line1, 34);
      await wait(250);
      if (l2Ref.current) await typeText(l2Ref.current, line2, 40);
      await wait(350);

      if (soonRef.current) await fadeIn(soonRef.current, 400);
      await wait(250);
      if (formWrapRef.current) await fadeIn(formWrapRef.current, 250);

      submitBtnRef.current?.addEventListener('click', async () => {
        const email = emailInputRef.current?.value.trim() || '';
        if (!email || !email.includes('@')) {
          emailInputRef.current?.classList.add('error');
          return;
        }
        emailInputRef.current?.classList.remove('error');

        if (isAlreadySubmitted(email)) {
          if (fMsgRef.current) {
            fMsgRef.current.classList.add('duplicate');
            fMsgRef.current.textContent = 'Cet email est déjà enregistré.';
          }
          return;
        }

        if (submitBtnRef.current) {
          submitBtnRef.current.disabled = true;
          submitBtnRef.current.textContent = '...';
        }

        try {
          await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          markAsSubmitted(email);
        } catch {}

        if (formWrapRef.current) {
          await fadeOut(formWrapRef.current, 200);
          formWrapRef.current.style.display = 'none';
        }
        await wait(100);
        if (confirmRef.current) await fadeIn(confirmRef.current, 400);
      });
    };

    run();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body {
          background: #060809;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          overflow: hidden;
        }
        .scan {
          position: fixed; inset: 0;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.011) 3px, rgba(255,255,255,0.011) 4px);
          pointer-events: none; z-index: 0;
        }
        .glow {
          position: fixed; top: 42%; left: 50%; transform: translate(-50%, -50%);
          width: 520px; height: 380px;
          background: radial-gradient(ellipse, rgba(140,180,255,0.04) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .corner { position: fixed; width: 20px; height: 20px; z-index: 1; }
        .corner.tl { top: 1.5rem; left: 1.5rem; border-top: 1px solid #1e2a38; border-left: 1px solid #1e2a38; }
        .corner.tr { top: 1.5rem; right: 1.5rem; border-top: 1px solid #1e2a38; border-right: 1px solid #1e2a38; }
        .corner.bl { bottom: 1.5rem; left: 1.5rem; border-bottom: 1px solid #1e2a38; border-left: 1px solid #1e2a38; }
        .corner.br { bottom: 1.5rem; right: 1.5rem; border-bottom: 1px solid #1e2a38; border-right: 1px solid #1e2a38; }
        .privacy-link {
          position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
          font-size: 9px; color: #1e2a38; letter-spacing: 0.2em; text-decoration: none; z-index: 2; transition: color 0.15s;
        }
        .privacy-link:hover { color: #3a5060; }
        .content {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 3rem 2rem; position: relative; z-index: 1; width: 100%; max-width: 680px;
        }
        .title-wrap { display: flex; gap: 2px; margin-bottom: 0; }
        .t-letter {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(72px, 15vw, 118px);
          font-weight: 700; color: #e8edf2; line-height: 1; display: inline-block; opacity: 0;
          letter-spacing: 0.06em;
          text-shadow: 3px 4px 0px rgba(30,60,120,0.85), 5px 6px 0px rgba(15,35,80,0.4);
        }
        .bars { width: 100%; max-width: 440px; margin: 2.6rem auto 2.2rem; opacity: 0; }
        .bar1 { height: 2px; background: #1a2535; }
        .bar2 { height: 1px; background: #111820; margin-top: 3px; }
        .text-block { text-align: center; min-height: 64px; margin-bottom: 1.8rem; max-width: 440px; width: 100%; }
        .l1 { font-size: 14px; color: #3a5060; line-height: 2; letter-spacing: 0.04em; display: block; min-height: 28px; }
        .l2 { font-size: 15px; color: #8fa0b0; display: block; margin-top: 6px; letter-spacing: 0.04em; min-height: 24px; }
        .soon { font-size: 10px; color: #2a3a4a; letter-spacing: 0.3em; text-align: center; margin-bottom: 1.8rem; opacity: 0; }
        .form-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; max-width: 320px; opacity: 0; }
        .f-input {
          width: 100%; background: #0a0d10; border: 1px solid #1a2028; color: #e8edf2;
          padding: 11px 14px; font-family: 'DM Mono', monospace; font-size: 12px; outline: none;
        }
        .f-input::placeholder { color: #1e2a38; }
        .f-input.error { border-color: #2a3a5a; }
        .f-btn {
          width: 100%; background: #e8edf2; color: #060809; border: 1px solid #e8edf2;
          padding: 11px 0; font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 20px;
          letter-spacing: 0.12em; cursor: pointer; transition: background 0.15s, color 0.15s;
        }
        .f-btn:hover { background: transparent; color: #e8edf2; }
        .f-btn:disabled { opacity: 0.5; cursor: default; }
        .f-msg { font-size: 10px; color: #2a3a4a; letter-spacing: 0.1em; text-align: center; min-height: 16px; }
        .f-msg.duplicate { color: #3a5060; }
        .confirm { text-align: center; opacity: 0; }
        .confirm-txt { font-size: 13px; color: #8fa0b0; letter-spacing: 0.08em; display: block; margin-bottom: 4px; }
        .confirm-sub { font-size: 10px; color: #2a3a4a; letter-spacing: 0.2em; }
        @keyframes flicker-in {
          0% { opacity: 0; } 6% { opacity: 1; } 10% { opacity: 0; } 16% { opacity: 1; }
          20% { opacity: 0; } 27% { opacity: 0.9; } 32% { opacity: 0; } 42% { opacity: 1; }
          46% { opacity: 0.2; } 54% { opacity: 1; } 100% { opacity: 1; }
        }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeout { from { opacity: 1; } to { opacity: 0; } }
      `}</style>

      <div className="scan" />
      <div className="glow" />
      <div className="corner tl" />
      <div className="corner tr" />
      <div className="corner bl" />
      <div className="corner br" />

      <a href="/privacy" className="privacy-link">POLITIQUE DE CONFIDENTIALITÉ</a>

      <div className="content">
        <div className="title-wrap">
          {'DISMANTLE'.split('').map((letter, i) => (
            <span key={i} className="t-letter">{letter}</span>
          ))}
        </div>

        <div className="bars" ref={barsRef} />

        <div className="text-block">
          <span className="l1" ref={l1Ref} />
          <span className="l2" ref={l2Ref} />
        </div>

        <p className="soon" ref={soonRef}>— BIENTÔT DISPONIBLE —</p>

        <div className="form-wrap" ref={formWrapRef}>
          <input className="f-input" type="email" placeholder="email@domaine.com" ref={emailInputRef} />
          <button className="f-btn" ref={submitBtnRef}>PRÊT(E)</button>
          <span className="f-msg" ref={fMsgRef} />
        </div>

        <div className="confirm" ref={confirmRef}>
          <span className="confirm-txt">Noté. Tu seras prévenu(e).</span>
          <span className="confirm-sub">— DISMANTLE —</span>
        </div>
      </div>
    </>
  );
}