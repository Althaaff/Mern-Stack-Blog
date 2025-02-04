import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useRef, useState } from "react";
import PostCard from "../components/PostCard";
import { tailspin } from "ldrs";
import { useSelector } from "react-redux";
import gsap from "gsap";
import ImageSlider from "../components/ImageSlider";

tailspin.register();

export default function Home() {
  const [posts, setPosts] = useState(null); // Set initial state to null (to differentiate between loading and empty)
  const [loading, setLoading] = useState(true);
  const { theme } = useSelector((state) => state.theme);
  const textRef = useRef(null);

  // console.log(theme);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts");
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    gsap.from(textRef.current, {
      y: -50, // Move from 50px above
      opacity: 0, // Start fully hidden
      duration: 1.5, // Animation duration
      ease: "power2.out", // Smooth easing
    });
  }, []);

  return (
    <div>
      <div className="flex flex-col mt-16 md:flex-row justify-around items-center gap-8 max-w-7xl mx-auto ">
        {/* Blog Text */}
        <div ref={textRef} className="flex flex-col gap-6 p-10 ">
          <h1 className="text-4xl font-bold lg:text-6xl">Welcome to my Blog</h1>
          <p className="text-gray-500 text-sm sm:text-sm">
            Here you'll find a variety of articles and tutorials on topics such
            as web development software engineering, and programming languages.
          </p>
          <Link
            to="/search"
            className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
          >
            View all posts
          </Link>
        </div>

        {/* Image Slider */}
        <div className="flex justify-center items-center w-[320px]">
          <ImageSlider />
        </div>
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700 max-w-7xl mx-auto rounded-md">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {/* Show Spinner if Loading */}
        {loading && (
          <div className="flex justify-center items-center h-32">
            <l-tailspin
              size="40"
              stroke="5"
              speed="0.9"
              color={theme === "light" ? "black" : "white"}
            ></l-tailspin>
          </div>
        )}

        {/* Show "No Posts Found" Message if Posts Array is Empty */}
        {!loading && posts?.length === 0 && (
          <div className="text-center text-gray-500">No posts found.</div>
        )}

        {/* Show Posts When Available */}
        {!loading && posts?.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
