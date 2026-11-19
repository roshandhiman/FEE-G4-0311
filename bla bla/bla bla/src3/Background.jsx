const VIDEO = "/wallpapers/bg.mp4";

export default function Background() {
  return (
    <>
      <video className="bg-video" src={VIDEO} autoPlay muted loop playsInline />
      <div className="bg-shade" />
    </>
  );
}
