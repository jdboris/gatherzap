import { FaLinkedin } from "react-icons/fa";

export default function ComingSoonOverlay() {
  return (
    <div className="backdrop-blur-sm fixed top-0 left-0 flex items-center justify-center w-full h-full font-light">
      <div className="rounded-xl p-7 max-w-96 drop-shadow-md gap flex flex-col gap-1 text-center bg-white">
        <div className="text-2xl">Coming Soon...</div>
        <div>Gatherzap is currently under development.</div>
        <div>Stay tuned for great things in early 2025!</div>
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
              className="text-green"
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
