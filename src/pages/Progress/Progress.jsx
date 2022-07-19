import Iframe from "react-iframe";

export default function MyProgress() {
  return (
    <Iframe
      url="http://35.83.209.174:9001"
      width="100%"
      height="100%"
      id="myId"
      className="myClassname"
      display="initial"
      position="relative"
    />
  );
}
