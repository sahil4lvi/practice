import { useState, useEffect } from "react";

const SleekNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState("light");
  const [overlayColor, setOverlayColor] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(null); // "enter" | "exit"

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      const maxScroll = 200;
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkIfMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Step 1: start circle spread
    setOverlayColor(newTheme === "dark" ? "#0f0f11" : "#f9f9f9");
    setAnimationPhase("enter");

    // Step 2: once fully covered (after 0.45s), switch theme
    setTimeout(() => {
      setTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      // Step 3: trigger exit animation (circle shrinks away bottom-left)
      setAnimationPhase("exit");
    }, 450);

    // Step 4: remove overlay once exit is done
    setTimeout(() => {
      setOverlayColor(null);
      setAnimationPhase(null);
    }, 900);
  };

  const width = isMobile
    ? `${94 - 14 * scrollProgress}%`
    : `${90 - 40 * scrollProgress}%`;

  return (
    <div>
      <style jsx global>{`
        :root {
          --bg-light: #f9f9f9;
          --bg-dark: #0f0f11;
          --text-light: #111;
          --text-dark: #f5f5f5;
        }

        [data-theme="light"] body {
          background: var(--bg-light);
          color: var(--text-light);
          transition: background 0.3s ease, color 0.3s ease;
        }
        [data-theme="dark"] body {
          background: var(--bg-dark);
          color: var(--text-dark);
          transition: background 0.3s ease, color 0.3s ease;
        }

        .theme-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          pointer-events: none;
          background: var(--overlay-color);
        }

        /* enter: expand from top-right */
        .theme-overlay.enter {
          clip-path: circle(0% at 100% 0%);
          animation: wipeEnter 0.45s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }
        @keyframes wipeEnter {
          to {
            clip-path: circle(150% at 100% 0%);
          }
        }

        /* exit: shrink to bottom-left */
        .theme-overlay.exit {
          clip-path: circle(150% at 0% 100%);
          animation: wipeExit 0.45s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }
        @keyframes wipeExit {
          to {
            clip-path: circle(0% at 0% 100%);
          }
        }

        nav {
          position: fixed;
          top: ${isMobile ? "8px" : "12px"};
          left: 50%;
          transform: translateX(-50%);
          width: ${width};
          height: ${isMobile ? "48px" : "54px"};
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px) saturate(160%);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 9999px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          transition: width 0.15s linear;
          z-index: 1000;
          font-family: "Inter", sans-serif;
        }

        [data-theme="dark"] nav {
          background: rgba(20, 20, 22, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.5);
        }

        .logo {
          font-size: ${isMobile ? "1rem" : "1.1rem"};
          font-weight: 700;
          color: inherit;
          cursor: pointer;
        }

        .nav-links {
          display: flex;
          gap: ${isMobile ? "14px" : "22px"};
        }
        .nav-links a {
          text-decoration: none;
          color: inherit;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .icon {
          font-size: 1.1rem;
          cursor: pointer;
          color: inherit;
          transition: transform 0.3s ease;
        }
        .icon:hover {
          transform: rotate(20deg);
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
      `}</style>

      {overlayColor && (
        <div
          className={`theme-overlay ${animationPhase}`}
          style={{ "--overlay-color": overlayColor }}
        ></div>
      )}

      <nav>
        <div className="logo">DC</div>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Projects</a>
          <a href="#">Contact</a>
        </div>

        <div className="icon" onClick={toggleTheme}>
          {theme === "light" ? "☀" : "🌙"}
        </div>
      </nav>
    </div>
  );
};

export default SleekNavbar;
