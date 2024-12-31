export default function ComingSoonOverlay() {
  return (
    <div className="backdrop-blur-sm fixed top-0 left-0 flex items-center justify-center w-full h-full">
      <div className="rounded-xl p-7 max-w-96 text-center bg-white">
        <div className=" text-2xl">Coming Soon...</div>
        <div>Gatherzap is currently under development.</div>
        <div>Stay tuned for great things in early 2025!</div>
        <small>
          <em>
            Contact{" "}
            <a className="text-green" href="mailto:josephdboris@gmail.com">
              josephdboris@gmail.com
            </a>{" "}
            for more info.
          </em>
        </small>
      </div>
    </div>
  );
}
