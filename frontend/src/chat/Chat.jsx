import React, { useState, useEffect } from "react";
import {
  UserCircle,
  Check,
  CheckCheck,
  Menu,
  X,
  Send,
  Store,
} from "lucide-react";
import DistributorsNavbar from "../components/Navbar/DistributorsNavbar";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";
import AdminNav from "../components/Navbar/AdminNav";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentChats, setCurrentChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isDistributor, setIsDistributor] = useState(false);

  // *******************************************
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const userRole = userData?.role; // Fetch the user's role from local storage

  // Determine which navbar to render based on user role
  const renderNavbar = () => {
    switch (userRole) {
      case "retailer":
        return <RetailerNavbar />;
      case "distributor":
        return <DistributorsNavbar />;
      case "admin":
        return <AdminNav />;
      default:
        return null; // Return nothing if no role matches
    }
  };
  // Keeping the same useEffect logic
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");

    try {
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData?.email) {
          setUserEmail(userData.email);
          setUserName(userData.name || "");
          setIsDistributor(userData.role === "distributor");
          fetchAcceptedUsers(userData.email);
          return;
        }
      }

      const email = localStorage.getItem("email");
      const name = localStorage.getItem("name");
      const role = localStorage.getItem("role");

      if (email) {
        setUserEmail(email);
        setUserName(name || "");
        setIsDistributor(role === "distributor");
        fetchAcceptedUsers(email);
      } else {
        const userdataString = localStorage.getItem("userdata");
        if (userdataString) {
          const userdata = JSON.parse(userdataString);
          if (userdata?.email) {
            setUserEmail(userdata.email);
            setUserName(userdata.name || "");
            setIsDistributor(userdata.role === "distributor");
            fetchAcceptedUsers(userdata.email);
            return;
          }
        }

        setLoading(false);
        setError("Please login to access chat");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setLoading(false);
      setError("Error loading user data");
    }
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const fetchAcceptedUsers = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/network/accepted/${email}`,
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const networkData = await response.json();

      const usersWithConversations = await Promise.all(
        networkData.map(async (user) => {
          const isDistributor = user.distributorEmail === email;
          const otherEmail = isDistributor
            ? user.userEmail
            : user.distributorEmail;
          const otherName = isDistributor
            ? user.userName
            : user.distributorName;
          const otherImage = isDistributor ? user.retail_img : user.dist_img;

          try {
            const conversationRes = await fetch(
              `http://localhost:8000/api/chat/conversations/${email}/${otherEmail}`,
              {
                credentials: "include",
              }
            );
            const conversation = await conversationRes.json();

            return {
              _id: user._id,
              name: otherName,
              email: otherEmail,
              image: otherImage,
              lastChat: conversation?.lastChat,
              conversationId: conversation?._id,
              networkId: user._id,
            };
          } catch (error) {
            console.error("Error fetching conversation:", error);
            return {
              _id: user._id,
              name: otherName,
              email: otherEmail,
              image: otherImage,
              networkId: user._id,
            };
          }
        })
      );

      setUsers(usersWithConversations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accepted users:", error);
      setError("Failed to load users");
      setLoading(false);
    }
  };

  // Keep existing fetchChats, selectUser, and sendMessage functions
  const fetchChats = async (conversationId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/chat/${conversationId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await response.json();
      setCurrentChats(data);

      if (data.length > 0) {
        await fetch(`/api/chats/mark-read`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId,
            receiverEmail: userEmail,
          }),
        });
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError("Failed to load chat messages");
    }
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    if (user.conversationId) {
      fetchChats(user.conversationId);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch("http://localhost:8000/api/chat/chats", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderEmail: userEmail,
          receiverEmail: selectedUser.email,
          content: newMessage,
          conversationId: selectedUser.conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setCurrentChats([...currentChats, data]);
      setNewMessage("");

      fetchAcceptedUsers(userEmail);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <Check className="w-4 h-4 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {renderNavbar()} {/* Render the appropriate navbar */}
      <div className="flex h-screen bg-gray-900">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed top-4 right-4 z-50 p-2 bg-violet-600 text-white rounded-full shadow-lg"
          onClick={toggleSidebar}
        >
          {showSidebar ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Users List Sidebar */}
        <div
          className={`${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } transform transition-transform duration-300 ease-in-out md:translate-x-0 fixed md:static w-full md:w-1/3 lg:w-1/4 bg-gray-800 border-r border-gray-700 h-full z-40`}
        >
          <div className="p-4 border-b border-gray-700 bg-gray-900">
            <h2 className="text-xl font-semibold text-white">Messages</h2>
          </div>

          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {loading && (
              <div className="p-4 text-center text-gray-400">
                <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                Loading conversations...
              </div>
            )}

            {error && (
              <div className="p-4 text-center text-red-400 bg-red-900/50">
                {error}
              </div>
            )}

            {!loading && !error && users.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No conversations found
              </div>
            )}

            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  selectUser(user);
                  if (window.innerWidth < 768) {
                    setShowSidebar(false);
                  }
                }}
                className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 transition-colors duration-200 ${
                  selectedUser?._id === user._id ? "bg-violet-900/50" : ""
                }`}
              >
                <div className="relative">
                  {user.image ? (
                    <div className="relative">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-violet-400"
                      />
                      {isDistributor && (
                        <div className="absolute -bottom-1 -right-1 bg-violet-600 rounded-full p-1">
                          <Store className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <UserCircle className="w-12 h-12 text-gray-400" />
                      {isDistributor && (
                        <div className="absolute -bottom-1 -right-1 bg-violet-600 rounded-full p-1">
                          <Store className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-white">{user.name}</h3>
                    {user.lastChat && (
                      <span className="text-xs text-gray-400">
                        {formatTime(user.lastChat.createdAt)}
                      </span>
                    )}
                  </div>
                  {user.lastChat && (
                    <p className="text-sm text-gray-400 truncate">
                      {user.lastChat.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700 bg-gray-800 shadow-md flex items-center">
                <div className="relative">
                  {selectedUser.image ? (
                    <div className="relative">
                      <img
                        src={selectedUser.image}
                        alt={selectedUser.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-violet-400"
                      />
                      {isDistributor && (
                        <div className="absolute -bottom-1 -right-1 bg-violet-600 rounded-full p-1">
                          <Store className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <UserCircle className="w-10 h-10 text-gray-400" />
                      {isDistributor && (
                        <div className="absolute -bottom-1 -right-1 bg-violet-600 rounded-full p-1">
                          <Store className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-400">{selectedUser.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-800">
                {currentChats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`flex ${
                      chat.senderEmail === userEmail
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="max-w-[85%] md:max-w-[70%] lg:max-w-[60%]">
                      <div
                        className={`p-3 rounded-2xl ${
                          chat.senderEmail === userEmail
                            ? "bg-violet-600 text-white"
                            : "bg-gray-700 text-gray-100"
                        }`}
                      >
                        <p className="break-words">{chat.content}</p>
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-400">
                          {formatTime(chat.createdAt)}
                        </span>
                        {chat.senderEmail === userEmail && (
                          <span>{getStatusIcon(chat.status)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400"
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-6 py-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden md:inline">Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
              <div className="text-center">
                <UserCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Select a conversation to start messaging
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Your messages will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
