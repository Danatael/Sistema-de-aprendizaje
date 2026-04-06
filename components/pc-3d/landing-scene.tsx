"use client"

function LandingScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <iframe
        title="Office PC"
        className="h-full w-full"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src="https://sketchfab.com/models/69188a48a0b04b18aa015719b0551eaa/embed?autostart=1"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/45" />

      <p className="absolute bottom-2 left-2 z-10 text-[11px] text-neutral-300/90">
        <a
          href="https://sketchfab.com/3d-models/office-pc-69188a48a0b04b18aa015719b0551eaa?utm_medium=embed&utm_campaign=share-popup&utm_content=69188a48a0b04b18aa015719b0551eaa"
          target="_blank"
          rel="noreferrer noopener"
          className="pointer-events-auto font-semibold text-sky-400"
        >
          Office PC
        </a>{" "}
        por{" "}
        <a
          href="https://sketchfab.com/fluffyw0lf?utm_medium=embed&utm_campaign=share-popup&utm_content=69188a48a0b04b18aa015719b0551eaa"
          target="_blank"
          rel="noreferrer noopener"
          className="pointer-events-auto font-semibold text-sky-400"
        >
          fluffyw0lf
        </a>{" "}
        en{" "}
        <a
          href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=69188a48a0b04b18aa015719b0551eaa"
          target="_blank"
          rel="noreferrer noopener"
          className="pointer-events-auto font-semibold text-sky-400"
        >
          Sketchfab
        </a>
      </p>
    </div>
  )
}

export default LandingScene
