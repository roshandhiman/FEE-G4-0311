import videoSrc from "./abcdcar.mp4";

export default function BackgroundVideo() {
  return (
    <div className="video-background-wrapper">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="video-overlay" />
    </div>
  );
}
