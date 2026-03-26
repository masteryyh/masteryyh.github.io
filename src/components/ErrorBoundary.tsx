import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
    children: ReactNode;
    fallback?: ReactNode;
};

type State = {
    hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-bg)" }}>
                    <div className="mx-4 flex max-w-md flex-col items-center gap-4 text-center">
                        <p className="font-mono text-sm" style={{ color: "var(--color-warn)" }}>
                            {"// "}something went wrong
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="rounded border border-accent px-4 py-2 font-mono text-sm text-accent transition-colors duration-200 hover:bg-accent-muted"
                        >
                            reload
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
