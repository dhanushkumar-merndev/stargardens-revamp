'use client';

export default function ReplayIntro() {
  return (
    <button className="replay" type="button" onClick={() => window.dispatchEvent(new Event('sg:replay-intro'))}>
      Replay intro
    </button>
  );
}
