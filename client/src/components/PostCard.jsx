import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div
      className="group relative w-full sm:w-[350px] lg:w-[320px]  h-[420px] overflow-hidden rounded-lg transition-all shadow-md shadow-black/25
 flex flex-col"
    >
      <Link to={`/post/${post.slug}`} className="flex-1">
        <img
          src={post.image}
          alt="post cover"
          className="h-[240px] w-full object-cover transition-all duration-300 group-hover:h-[200px]"
        />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm text-gray-600">{post.category}</span>
      </div>
      <Link
        to={`/post/${post.slug}`}
        className="absolute bottom-[-60px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md m-2 group-hover:bottom-2"
      >
        Read article
      </Link>
    </div>
  );
}
