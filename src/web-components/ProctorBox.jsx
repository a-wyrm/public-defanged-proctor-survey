import { useState, useEffect } from "react";
import Webcam from "react-webcam";

export default function ProctorBox() {
  const [setScrollY] = useState(window.scrollY);
  const [showConnecting, setShowConnecting] = useState(true);
  const [showConnected, setShowConnected] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const connectingTimer = setTimeout(() => {
      setShowConnecting(false);
      console.log("connected");
      setShowConnected(true);
      const connectedTimer = setTimeout(() => {
        setShowConnected(false);
      }, 2000);
    }, 3500);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const boxStyles = {
    position: "fixed",
    top: "0",
    outlineStyle: "solid",
    outlineColor: "red",
    width: "222px",
  };

  return (
    <div style={boxStyles} id="camera_box">

      {showConnecting ? (

          <img src="/connecting.png" style={{ width: "100%", height: "100%" }}/>

      ): showConnected ? ( 

        <img src="/connected.png" style={{ width: "100%", height: "100%" }}/>
        
      ) : (

          <video autoPlay="autoPlay" loop muted style={{ width: "100%", height: "100%" }}>
            <source src="/testProctor.mp4" type="video/mp4"></source>
          </video>

      )}

      <Webcam style={{ width: "0%", height: "0%" }}/>  
    </div>
  );
}
