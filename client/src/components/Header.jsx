import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import { signOutSuccess } from "../redux/user/userSlice.js";
import { useEffect, useState } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // console.log(searchTerm);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });

      const data = await res.json();
      console.log("signout :", data);

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    // console.log("search query :", searchQuery);
    navigate(`/search?${searchQuery}`);
  };

  return (
    <>
      <Navbar className="border-b-2 fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            WriteFlow
          </span>
          Blog
        </Link>

        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button
            className="h-10 w-12 lg:hidden"
            color="gray"
            pill
            onClick={handleSubmit}
          >
            <AiOutlineSearch />
          </Button>
        </form>
        <div className="flex gap-2 md:order-2">
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>

                <Link to={"/dashboard?tab=profile"}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />

                <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              </Dropdown.Header>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            className="w-10 h-10 flex items-center justify-center md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={28} /> : <FaBars size={26} />}
          </button>
        </div>

        {/* hamberger menu */}
        <Navbar.Collapse className={isMenuOpen ? "block" : "hidden"}>
          <Link
            to="/"
            className={`block px-3 py-2 text-lg font-medium rounded-md transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              path === "/"
                ? "bg-gray-100 dark:bg-gray-800 text-indigo-600"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`block px-3 py-2 text-lg font-medium rounded-md transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              path === "/about"
                ? "bg-gray-100 dark:bg-gray-800 text-indigo-600"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          <Link
            to="/projects"
            className={`block px-3 py-2 text-lg font-medium rounded-md transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              path === "/projects"
                ? "bg-gray-100 dark:bg-gray-800 text-indigo-600"
                : "text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Projects
          </Link>

          <button
            className={`block lg:hidden md:hidden sm:hidden px-3 py-2 text-lg font-medium rounded-md transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 w-full`}
            onClick={() => {
              dispatch(toggleTheme());
              setIsMenuOpen(false);
            }}
          >
            {theme === "light" ? (
              <span className="flex flex-row items-center">
                <FaMoon className="mr-2" /> Dark Mode
              </span>
            ) : (
              <span className="flex flex-row items-center">
                <FaSun className="mr-2" /> Light Mode
              </span>
            )}
          </button>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
