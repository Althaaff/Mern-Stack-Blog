import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection.jsx";
import PostCard from "../components/PostCard.jsx";
import { toast } from "react-toastify";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const textCopiedRef = useRef(false);
  // console.log("recentpost :", recentPosts);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);

        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          setError(true);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPost = async () => {
      const res = await fetch(`/api/post/getposts?limit=3`);
      const data = await res.json();

      if (res.ok) {
        setRecentPosts(data.posts);
      }
    };

    fetchRecentPost();
  }, []);

  const copyTextToClipboard = (text) => {
    const plainText = text.replace(/<[^>]+>/g, "");

    if (navigator.clipboard) {
      console.log("navigator :", navigator.clipboard);
      navigator.clipboard
        .writeText(plainText)
        .then(() => {
          toast.success("Text copied to clipboard!");

          textCopiedRef.current = true;

          setTimeout(() => {
            textCopiedRef.current = false;
          }, 3000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.error("Failed to copy text.");
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = plainText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Text copied to clipboard!");
      } catch (err) {
        console.error("Fallback: Failed to copy text", err);
        toast.error("Failed to copy text.");
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <>
      <main className="p-3 flex flex-col max-w-8xl mx-auto mt-5 min-h-screen overflow-hidden">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post && post.title}
        </h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className="self-center mt-5"
        >
          <Button pill color="gray" size="xs">
            {post && post.category}
          </Button>
        </Link>
        <img
          src={post && post.image}
          alt={post && post.title}
          className="mt-10 p-3 max-h-[600px] max-w-5xl w-full object-cover mx-auto block"
        />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic text-blue-500">
            {post && (post.content.length / 1000).toFixed(0)} mins read.
          </span>
        </div>
        <div className="bg-gray-800 mx-auto rounded flex flex-col m-1 overflow-hidden">
          <div
            className="p-6 mx-auto max-w-4xl w-full text-lg post-content prose prose-lg prose-headings:font-bold prose-headings:text-gray-800 text-white prose-p:text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:text-gray-600 prose-ul:list-disc prose-ol:list-decimal prose-li:my-2"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>{" "}
          <div className="flex justify-end p-2">
            <button
              className="p-2 h-8 rounded-md bg-slate-400 hover:bg-slate-500 flex justify-center items-center"
              onClick={() => copyTextToClipboard(post.content)}
            >
              {!textCopiedRef.current && <i className="fa-regular fa-copy"></i>}
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto w-full ">
          <CallToAction />
        </div>
        <CommentSection postId={post._id} />
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="text-xl mt-5">Recent articles</h1>
          <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {recentPosts &&
              recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
