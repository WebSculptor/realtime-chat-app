import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./chat-header";
import MessageInput from "./message-input";
import MessagesSkeleton from "./skeletons/messages-skeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

export default function ChatContainer() {
  const messageEndRef = useRef(null);
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessagesSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message?._id}
            className={`chat ${
              message?.fromId === authUser?._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message?._id === authUser?._id
                      ? authUser?.avatar || "/default.jpg"
                      : selectedUser?.avatar || "/default.jpg"
                  }
                  alt={authUser?.fName}
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time datetime="" className="text-xs opacity-50 ml-1">
                {formatMessageTime(message?.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col gap-1">
              {message?.image && (
                <img
                  src={message?.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message?.content && <p>{message?.content}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}
