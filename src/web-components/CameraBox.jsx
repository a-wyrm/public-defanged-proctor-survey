import { useState, useEffect } from "react";
import Webcam from "react-webcam";
import VolumeBar from "./VolumeBar";

import radiorecording from '../assets/images/radiorecording.png'

export default function CameraBox() {
  const [setScrollY] = useState(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const boxStyles = {
    position: "fixed",
    top: "0",
    outlineStyle: "solid",
    outlineColor: "red",
    width: "222px",
    minHeight: "150px",
  };

  return (
    <div style={boxStyles} id="camera_box">
      <Webcam />
      <div style={{
          position: 'absolute',
          animation: 'blink 1s',
          animationIterationCount: 'infinite',
          width: '20%',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
      }}>
       <img src={radiorecording}/>
      </div>
      <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
          <VolumeBar />
      </div>
    </div>
  );
}
