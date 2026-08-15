import React, { useState } from "react";
import { Link, usePage } from '@inertiajs/react';
import { useAppearance } from '@/hooks/use-appearance';
import { logout } from '@/routes';
import {
    Activity,
    ArrowRight,
    BarChart3,
    Check,
    ChevronDown,
    ContactRound,
    FileText,
    Layers3,
    Menu,
    MessageSquareText,
    Moon,
    Radio,
    Send,
    ShieldCheck,
    Smartphone,
    Sun,
    UsersRound,
    X,
    Zap,
} from "lucide-react";
import "./home.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
    { icon: ContactRound, title: "Organized contacts", description: "Keep audiences clean with contact lists, import tools, and quick segmentation." },
    { icon: MessageSquareText, title: "Reusable templates", description: "Create consistent, approved message templates for every campaign." },
    { icon: Send, title: "Campaign delivery", description: "Build, schedule, and send targeted SMS campaigns from one workspace." },
    { icon: Smartphone, title: "Device & SIM control", description: "Register gateway devices, manage SIMs, and keep sending infrastructure visible." },
    { icon: Activity, title: "Delivery visibility", description: "Follow message activity and delivery statuses in detailed SMS logs." },
    { icon: UsersRound, title: "Team operations", description: "Invite teammates and manage the people responsible for your messaging." },
];

const faqs = [
    ["What can I manage in the platform?", "Contacts and lists, message templates, SMS campaigns, gateway devices and SIMs, delivery logs, and team access are all managed from one place."],
    ["Can I schedule campaigns?", "Yes. Campaigns can be prepared in advance and queued for delivery at the time you choose."],
    ["How do I monitor sent messages?", "The SMS log provides message-level statuses, while campaign analytics makes it easy to understand delivery performance."],
    ["Is access protected?", "The platform supports authenticated access, role-based administration, and two-factor security settings."],
];

