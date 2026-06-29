export default function Navbar() {
  return (
    <>
      {/*Navbar*/}
      <div className=" rounded-sm flex items-center  bg-white shadow-sm w-full justify-between h-15">
        {/*Logo*/}
        <div>
          <h1 className="text-2xl lg:text-3xl  font-bold text-blue-600 px-2 lg:px-4">
            Nerix.
          </h1>
        </div>

        {/*navlinks*/}
        <div>
          <ul className="flex items-center gap-5 ">
            <li>
              <a href="#">Features</a>
            </li>
            <li>
              <a href="#">How it Works</a>
            </li>
            <li>
              <a href="#">Docs</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Scan</a>
            </li>
          </ul>
        </div>

        {/*Get started buttons*/}
        <div>
          <button>Login</button>
          <button>Get Started</button>
        </div>
      </div>
    </>
  );
}
