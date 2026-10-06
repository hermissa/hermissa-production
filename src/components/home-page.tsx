import { Link } from "@tanstack/react-router";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import heroImg from "@/assets/hero.jpg";
import hmLogoImg from "@/assets/hm-logo.png";
import wordmarkImg from "@/assets/hermissa-wordmark.png";
import about from "@/assets/about.jpg";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";
import work6 from "@/assets/work-6.jpg";
import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta3 from "@/assets/insta-3.jpg";
import insta4 from "@/assets/insta-4.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta6 from "@/assets/insta-6.jpg";

export type Lang = "de" | "en";

const STRINGS = {
  de: {
    nav: [
      { label: "Portfolio", href: "#portfolio" },
      { label: "Über mich", href: "#ueber-mich" },
      { label: "Kontakt", href: "#kontakt" },
    ],
    menuOpen: "Menü öffnen",
    menuClose: "Menü schliessen",
    switchLabel: "Switch to English",
    selectedWork: "Ausgewählte Arbeiten",
    follow: "HERMISSA auf Instagram folgen",
    moreInsta: "Mehr auf Instagram",
    aboutOver: "Über mich",
    aboutP1:
      "Based in Switzerland arbeite ich zwischen Beauty, Commercial und Editorial — von backstage an Fashion Shows über Kampagnen-Shootings bis zu Cover-Looks. Meine Arbeit lebt von präziser Haut-Optik, Leuchtkraft und Looks, die unter Scheinwerfern und durch die Linse bestehen.",
    aboutP2:
      "Ob Runway mit engem Zeitfenster, Set mit wechselnden Lichtsituationen oder ein Editorial mit klarer Vision — ich bringe Ruhe, Tempo und einen sicheren Blick fürs Gesamtbild mit.",
    contactOver: "Kontakt",
    contactH1: "Lass uns",
    contactH2: "zusammen",
    contactH3: "arbeiten",
    thanks1: "Ich freue mich von Ihnen zu hören und",
    thanks2: "melde mich so schnell wie möglich zurück.",
    namePh: "Dein Name",
    emailPh: "name@beispiel.ch",
    phone: "Telefon (optional)",
    message: "Nachricht",
    messagePh: "Erzähl mir kurz von deinem Projekt, Datum & Ort …",
    sending: "Wird gesendet …",
    send: "Anfrage senden",
    errInput:
      "Bitte überprüfe deine Angaben (Name, gültige E-Mail, Telefon nur mit Ziffern und Nachricht).",
    errConfig:
      "Das Formular ist noch nicht fertig eingerichtet. Bitte schreib direkt an melissa@hermissa.ch.",
    errSend:
      "Die Nachricht konnte leider nicht gesendet werden. Bitte versuche es später erneut oder schreib direkt an melissa@hermissa.ch.",
    errNet:
      "Keine Verbindung möglich. Bitte prüfe deine Internetverbindung und versuche es erneut.",
    waChat: "Per WhatsApp chatten",
    monogram: "HERMISSA HM Monogramm",
  },
  en: {
    nav: [
      { label: "Portfolio", href: "#portfolio" },
      { label: "About", href: "#ueber-mich" },
      { label: "Contact", href: "#kontakt" },
    ],
    menuOpen: "Open menu",
    menuClose: "Close menu",
    switchLabel: "Auf Deutsch wechseln",
    selectedWork: "Selected Work",
    follow: "Follow HERMISSA on Instagram",
    moreInsta: "More on Instagram",
    aboutOver: "About me",
    aboutP1:
      "Based in Switzerland, I work across beauty, commercial and editorial — from backstage at fashion shows to campaign shoots and cover looks. My work is defined by precise skin, radiance and looks that hold up under spotlights and through the lens.",
    aboutP2:
      "Whether it's a runway with a tight schedule, a set with changing light or an editorial with a clear vision — I bring calm, speed and a confident eye for the bigger picture.",
    contactOver: "Contact",
    contactH1: "Let's work",
    contactH2: "",
    contactH3: "together",
    thanks1: "I look forward to hearing from you and",
    thanks2: "will get back to you as soon as possible.",
    namePh: "Your name",
    emailPh: "name@example.com",
    phone: "Phone (optional)",
    message: "Message",
    messagePh: "Tell me briefly about your project, date & location …",
    sending: "Sending …",
    send: "Send request",
    errInput:
      "Please check your details (name, valid email, phone with digits only, and message).",
    errConfig:
      "The form isn't fully set up yet. Please write directly to melissa@hermissa.ch.",
    errSend:
      "Your message couldn't be sent. Please try again later or write directly to melissa@hermissa.ch.",
    errNet: "No connection. Please check your internet connection and try again.",
    waChat: "Chat on WhatsApp",
    monogram: "HERMISSA HM monogram",
  },
} as const;

