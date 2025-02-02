import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner, Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection.jsx";
import PostCard from "../components/PostCard.jsx";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
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

        <div
          className="p-3 mx-auto max-w-2xl w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>

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
