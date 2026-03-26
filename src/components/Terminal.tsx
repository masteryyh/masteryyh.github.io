import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function typingDelayForChar(ch: string) {
    const base = 42 + Math.random() * 56;

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
    const [phase, setPhase] = useState<"typing" | "idle" | "done">("idle");
    const scrollViewportRef = useRef<HTMLDivElement | null>(null);
    const activeTextRef = useRef<HTMLSpanElement | null>(null);
    const scrollRafRef = useRef<number>(0);
    const prefersReducedMotion = useRef(
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    const scrollToBottom = useCallback(() => {
        const el = scrollViewportRef.current;
        if (!el) return;
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = requestAnimationFrame(() => {
            scrollRafRef.current = 0;
            el.scrollTo({
                top: el.scrollHeight,
                behavior: prefersReducedMotion.current ? "auto" : "smooth",
            });
        });
    }, []);

    useEffect(() => {
        let cancelled = false;

        function sleep(ms: number) {
            return new Promise<void>((r) => setTimeout(r, ms));
        }

        function setActiveText(text: string) {
            if (activeTextRef.current) {
                activeTextRef.current.textContent = text;
            }
            scrollToBottom();
        }

        async function run() {
            setRendered([]);
            setPhase("idle");

            if (prefersReducedMotion.current) {
                const allLines = script.map(line =>
                    line.kind === "prompt" ? `${line.prompt} ${line.command}` : line.text
                );
                setRendered(allLines);
                setPhase("done");
                return;
            }

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
                    setPhase("typing");
                    setActiveText(`${line.prompt} `);
                    await sleep(380 + Math.random() * 260);

                    for (let i = 0; i < line.command.length; i++) {
                        if (cancelled) return;
                        const slice = line.command.slice(0, i + 1);
                        const ch = line.command[i];
                        setActiveText(`${line.prompt} ${slice}`);

                        if (Math.random() < 0.018) {
                            await sleep(180 + Math.random() * 260);
                        }

                        await sleep(typingDelayForChar(ch));
                    }

                    setPhase("idle");
                    setActiveText("");
                    setRendered((r) => [...r, full]);

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

            setPhase("done");
        }

        void run();

        return () => {
            cancelled = true;
            cancelAnimationFrame(scrollRafRef.current);
        };
    }, [script, scrollToBottom]);

    useEffect(() => {
        scrollToBottom();
    }, [rendered, scrollToBottom]);

    return (
        <div
            role="img"
            aria-label={`Terminal showing: ${name}, ${line2}`}
            className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card"
        >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-label="Close" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-label="Minimize" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-label="Maximize" />
                </div>
                <div className="ml-2 font-mono text-xs font-medium text-text-muted">
                    {title}
                </div>
            </div>

            <div
                ref={scrollViewportRef}
                aria-hidden="true"
                className="h-[280px] overflow-auto px-3 py-3 font-mono text-[12px] leading-relaxed sm:h-[340px] sm:px-4 sm:py-4 sm:text-[13px] lg:h-auto lg:min-h-0 lg:flex-1"
            >
                {rendered.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap text-text-primary">
                        <span
                            className={
                                line.includes("yyh@dev:~$")
                                    ? "font-semibold text-accent"
                                    : ""
                            }
                        >
                            {line}
                        </span>
                    </div>
                ))}

                {phase === "typing" ? (
                    <div className="whitespace-pre-wrap text-text-primary">
                        <span ref={activeTextRef} className="font-semibold text-accent" />
                        <span className="terminal-cursor" aria-hidden="true">
                            _
                        </span>
                    </div>
                ) : phase === "done" ? (
                    <div className="whitespace-pre-wrap text-text-primary">
                        <span className="font-semibold text-accent">yyh@dev:~$ </span>
                        <span className="terminal-cursor" aria-hidden="true">
                            _
                        </span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
