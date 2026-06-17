export default function Navbar() {
  return (
    <>
      {/*Navbar*/}
      <div>
        {/*Logo*/}
        <div>
          <h1>Nerix</h1>
        </div>

        {/*navlinks*/}
        <div>
          <ul>
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
