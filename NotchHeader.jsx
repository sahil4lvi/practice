import { useState, useEffect } from "react";

const ElegantNavbar = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", checkIfMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <style jsx>{`
        nav {
          position: fixed;
          top: ${isMobile ? "10px" : "16px"};
          left: 50%;
          transform: translateX(-50%);
          /* 👇 Shrinks dramatically */
          width: ${isAtTop ? (isMobile ? "94%" : "92%") : isMobile ? "80%" : "65%"};
          height: ${isMobile ? "52px" : "60px"}; /* height unchanged */
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 0 ${isAtTop ? (isMobile ? "16px" : "28px") : isMobile ? "10px" : "18px"};
          border-radius: ${isMobile ? "22px" : "26px"};
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.12);
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          transition: all 0.35s ease;
          z-index: 1000;
          font-family: "Inter", sans-serif;
          backdrop-filter: blur(18px);
        }

        .logo {
          font-size: ${isMobile ? "1.2rem" : "1.5rem"};
          font-weight: 700;
          color: #111;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.3s ease;
          letter-spacing: -0.5px;
        }
        .logo:hover {
          transform: scale(1.04);
        }

        .nav-center {
          display: flex;
          justify-content: center;
        }
        .nav-links {
          display: flex;
          gap: ${isAtTop ? (isMobile ? "12px" : "20px") : isMobile ? "6px" : "12px"};
          transition: gap 0.3s ease;
        }
        .nav-links a {
          text-decoration: none;
          color: #222;
          font-weight: 600;
          font-size: ${isMobile ? "0.88rem" : "0.95rem"};
          padding: 6px 0;
          position: relative;
          transition: all 0.3s ease;
        }
        .nav-links a:hover {
          color: #000;
        }

        .nav-links a::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3a7bd5, #00d2ff);
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .nav-links a:hover::after {
          width: 100%;
        }

        .nav-button {
          background: linear-gradient(90deg, #3a7bd5, #00d2ff);
          color: white;
          border: none;
          padding: ${isMobile ? "7px 13px" : "8px 16px"};
          border-radius: 18px;
          font-size: ${isMobile ? "0.82rem" : "0.9rem"};
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(58, 123, 213, 0.35);
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          font-size: 1.7rem;
          cursor: pointer;
          color: #111;
        }

        @media (max-width: 640px) {
          .nav-center {
            display: none;
          }
          .nav-button {
            display: none;
          }
          .mobile-menu-button {
            display: block;
          }
        }

        .mobile-menu {
          position: absolute;
          top: ${isMobile ? "54px" : "64px"};
          right: 20px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          padding: 12px 16px;
          gap: 10px;
          animation: fadeIn 0.3s ease;
          z-index: 999;
        }
        .mobile-menu a {
          font-size: 0.9rem;
          color: #222;
          text-decoration: none;
          font-weight: 500;
        }
        .mobile-nav-button {
          background: linear-gradient(90deg, #3a7bd5, #00d2ff);
          color: white;
          border: none;
          border-radius: 18px;
          padding: 8px 14px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <nav aria-label="Main Navigation">
        <a href="/" className="logo">Oe &lt; ww</a>

        <div className="nav-center">
          <div className="nav-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">FAQ</a>
            <a href="#">Portfolio</a>
          </div>
        </div>

        {!isMobile && <button className="nav-button">Contact</button>}

        {isMobile && (
          <button
            className="mobile-menu-button"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        )}
      </nav>

      {isMobile && isMenuOpen && (
        <div className="mobile-menu">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">FAQ</a>
          <a href="#">Portfolio</a>
          <button className="mobile-nav-button">Contact</button>
        </div>
      )}
    </div>
  );
};

export default ElegantNavbar;
