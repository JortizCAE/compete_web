import Iframe from "react-iframe";

export default function MyProgress() {
  return (
    <Iframe
      url="https://books-hub.vercel.app/"
      width="100%"
      height="100%"
      id="myId"
      className="myClassname"
      display="initial"
      position="relative"
    />
  );
}