const LangContext = createContext<Lang>("de");
const useT = () => STRINGS[useContext(LangContext)];

function LangSwitch({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  const lang = useContext(LangContext);
  const t = STRINGS[lang];
  return (
    <Link
      to={lang === "de" ? "/en" : "/"}
      onClick={onClick}
      aria-label={t.switchLabel}
      className={`text-base font-light tracking-[0.28em] uppercase text-primary transition-opacity hover:opacity-70 ${className}`}
    >
      {lang === "de" ? "EN" : "DE"}
    </Link>
  );
}

const WORKS = [
  { src: work1, title: "Golden Hour Beauty", tag: "Beauty" },
  { src: work2, title: "Backstage Prep", tag: "Fashion Week" },
  { src: work3, title: "Graphic Liner", tag: "Editorial" },
  { src: work4, title: "Monochrome", tag: "Editorial" },
  { src: work5, title: "Berry Couture", tag: "Beauty" },
  { src: work6, title: "The Show", tag: "Fashion Week" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.unobserve(element);
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Nav() {
  const t = useT();
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < 40);
      if (window.scrollY >= 40) setOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`nav-blur fixed inset-x-0 top-0 z-50 border-b border-border transition-transform duration-500 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="flex items-center">
          <img
            src={hmLogoImg}
            alt={t.monogram}
            width={34}
            height={34}
            className="h-[34px] w-[34px] object-contain"
          />
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          {t.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-base font-light tracking-[0.28em] uppercase text-primary transition-opacity hover:opacity-70"
            >
              {item.label}
            </a>
          ))}
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <LangSwitch />
        </nav>
        <button
          type="button"
          aria-label={open ? t.menuClose : t.menuOpen}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span
            className={`absolute h-px w-6 bg-foreground transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`}
          />
          <span
            className={`absolute h-px w-6 bg-foreground transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`absolute h-px w-6 bg-foreground transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`}
          />
        </button>
      </div>
      {open && (
        <nav className="border-t border-border md:hidden">
          <div className="flex flex-col items-center gap-8 py-10">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-light tracking-[0.28em] uppercase text-primary transition-opacity hover:opacity-70"
              >
                {item.label}
              </a>
            ))}
            <span className="h-px w-10 bg-border" aria-hidden="true" />
            <LangSwitch onClick={() => setOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[67px]">
      <div className="relative h-[calc(100svh-67px)] overflow-hidden">
        <img
          src={heroImg}
          alt="Melissa — Pro Makeup Artist HERMISSA"
          className="absolute inset-0 h-full w-full object-cover object-[50%_top] opacity-90"
        />
        <div className="absolute inset-0 bg-background/15" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(to_top,rgba(10,8,6,0.78)_0%,rgba(10,8,6,0.4)_55%,transparent_100%)]" />
        <div className="hero-copy-enter absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-16 text-center sm:pb-20">
          <h1
            className="text-2xl font-medium uppercase tracking-[0.45em] text-[#e6d9ae] sm:text-4xl sm:tracking-[0.5em] lg:text-5xl"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.7)" }}
          >
            Hermissa
          </h1>
          <p className="mt-6 text-[0.75rem] font-medium tracking-[0.45em] uppercase text-[#e6d9ae] sm:text-sm sm:tracking-[0.5em]" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.7)" }}>
            Professional Makeup Artist
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
}

function SectionHeading({
  overline,
  title,
}: {
  overline: string;
  title: string;
}) {
  return (
    <Reveal className="mb-16 text-center lg:mb-24">
      <p className="overline mb-4">{overline}</p>
      <h2 className="font-display text-4xl text-foreground sm:text-5xl">{title}</h2>
    </Reveal>
  );
}

