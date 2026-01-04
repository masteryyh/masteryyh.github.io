import { useEffect, useMemo, useRef, useState } from "react";

type TerminalLine =
    | { kind: "prompt"; prompt: string; command: string }
    | { kind: "output"; text: string };

type TerminalContact = {
    email: string;
    phone?: string;
    wechat?: string;
    linkedin: string;
    credly: string;
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
    // Aim for a human-like cadence: generally slower with jitter, plus occasional
    // micro-pauses on whitespace/punctuation (similar to thinking / finger travel).
    const base = 42 + Math.random() * 56; // ~42–98ms

    if (ch === " ") {
        return base + (Math.random() < 0.55 ? 40 + Math.random() * 120 : 10);
    }

    if (/[.,:;!?]/.test(ch)) {
        return base + 120 + Math.random() * 220;
    }

    if (ch === "\"" || ch === "'") {
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
            { kind: "prompt", prompt: "yyh@dev:~$", command: "cat info.json | jq" },
            { kind: "output", text: "{" },
            { kind: "output", text: `  "email": "${contact.email}",` },
            { kind: "output", text: `  "phone": "${contact.phone ?? "N/A"}",` },
            ...(contact.wechat
                ? ([{ kind: "output", text: `  "wechat": "${contact.wechat}",` }] as const)
                : []),
            { kind: "output", text: `  "linkedin": "${contact.linkedin}",` },
            { kind: "output", text: `  "credly": "${contact.credly}"` },
            { kind: "output", text: "}" },
            { kind: "prompt", prompt: "yyh@dev:~$", command: "echo \"Thanks for stopping by.\"" },
            { kind: "output", text: "Thanks for stopping by." },
        ],
        [contact, line2, name],
    );

    const [rendered, setRendered] = useState<string[]>([]);
    const [active, setActive] = useState<string>("");
    const [done, setDone] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

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
                    // Group all output lines until the next prompt so we can render them
                    // immediately, matching modern terminal UX.
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

                        // Small chance of a slightly longer hesitation mid-command.
                        if (Math.random() < 0.018) {
                            await sleep(180 + Math.random() * 260);
                        }

                        await sleep(typingDelayForChar(ch));
                    }

                    setRendered((r) => [...r, full]);
                    setActive("");

                    // Brief pause before output, then render the whole batch instantly.
                    if (outputBatch.length > 0) {
                        await sleep(160 + Math.random() * 220);
                        setRendered((r) => [...r, ...outputBatch]);
                        await sleep(220 + Math.random() * 260);
                    } else {
                        await sleep(260 + Math.random() * 220);
                    }
                    continue;
                }

                // output
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
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [rendered, active]);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/80 shadow-[0_0_0_1px_rgba(15,23,42,0.05),0_20px_50px_-38px_rgba(15,23,42,0.22)] backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-950/60 dark:shadow-[0_0_0_1px_rgba(15,23,42,0.15),0_30px_80px_-40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/70">
                <div className="flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-300">{title}</div>
            </div>

            <div className="max-h-[340px] overflow-auto px-4 py-4 font-mono text-[13px] leading-relaxed">
                {rendered.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        <span
                            className={
                                line.includes("yyh@dev:~$")
                                    ? "text-cyan-700 dark:text-cyan-300"
                                    : ""
                            }
                        >
                            {line}
                        </span>
                    </div>
                ))}

                {active ? (
                    <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        <span className="text-cyan-700 dark:text-cyan-300">{active}</span>
                        <span className="terminal-cursor" aria-hidden="true">
                            _
                        </span>
                    </div>
                ) : done ? (
                    <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        <span className="text-cyan-700 dark:text-cyan-300">yyh@dev:~$ </span>
                        <span className="terminal-cursor" aria-hidden="true">
                            _
                        </span>
                    </div>
                ) : null}

                <div ref={bottomRef} />
            </div>
        </div>
    );
}
