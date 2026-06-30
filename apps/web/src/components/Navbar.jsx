export default function Navbar() {
  return (
    <>
      {/*Navbar*/}
      <div className=" rounded-sm flex items-center text-center  bg-white shadow-sm w-full justify-between h-15">
        {/*Logo*/}
        <div>
          <h1 className="text-2xl lg:text-3xl  font-bold text-blue-600 px-2 lg:px-6">
            Nerix.
          </h1>
        </div>

        {/*navlinks*/}
        <div>
          <ul className="flex items-center gap-5 text-center">
            <li>
              <a
                className="text-sm text-blue-500 hover:text-blue-600 hover:font-medium"
                href="#"
              >
                Features
              </a>
            </li>
            <li>
              <a
                className="text-sm text-blue-500 hover:text-blue-600 hover:font-medium"
                href="#"
              >
                How it Works
              </a>
            </li>
            <li>
              <a
                className="text-sm text-blue-500 hover:text-blue-600 hover:font-medium"
                href="#"
              >
                Docs
              </a>
            </li>
            <li>
              <a
                className="text-sm text-blue-500 hover:text-blue-600 hover:font-medium"
                href="#"
              >
                About
              </a>
            </li>
            <li>
              <a
                className="text-sm text-blue-500 hover:text-blue-600 hover:font-medium"
                href="#"
              >
                Scan
              </a>
            </li>
          </ul>
        </div>

        {/*Get started buttons*/}
        <div className="flex gap-5 px-2 lg:px-6 text-center">
          <button className="border border-blue-300 rounded-sm py-1 px-3 text-sm text-blue-500  cursor-pointer hover:text-white  hover:bg-blue-500">
            Login
          </button>
          <button className=" rounded-sm py-1 px-3 text-sm text-white bg-blue-500  cursor-pointer hover:text-white   hover:bg-blue-600">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
