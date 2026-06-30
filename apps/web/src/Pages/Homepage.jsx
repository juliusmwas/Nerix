export default function Homepage() {
  return (
    <>
      {/*Hero section*/}
      <section>
        <div>
          <p>Public analysis only. No hacking. No exploitation</p>
          <h1>
            Understand Your Website <br />
            Security <span className="text-blue-500">In Minutes</span>
          </h1>

          <p>
            Analyze SSL, HTTPS, DNS records and security header through safe{" "}
            <br />
            public analysis. Get started for free.
          </p>

          {/*Input button*/}
          <div>
            <input type="text" placeholder="Enter your website url here...." />
            <button>Scan Now</button>
          </div>
        </div>
      </section>
    </>
  );
}
