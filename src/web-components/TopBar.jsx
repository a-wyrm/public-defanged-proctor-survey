import gwusec_logo from "../assets/gw_monogram_wht_rev.png";


export default function TopBar() {
  return (    
    <nav className="bg-gw-primary-blue text-color-white ">
      <div
        id="top-bar"
        className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="place-self-center">
            <img src={gwusec_logo} className="max-h-16 p-2" alt="The George Washington University Security Lab logo"></img>
          </div>
          <div className="place-self-center">
            <span className="text-2xl font-bold underline text-white">
              Exam Proctoring
            </span>
          </div>
        </div>
        <div>
          <div className="bg-dark p-4">
            <p className=" card-title text-white h4">
              <strong>Research Study: </strong> <em>Exam Proctoring Software</em>
            </p>
            <hr></hr>
            <p className="text-white h4">
              <strong>Principle Investigator:</strong> Dr. Adam J. Aviv, The
              George Washington University
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}