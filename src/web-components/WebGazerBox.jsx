import webgazer from "./webgazer";



export default function WebGazerBox() {
  const Gazer = () => {
    webgazer.setGazeListener(function(data) {
        if (data == null) {
            return;
        }
    }).begin();

  }

  return (
    <Gazer></Gazer>
  );
}