function WorkCard({
  work,
  tall,
}: {
  work: (typeof WORKS)[number];
  tall?: boolean;
}) {
  return (
    <Reveal>
      <figure className="group relative overflow-hidden">
        <img
          src={work.src}
          alt={work.title}
          loading="lazy"
          width={912}
          height={1200}
          className={`img-editorial group-hover:img-editorial-hover w-full object-cover ${
            tall ? "aspect-[3/4]" : "aspect-[3/4]"
          }`}
        />
        <figcaption className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/85 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="overline mb-1.5">{work.tag}</span>
          <span className="font-display text-2xl text-foreground">{work.title}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function Portfolio() {
  const t = useT();
  return (
    <section id="portfolio" className="scroll-mt-20 py-24 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading overline={t.selectedWork} title="Portfolio" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {WORKS.map((work) => (
            <WorkCard key={work.title} work={work} />
          ))}
        </div>
      </div>
    </section>
  );
}

const INSTA_POSTS = [
  {
    src: insta1,
    alt: "Bold Red Lips — Instagram Post",
    href: "https://www.instagram.com/p/DT8vtufjGLR/?img_index=2",
  },
  { src: insta2, alt: "Brow Shaping — Instagram Post", href: "https://www.instagram.com/p/DO_ksYMCAjP/" },
  { src: insta3, alt: "Rose — Instagram Post", href: "https://www.instagram.com/p/DUq2e5uDjZO/?img_index=3" },
  { src: insta4, alt: "Berry Editorial — Instagram Post", href: "https://www.instagram.com/p/DJj-n1DNC0_/" },
  { src: insta5, alt: "Red Lace — Instagram Post", href: "https://www.instagram.com/p/DchDpBWDv-K/?img_index=1" },
  { src: insta6, alt: "Backstage Moments — Instagram Post", href: "https://www.instagram.com/p/DWq04geDDkN/?img_index=4" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function InstagramFeed() {
  const t = useT();
  return (
    <section aria-label="Instagram" className="border-y border-border py-24 lg:py-32">
      <Reveal className="mx-auto flex max-w-7xl gap-10 px-6 lg:gap-16 lg:px-10">
        <a
          href="https://instagram.com/hermissamakeup"
          target="_blank"
          rel="noreferrer"
          className="group hidden shrink-0 flex-col items-center gap-6 pt-2 sm:flex"
          aria-label={t.follow}
        >
          <InstagramIcon className="h-14 w-14 text-foreground transition-colors group-hover:text-primary" />
          <span className="rotate-180 text-2xl tracking-[0.6em] uppercase text-muted-foreground transition-colors group-hover:text-primary [writing-mode:vertical-rl]">
            Follow me
          </span>
        </a>
        <div className="min-w-0 flex-1">
          <a
            href="https://instagram.com/hermissamakeup"
            target="_blank"
            rel="noreferrer"
            className="group mb-8 flex items-center justify-center gap-4 sm:hidden"
            aria-label={t.follow}
          >
            <InstagramIcon className="h-12 w-12 text-foreground transition-colors group-hover:text-primary" />
            <span className="text-xl tracking-[0.5em] uppercase text-muted-foreground transition-colors group-hover:text-primary">
              Follow me
            </span>
          </a>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-4">
            {INSTA_POSTS.map((post) => (
              <a
                key={post.src}
                href={post.href}
                target="_blank"
                rel="noreferrer"
                className="group relative block overflow-hidden"
              >
                <img
                  src={post.src}
                  alt={post.alt}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-square w-full object-cover opacity-90 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <InstagramIcon className="h-8 w-8 text-foreground" />
                </span>
              </a>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a
              href="https://instagram.com/hermissamakeup"
              target="_blank"
              rel="noreferrer"
              className="inline-block border border-border px-8 py-3 text-xs tracking-[0.35em] uppercase text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {t.moreInsta}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function About() {
  const t = useT();
  return (
    <section id="ueber-mich" className="scroll-mt-20 py-24 lg:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal>
          <img
            src={about}
            alt="Melissa — Pro Makeup Artist HERMISSA"
            loading="lazy"
            width={912}
            height={1200}
            className="aspect-[3/4] w-full object-cover"
          />
        </Reveal>
        <Reveal delay={100}>
          <p className="overline mb-4">{t.aboutOver}</p>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Melissa —<br />
            <span className="text-primary">Pro Makeup Artist</span>
          </h2>
          <p className="mt-8 text-base font-light leading-relaxed text-muted-foreground">
            {t.aboutP1}
          </p>
          <p className="mt-5 text-base font-light leading-relaxed text-muted-foreground">
            {t.aboutP2}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const t = useT();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(event.currentTarget);
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          message: String(data.get("nachricht") ?? ""),
          website: String(data.get("website") ?? ""),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && body.ok) {
        setSent(true);
        return;
      }
      setError(
        body.error === "invalid_input"
          ? t.errInput
          : body.error === "server_config"
            ? t.errConfig
            : t.errSend,
      );
    } catch {
      setError(t.errNet);
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full border border-input bg-transparent px-4 py-3 text-sm font-light text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-ring";

  return (
    <section id="kontakt" className="scroll-mt-20 py-24 lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-10">
        <Reveal className="min-w-0">
          <p className="overline mb-4">{t.contactOver}</p>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {t.contactH1}
            <br />
            {t.contactH2}<span className="text-primary">{t.contactH3}</span>
          </h2>
          <p className="mt-8 break-words text-sm text-muted-foreground">
            <a
              href="mailto:melissa@hermissa.ch"
              className="transition-colors hover:text-primary"
            >
              Email — melissa@hermissa.ch
            </a>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            <a
              href="https://wa.me/41786521828"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              WhatsApp — +41 78 652 18 28
            </a>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            <a
              href="https://instagram.com/hermissamakeup"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              Instagram — @hermissamakeup
            </a>
          </p>
        </Reveal>
        <Reveal className="min-w-0" delay={100}>
          {sent ? (
            <div className="flex min-h-[24rem] min-w-0 items-center justify-center border border-primary/40 bg-card/40 px-6 py-16 text-center sm:px-12">
            <p className="font-display text-xl leading-relaxed text-foreground sm:text-2xl">
              {t.thanks1}{" "}
              <span className="text-primary">
                {t.thanks2}
              </span>
            </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="min-w-0 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="overline mb-2 block"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder={t.namePh}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="overline mb-2 block"
                >
                  E-Mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t.emailPh}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="overline mb-2 block"
              >
                {t.phone}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                maxLength={40}
                placeholder="+41 …"
                className={inputClass}
              />
            </div>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <div>
              <label
                htmlFor="nachricht"
                className="overline mb-2 block"
              >
                {t.message}
              </label>
              <textarea
                id="nachricht"
                name="nachricht"
                required
                maxLength={5000}
                rows={6}
                placeholder={t.messagePh}
                className={`${inputClass} resize-none`}
              />
            </div>
            {error && (
              <p role="alert" className="border border-destructive/50 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-primary py-4 text-xs tracking-[0.35em] uppercase text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? t.sending : t.send}
            </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M9.1 8.3c.15-.35.3-.35.45-.35h.4c.15 0 .35 0 .5.35l.6 1.4c.1.2 0 .4-.1.5l-.5.55c-.1.1-.1.25 0 .4a5.4 5.4 0 0 0 2.4 2.4c.15.1.3.1.4 0l.55-.5c.15-.1.35-.15.5-.1l1.4.6c.35.1.35.35.35.5v.4c0 .15 0 .35-.35.45a2.1 2.1 0 0 1-1.5.15 7 7 0 0 1-4.8-4.8 2.1 2.1 0 0 1 .15-1.5Z" />
    </svg>
  );
}

function WhatsAppFloat() {
  const t = useT();
  return (
    <a
      href="https://wa.me/41786521828"
      target="_blank"
      rel="noreferrer"
      aria-label={t.waChat}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/70 text-foreground shadow-sm backdrop-blur transition-colors hover:border-primary hover:text-primary"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-border py-12">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center lg:px-10">
        <img
          src={hmLogoImg}
          alt={t.monogram}
          width={44}
          height={44}
          loading="lazy"
          className="h-11 w-11 object-contain"
        />
        <img
          src={wordmarkImg}
          alt="HERMISSA"
          width={1402}
          height={232}
          loading="lazy"
          className="h-4 w-auto"
        />
        <LangSwitch className="text-sm" />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} HERMISSA — All rights reserved
        </p>
      </Reveal>
    </footer>
  );
}

export function HomePage({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-background">
        <Nav />
        <main>
          <Hero />
          <Portfolio />
          <InstagramFeed />
          <About />
          <Contact />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </LangContext.Provider>
  );
}
