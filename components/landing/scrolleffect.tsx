"use client";

const Navbar = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav>
      <a href="#home" onClick={(e) => handleScroll(e, "home")}>
        Home
      </a>
      <a href="#services" onClick={(e) => handleScroll(e, "services")}>
        Services
      </a>
      <a href="#how-it-works" onClick={(e) => handleScroll(e, "how-it-works")}>
        How it Works
      </a>
      <a href="#why-us" onClick={(e) => handleScroll(e, "why-us")}>
        Why us
      </a>
      <a href="#contact" onClick={(e) => handleScroll(e, "contact")}>
        Contact
      </a>
    </nav>
  );
};

export default Navbar;
