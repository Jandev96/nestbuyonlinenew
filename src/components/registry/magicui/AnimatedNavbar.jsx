import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Link } from "react-router-dom";

// Navbar container
export const Navbar = ({ children }) => (
  <nav className="fixed top-0 left-0 w-full z-50">
    {children}
  </nav>
);

// Desktop Navbar body — updated to shrink and curve on scroll
export const NavBody = ({ children, scrolled }) => (
    <div
      className={clsx(
        "transition-all duration-300 ease-in-out px-4 py-3 text-white",
        "bg-blue-950/85 backdrop-blur-md shadow-md",
        "flex items-center justify-between mx-auto",
        {
          "w-full max-w-full": !scrolled, // FULL WIDTH initially
          "max-w-4xl rounded-full mt-2 px-6": scrolled, // shrink + rounded on scroll
        }
      )}
    >
      {children}
    </div>
  )

// Navigation links
export const NavItems = ({ items, onItemClick }) => (
  <div className="flex gap-6">
    {items.map((item, i) => (
      <motion.div
        key={i}
        className="relative"
        whileHover="hover"
        initial="rest"
        animate="rest"
      >
        <Link
          to={item.link}
          onClick={onItemClick}
          className="text-sm font-medium text-muted-foreground transition"
        >
          {item.name}
        </Link>
        <motion.div
          variants={{
            rest: { scaleX: 0 },
            hover: { scaleX: 1 },
          }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 -bottom-1 h-[2px] w-full bg-white origin-center"
          style={{ transformOrigin: "center" }}
        />
      </motion.div>
    ))}
  </div>
);

// Logo component
export const NavbarLogo = () => (
  <Link to="/" className="text-xl font-bold  text-white">
    
    NestBuy
  </Link>
);

// Auth buttons
export const NavbarButton = ({ href, children, variant = "primary" }) => {
  const buttonClasses = clsx(
    "px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm",
    {
      "bg-primary text-white hover:bg-primary/90": variant === "primary",
      "bg-muted text-foreground hover:bg-muted/70": variant === "secondary",
    }
  );

  return (
    <Link to={href} className={buttonClasses}>
      {children}
    </Link>
  );
};

// ---------- Mobile Nav ----------

export const MobileNav = ({ children }) => (
  <div className="md:hidden w-full px-4 py-3 bg-black/75 text-white backdrop-blur-md shadow-md">
    {children}
  </div>
);

export const MobileNavHeader = ({ children }) => (
  <div className="flex items-center justify-between">{children}</div>
);

export const MobileNavToggle = ({ isOpen, onClick }) => (
  <button onClick={onClick} className="text-white">
    {isOpen ? <X size={28} /> : <Menu size={28} />}
  </button>
);

export const MobileNavMenu = ({ children, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-3 mt-4 bg-card p-4 rounded-xl shadow-md"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
