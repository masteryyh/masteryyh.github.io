import { useEffect, useMemo, useRef, useState } from "react";

type TerminalLine = { kind: "prompt"; prompt: string; command: string } | { kind: "output"; text: string };

type TerminalContact = {
    email: string;
    phone?: string;
    wechat?: string;
    linkedin: string;
};

type TerminalProps = {
    title?: string;
    name: string;
    line2?: string;
    contact: TerminalContact;
};

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function typingDelayForChar(ch: string) {
    const base = 42 + Math.random() * 56; // ~42–98ms

    if (ch === " ") {
        return base + (Math.random() < 0.55 ? 40 + Math.random() * 120 : 10);
    }

    if (/[.,:;!?]/.test(ch)) {
        return base + 120 + Math.random() * 220;
    }

    if (ch === '"' || ch === "'") {
        return base + 40 + Math.random() * 120;
    }

    if (ch === "/" || ch === "-" || ch === "_" || ch === "|" || ch === "~") {
        return base + 20 + Math.random() * 90;
    }

    return clamp(base, 35, 140);
}

export function Terminal({
    title = "portfolio.sh",
    name,
    line2 = "Backend / Fullstack / DevOps",
    contact,
}: TerminalProps) {
    const script = useMemo<TerminalLine[]>(
        () => [
            { kind: "prompt", prompt: "yyh@dev:~$", command: "whoami" },
            { kind: "output", text: name },
            { kind: "output", text: line2 },
            { kind: "prompt", prompt: "yyh@dev:~$", command: "cat assets/info.json | jq" },
            { kind: "output", text: "{" },
            { kind: "output", text: `  "email": "${contact.email}",` },
            { kind: "output", text: `  "phone": "${contact.phone ?? "N/A"}",` },
            ...(contact.wechat ? ([{ kind: "output", text: `  "wechat": "${contact.wechat}",` }] as const) : []),
            { kind: "output", text: `  "linkedin": "${contact.linkedin}",` },
            { kind: "output", text: "}" },
            { kind: "prompt", prompt: "yyh@dev:~$", command: 'echo "Thanks for stopping by."' },
            { kind: "output", text: "Thanks for stopping by." },
        ],
        [contact, line2, name],
    );

    const [rendered, setRendered] = useState<string[]>([]);
    const [active, setActive] = useState<string>("");
    const [done, setDone] = useState(false);
    const scrollViewportRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setRendered([]);
            setActive("");
            setDone(false);

            for (let idx = 0; idx < script.length; idx++) {
                const line = script[idx];
                if (cancelled) return;

                if (line.kind === "prompt") {
                    const outputBatch: string[] = [];
                    for (let j = idx + 1; j < script.length; j++) {
                        const next = script[j];
                        if (next.kind === "prompt") break;
                        outputBatch.push(next.text);
                        idx = j;
                    }

                    const full = `${line.prompt} ${line.command}`;
                    setActive(`${line.prompt} `);
                    await sleep(380 + Math.random() * 260);

                    for (let i = 0; i < line.command.length; i++) {
                        if (cancelled) return;
                        const slice = line.command.slice(0, i + 1);
                        const ch = line.command[i];
                        setActive(`${line.prompt} ${slice}`);

                        if (Math.random() < 0.018) {
                            await sleep(180 + Math.random() * 260);
                        }

                        await sleep(typingDelayForChar(ch));
                    }

                    setRendered((r) => [...r, full]);
                    setActive("");

                    if (outputBatch.length > 0) {
                        await sleep(160 + Math.random() * 220);
                        setRendered((r) => [...r, ...outputBatch]);
                        await sleep(220 + Math.random() * 260);
                    } else {
                        await sleep(260 + Math.random() * 220);
                    }
                    continue;
                }

                setRendered((r) => [...r, line.text]);
                await sleep(140 + Math.random() * 180);
            }

            setDone(true);
        }

        void run();

        return () => {
            cancelled = true;
        };
    }, [script]);

    useEffect(() => {
        const el = scrollViewportRef.current;
        if (!el) return;
        const prefersReducedMotion =
            typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        requestAnimationFrame(() => {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: prefersReducedMotion ? "auto" : "smooth",
            });
        });
    }, [rendered, active]);

    return (
        <div className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-slate-100/50 shadow-soft backdrop-blur-sm transition-all duration-300 hover:shadow-soft-lg dark:border-slate-800/40 dark:from-slate-900/90 dark:to-slate-950/90">
            <div className="flex items-center gap-2 border-b border-slate-200/60 bg-white/60 px-3 py-2.5 backdrop-blur-sm dark:border-slate-800/40 dark:bg-slate-900/50 sm:px-4 sm:py-3">
                <div className="flex gap-2">
                    <span
                        className="h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.4)] transition-shadow duration-300 group-hover:shadow-[0_0_12px_rgba(251,113,133,0.6)]"
                        aria-label="Close"
                    />
                    <span
                        className="h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)] transition-shadow duration-300 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                        aria-label="Minimize"
                    />
                    <span
                        className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)] transition-shadow duration-300 group-hover:shadow-[0_0_12px_rgba(52,211,153,0.6)]"
                        aria-label="Maximize"
                    />
                </div>
                <div className="ml-2 text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                    {title}
                </div>
            </div>

            <div
                ref={scrollViewportRef}
                className="max-h-[280px] overflow-auto px-3 py-3 font-mono text-[12px] leading-relaxed sm:max-h-[340px] sm:px-4 sm:py-4 sm:text-[13px]"
            >
                {rendered.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        <span
                            className={
                                line.includes("yyh@dev:~$")
                                    ? "font-semibold text-emerald-600 dark:text-emerald-400"
                                    : ""
                            }
                        >
                            {line}
                        </span>
                    </div>
                ))}

                {active ? (
                    <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{active}</span>
                        <span className="terminal-cursor" aria-hidden="true">
                            _
                        </span>
                    </div>
                ) : done ? (
                    <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">yyh@dev:~$ </span>
                        <span className="terminal-cursor" aria-hidden="true">
                            _
                        </span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
