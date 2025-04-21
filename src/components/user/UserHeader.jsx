import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, saveUser } from "../../redux/slices/userSlice";
import { useUserStore } from "../../zustand/userStore";
import { useCartStore } from "../../zustand/cartStore";
import DarkMode from "../../pages/shared/DarkMode";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "../registry/magicui/AnimatedNavbar";

function UserHeader() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fetchCurrentUser } = useUserStore();
  const { user: zustandUser, isUserAuth } = useUserStore();

  const totalQuantity = useCartStore((state) => state.totalQuantity()) || 0;
  const clearCart = useCartStore((state) => state.clearCart);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default behavior
    dispatch(logoutUser()).then(() => {
      clearCart();
      navigate("/login");
    });
  };

  useEffect(() => {
    const hydrateUserFromToken = async () => {
      const result = await fetchCurrentUser();
      if (result && result.profile) {
        dispatch(saveUser({ user: result.profile, isUserAuth: true }));
      }
    };

    hydrateUserFromToken();
  }, [dispatch, fetchCurrentUser]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/products" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
    { name: "Wishlist", link: "/wishlist" },
  ];

  return (
    <Navbar>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <NavBody scrolled={scrolled}>
          <div className="flex flex-row items-center justify-between w-full">
            <NavbarLogo />
            <NavItems items={navItems} onItemClick={() => {}} />

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              <DarkMode />

              {user ? (
                <div className="dropdown dropdown-end ml-2">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full border-2 border-blue-500 shadow-lg">
                      <img
                        alt="Profile"
                        src={user.profilePic || "https://via.placeholder.com/40"}
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 w-52 p-2 rounded-lg bg-gray-900/90 text-white shadow-lg border border-gray-700"
                  >
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                      <Link to="/orders">Orders</Link>
                    </li>
                    <li>
                      <Link to="/wishlist">Wishlist</Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="flex gap-2">
                  <NavbarButton href="/login" variant="secondary">
                    Login
                  </NavbarButton>
                  <NavbarButton href="/signup">Sign Up</NavbarButton>
                </div>
              )}
            </div>
          </div>
        </NavBody>
      </div>

      {/* Mobile Navbar */}
      <MobileNav>
        <MobileNavHeader>
          <div className="flex items-center justify-between w-full px-4">
            <NavbarLogo />
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-md">
                    {totalQuantity}
                  </span>
                )}
              </Link>
              <MobileNavToggle
                isOpen={menuOpen}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default behavior
                  setMenuOpen(!menuOpen);
                }}
              />
            </div>
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={menuOpen}>
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior of link
                setMenuOpen(false);
                navigate(item.link); // Manually handle navigation
              }}
              className="py-2 px-4 hover:bg-gray-700 rounded w-full"
            >
              {item.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>
                Orders
              </Link>
              <button
                onClick={(e) => {
                  handleLogout(e);
                  setMenuOpen(false);
                }}
                className="py-2 px-4 text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

export default UserHeader;
