import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { PROJECT_URL, RESUME_FILES } from "../consts/consts";

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

type SocialButtonsProps = {
    linkedInUrl: string;
    className: string;
    lang?: string;
};

const iconButtonClassName =
    "inline-flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-secondary transition-colors duration-200 hover:border-border-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1";

export const SocialButtons = memo(function SocialButtons({ linkedInUrl, className, lang }: SocialButtonsProps) {
    const resumeFile = lang ? (RESUME_FILES[lang] ?? RESUME_FILES["en"]) : null;
    const resumeUrl = resumeFile ? `${BASE}/assets/resume/${resumeFile}` : null;

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

            {resumeUrl ? (
                <a
                    href={resumeUrl}
                    download={resumeFile}
                    className={iconButtonClassName}
                    aria-label="Download resume"
                    title="Download Resume"
                >
                    <FontAwesomeIcon icon={faDownload} />
                </a>
            ) : (
                <button
                    type="button"
                    disabled
                    className={`${iconButtonClassName} cursor-not-allowed opacity-40`}
                    aria-label="Download resume (coming soon)"
                    title="Resume (coming soon)"
                >
                    <FontAwesomeIcon icon={faDownload} />
                </button>
            )}
        </div>
    );
});
