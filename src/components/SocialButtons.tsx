import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { PROJECT_URL } from "../consts/consts";

type SocialButtonsProps = {
    linkedInUrl: string;
    className: string;
};

export function SocialButtons({ linkedInUrl, className }: SocialButtonsProps) {
    const iconButtonClassName =
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/80 text-lg text-slate-700 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-slate-200 hover:text-slate-900 hover:shadow-md dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-700/80 dark:hover:text-slate-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-500/40";

    return (
        <div className={`items-center gap-2 ${className}`}>
            <a
                href={PROJECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={iconButtonClassName}
                aria-label="Open project GitHub"
                title="GitHub"
            >
                <FontAwesomeIcon icon={faGithub} />
            </a>

            <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={iconButtonClassName}
                aria-label="Open LinkedIn profile"
                title="LinkedIn"
            >
                <FontAwesomeIcon icon={faLinkedinIn} />
            </a>

            <button
                type="button"
                disabled
                className={`${iconButtonClassName} cursor-not-allowed opacity-40 hover:scale-100 hover:bg-slate-100/80 hover:text-slate-700 dark:hover:bg-slate-800/60 dark:hover:text-slate-300`}
                aria-label="Download resume (coming soon)"
                title="Resume (coming soon)"
            >
                <FontAwesomeIcon icon={faDownload} />
            </button>
        </div>
    );
}
