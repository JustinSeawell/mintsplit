interface AudioProps {
  src: string;
}

function Audio({ src }: AudioProps) {
  return (
    <figure style={{ margin: 0, width: "100%" }}>
      <audio controls src={src} style={{ display: "block", width: "100%" }}>
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </figure>
  );
}

export default Audio;