const Home: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    const closeMenu = () => setMobileOpen(false);
    const { setting, auth, logo, faqs: dynamicFaqs } = usePage().props as any;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const toggleColorMode = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };
    
    // Use dynamic FAQs from backend if available, otherwise fallback to hardcoded
    const displayFaqs = (dynamicFaqs && dynamicFaqs.length > 0) ? dynamicFaqs : faqs.map(f => ({ question: f[0], answer: f[1] }));

    useGSAP(() => {
        // Hero animation
        gsap.from(".hero-copy > *", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
        });

        gsap.from(".product-preview", {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power3.out",
        });

        // Proof strip
        gsap.from(".proof-items > div", {
            scrollTrigger: {
                trigger: ".proof-strip",
                start: "top 80%",
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
        });

        // Features
        gsap.from(".section-heading", {
            scrollTrigger: {
                trigger: "#features",
                start: "top 85%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
        });

        gsap.from(".feature-card", {
            scrollTrigger: {
                trigger: "#features",
                start: "top 85%",
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
        });

        // Workflow
        gsap.from(".workflow-layout > div:first-child", {
            scrollTrigger: {
                trigger: "#workflow",
                start: "top 80%",
            },
            x: -30,
            opacity: 0,
            duration: 0.8,
        });

        gsap.from(".step", {
            scrollTrigger: {
                trigger: ".steps",
                start: "top 80%",
            },
            x: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
        });

        // Security
        gsap.from(".security-card > *", {
            scrollTrigger: {
                trigger: "#security",
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
        });

        // FAQ
        gsap.from(".faq-layout > div:first-child", {
            scrollTrigger: {
                trigger: "#faq",
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
        });

        gsap.from(".faq-item", {
            scrollTrigger: {
                trigger: ".faq-list",
                start: "top 80%",
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
        });

        // CTA
        gsap.from(".cta-card", {
            scrollTrigger: {
                trigger: ".cta-section",
                start: "top 80%",
            },
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
        });
    });

    return (
        <div className="sms-home">
            <header className="site-header">
                <div className="container navbar">
                    <a className="brand" href="#top" onClick={closeMenu} aria-label={setting?.site_name + ' home'}>
                        <img src={"/" + setting?.light_logo} alt="" className="img-fluid" style={{ height: "40px" }} />
                        <span>{setting?.site_name}<span></span></span>
                    </a>
                    <nav className={mobileOpen ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
                        <a href="#features" onClick={closeMenu}>Features</a>
                        <a href="#workflow" onClick={closeMenu}>How it works</a>
                        <a href="#security" onClick={closeMenu}>Security</a>
                        <a href="#faq" onClick={closeMenu}>FAQ</a>
                    </nav>
                    <div className="nav-actions">
                        <button
                            type="button"
                            className="color-mode-toggle"
                            onClick={toggleColorMode}
                            aria-label={`Switch to ${resolvedAppearance === 'dark' ? 'light' : 'dark'} mode`}
                            title={`Switch to ${resolvedAppearance === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {resolvedAppearance === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        {!auth?.user ? (
                            <>
                                <a className="login-link" href="/login">Sign in</a>
                                <a className="button button-small" href="/register">
                                    Create account <ArrowRight size={15} />
                                </a>
                            </>
                        ) : (
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn dropdown-toggle p-0 border-0"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {[auth?.user?.first_name, auth?.user?.last_name]
                                        .filter(Boolean)
                                        .join(' ') || 'User'}
                                </button>

                                <ul className="dropdown-menu">
                                    {auth?.user?.role === "admin" && (
                                        <li>
                                            <Link className="dropdown-item" href="/admin/dashboard">Admin Dashboard</Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link className="dropdown-item" href="/user/profile">Profile</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" href={logout()}> Sign out </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <button className="menu-button" type="button" aria-label="Toggle menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </header>

            <main id="top">
                <section className="hero">
                    <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
                    <div className="container hero-grid">
                        <div className="hero-copy">
                            <div className="eyebrow"><span className="pulse" /> SMS CAMPAIGN OPERATIONS</div>
                            <h1>Send the right message. <em>Keep every delivery in view.</em></h1>
                            <p>{setting?.site_name} brings contacts, campaigns, gateway devices, and delivery logs into one dependable workspace for your team.</p>
                            <div className="hero-actions">
                                <a href="/user/dashboard" className="button">Start managing campaigns  <ArrowRight size={18} /></a>
                                <a href="#features" className="text-action">Explore capabilities <ArrowRight size={16} /></a>
                            </div>
                            <div className="trust-row"><ShieldCheck size={18} /> Secure account access <span /> <Check size={16} /> Built for operational teams</div>
                        </div>
                        <div className="product-preview" aria-label="SMS campaign dashboard preview">
                            <img src="/images/home/dashboard_mockup.png" alt="SMS Platform Dashboard Mockup" className="img-fluid rounded-4 shadow-lg" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }} />
                        </div>
                    </div>
                </section>

                <section className="proof-strip">
                    <div className="container proof-items">
                        <div>
                            <strong>One workspace</strong>
                            <span>for messaging operations</span>
                        </div>
                        <div>
                            <strong>Connected devices</strong>
                            <span>with SIM management</span>
                        </div>
                        <div>
                            <strong>Delivery insight</strong>
                            <span>at campaign and message level</span>
                        </div>
                        <div>
                            <strong>Team-ready</strong>
                            <span>with controlled access</span>
                        </div>
                    </div>
                </section>

                <section className="section" id="features">
                    <div className="container">
                        <div className="section-heading">
                            <span className="section-label">PLATFORM CAPABILITIES</span>
                            <h2>Everything your SMS operation needs, without the operational sprawl.</h2>
                            <p>Move from audience preparation to campaign delivery with the tools already supported by your backend.</p>
                        </div>
                        <div className="feature-grid">
                            {features.map(({ icon: Icon, title, description }) =>
                                <article className="feature-card" key={title}>
                                    <div className="feature-icon">
                                        <Icon size={21} />
                                    </div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                    <ArrowRight size={17} />
                                </article>
                            )}
                        </div>
                    </div>
                </section>

                <section className="workflow-section" id="workflow"><div className="container workflow-layout"><div><span className="section-label">A CLEARER WORKFLOW</span><h2>From a contact list to a confirmed delivery.</h2><p>Build repeatable sending workflows your team can trust—without juggling separate tools or losing sight of status.</p><a href="/register" className="text-action">Set up your workspace <ArrowRight size={16} /></a></div><div className="steps">{[["01", "Prepare your audience", "Import contacts and group them into precise lists."], ["02", "Create your campaign", "Choose a template, configure the message, and schedule delivery."], ["03", "Track every outcome", "Use campaign analytics and SMS logs to follow delivery in real time."]].map(([number, title, text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

                <section className="section security-section" id="security"><div className="container security-card"><div className="security-icon"><ShieldCheck size={38} /></div><div><span className="section-label">CONTROL & CONFIDENCE</span><h2>Built for responsible messaging operations.</h2><p>Give administrators clear oversight with team management, secure account settings, two-factor authentication controls, and operational logs.</p></div><div className="security-list"><span><Check size={16} /> Role-aware access</span><span><Check size={16} /> Two-factor protection</span><span><Check size={16} /> Activity and queue visibility</span></div></div></section>

                <section className="section faq-section" id="faq"><div className="container faq-layout"><div><span className="section-label">FAQ</span><h2>Questions, answered.</h2><p>Everything you need to know before bringing your SMS workflow into one platform.</p></div><div className="faq-list">{displayFaqs.map((faq: any, index: number) => <div className={openFaq === index ? "faq-item open" : "faq-item"} key={faq.question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>{faq.question}<ChevronDown size={19} /></button>{openFaq === index && <p>{faq.answer}</p>}</div>)}</div></div></section>

                <section className="cta-section"><div className="container cta-card"><div><span className="section-label">READY WHEN YOU ARE</span><h2>Make your next SMS campaign easier to run.</h2><p>Bring your audience, sending infrastructure, and delivery data together.</p></div><a href="/register" className="button button-light">Create your account <ArrowRight size={18} /></a></div></section>
            </main>


            <footer>
                <div className="container footer-content">
                    <a className="brand" href="#top">
                        <img src={"/" + setting?.light_logo} alt="" className="img-fluid" style={{ height: "40px" }} />
                        <span>{setting?.site_name}<span></span></span>
                    </a>
                    <p>SMS campaign operations, made clear.</p>
                    <div>
                        <a href="/privacy-policy">Privacy</a><a href="/terms-and-conditions">Terms</a></div>
                </div>
            </footer>
        </div>
    );
};

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) { return <div className="metric"><span className={`metric-dot ${tone}`} /><small>{label}</small><strong>{value}</strong></div>; }

export default Home;
