import { useEffect, useState } from "react";
import moment from "moment";

export default function Comment({ comment }) {
  const [user, setUser] = useState({});

  console.log(user);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        // console.log(" user data : ", data);

        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [comment]);

  return (
    <>
      <div className="flex p-4 ">
        <div className="flex-shrink-0 mr-3">
          <img
            src={user.profilePicture}
            className="w-10 h-10 bg-gray-200 rounded-full"
            alt={user.username}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-bold mr-1 text-xs truncate">
              {user ? `@${user.username}` : "anonymous user"}
            </span>

            <span className="text-gray-500 text-xs">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>

          <p className="text-gray-500 pb-2 mr-2">{comment.content}</p>
        </div>
      </div>
    </>
  );
}
