import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
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
            Medium
          </span>
          Blogs
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

          <Navbar.Toggle />
        </div>

        {/* hamberger menu */}
        <Navbar.Collapse>
          <Link
            to="/"
            className={`block px-3 py-2 text-lg font-medium rounded-md transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              path === "/"
                ? "bg-gray-100 dark:bg-gray-800 text-indigo-600"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`block  px-3 py-2  text-lg font-medium rounded-md transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              path === "/about"
                ? "bg-gray-100 dark:bg-gray-800 text-indigo-600"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            About
          </Link>

          <Link
            to="/projects"
            className={`block  px-3 py-2  text-lg font-medium rounded-md transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              path === "/projects"
                ? "bg-gray-100 dark:bg-gray-800 text-indigo-600"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Projects
          </Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
