import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowDown,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashBoardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalPosts, setTotalPosts] = useState([]);
  const [totalComments, setTotalComments] = useState([]);
  const [lastMonthUsers, setLastMonthUsers] = useState([]);
  const [lastMonthPosts, setLastMonthPosts] = useState([]);
  const [lastMonthComments, setLastMonthComments] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");

        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);

          setTotalUsers(data.totalUsers);

          setLastMonthUsers(data.setLastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");

        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);

          setTotalPosts(data.totalPosts);

          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");

        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);

          setTotalComments(data.totalComments);

          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <>
      <div className="p-3 md:mx-auto mt-16 ">
        <div className="flex-wrap flex justify-center gap-4 mt-4">
          {/* Total Users */}
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                <p className="text-2xl">{totalUsers}</p>
              </div>
              <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>

            <div className="flex text-sm">
              <span className="flex items-center">
                {lastMonthUsers > 0 ? (
                  <HiArrowNarrowUp className="text-green-500" />
                ) : (
                  <HiArrowNarrowDown className="text-red-500" />
                )}
              </span>

              <div className="p-1">
                <span
                  className={
                    lastMonthUsers > 0 ? "text-green-400" : "text-red-500 mr-2"
                  }
                >
                  {lastMonthUsers ?? "0"}
                </span>
                Last Month Users
              </div>
            </div>
          </div>

          {/* Total Comments */}
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">
                  Total Comments
                </h3>
                <p className="text-2xl">{totalComments}</p>
              </div>
              <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>

            <div className="flex text-sm">
              <span className="flex items-center">
                {lastMonthComments > 0 ? (
                  <HiArrowNarrowUp className="text-green-500" />
                ) : (
                  <HiArrowNarrowDown className="text-red-500" />
                )}
              </span>

              <div className="p-1">
                <span
                  className={
                    lastMonthComments > 0
                      ? "text-green-400 mr-2"
                      : "text-red-500 mr-2"
                  }
                >
                  {lastMonthComments ?? "0"}
                </span>
                Last Month Comments
              </div>
            </div>
          </div>

          {/* Total Posts */}
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                <p className="text-2xl">{totalPosts}</p>
              </div>
              <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>

            <div className="flex text-sm">
              <span className="flex items-center">
                {lastMonthPosts > 0 ? (
                  <HiArrowNarrowUp className="text-green-500" />
                ) : (
                  <HiArrowNarrowDown className="text-red-500" />
                )}
              </span>

              <div className="p-1">
                <span
                  className={
                    lastMonthPosts > 0 ? "text-green-400" : "text-red-500 mr-2"
                  }
                >
                  {lastMonthPosts ?? "0"}
                </span>
                Last Month Posts
              </div>
            </div>
          </div>
        </div>

        {/* users and comments */}
        <div className="flex flex-wrap gap-4 py-3 mt-8 mx-auto justifycenter">
          <div className="flex flex-col w-full md:w-auto shadow-md p-2">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Users</h1>
              <Button
                type="button"
                className=""
                outline
                gradientDuoTone="purpleToPink"
              >
                <Link to={"/dashboard?tab=users"}>See All</Link>
              </Button>
            </div>

            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>

              {users &&
                users.map((user) => (
                  <Table.Body key={user._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="">
                        <img
                          src={user.profilePicture}
                          alt="user"
                          className="w-10 h-10 rounded-full bg-gray-500"
                        />
                      </Table.Cell>

                      <Table.Cell>{user.username}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>

          <div className="flex flex-col w-full md:w-auto shadow-md p-2">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Comments</h1>
              <Button
                type="button"
                className=""
                outline
                gradientDuoTone="purpleToPink"
              >
                <Link to={"/dashboard?tab=comments"}>See All</Link>
              </Button>
            </div>

            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>

              {comments &&
                comments.map((comment) => (
                  <Table.Body key={comment._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="w-96">
                        <p className="line-clamp-2">{comment.content}</p>
                      </Table.Cell>

                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>

          <div className="flex flex-col w-full md:w-auto shadow-md p-2">
            <div className="flex justify-between p-3 text-sm font-semibold">
              <h1 className="text-center p-2">Recent Posts</h1>
              <Button
                type="button"
                className=""
                outline
                gradientDuoTone="purpleToPink"
              >
                <Link to={"/dashboard?tab=posts"}>See All</Link>
              </Button>
            </div>

            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
              </Table.Head>

              {posts &&
                posts.map((post) => (
                  <Table.Body key={post._id} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="">
                        <img
                          src={post.image}
                          alt="post"
                          className="w-14 h-10 rounded-md bg-gray-500"
                        />
                      </Table.Cell>

                      <Table.Cell className="w-96">{post.title}</Table.Cell>
                      <Table.Cell className="w-5">{post.category}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
