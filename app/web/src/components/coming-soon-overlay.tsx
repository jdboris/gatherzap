import { FaLinkedin } from "react-icons/fa";

export default function ComingSoonOverlay() {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center font-light backdrop-blur-sm">
      <div className="gap flex max-w-96 flex-col gap-1 rounded-xl bg-white p-7 text-center drop-shadow-md">
        <div className="text-2xl">Coming Soon...</div>
        <div>Gatherzap is currently under development.</div>
        <div>Stay tuned for great things coming mid 2025!</div>
        <div>
          Follow for updates:{" "}
          <a
            href={process.env.NEXT_PUBLIC_SOCIAL_LINK}
            target="_blank"
            className="inline-flex align-middle"
          >
            <FaLinkedin />
          </a>
        </div>
        <small>
          <em>
            For inquiries, contact{" "}
            <a
              className="text-primary"
              href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
            >
              {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
            </a>
            .
          </em>
        </small>
      </div>
    </div>
  );
}
