import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatDayLabel, formatMessageTime } from "../lib/utils";
import { ArrowDown } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    aiSuggestions,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const scrollRef = useRef(null);
  const [showJumpButton, setShowJumpButton] = useState(false);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // The scroll area shrinks when the suggestions panel opens; keep the
  // latest message in view without jumping if it is already visible.
  useEffect(() => {
    if (aiSuggestions.length > 0) {
      messageEndRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [aiSuggestions]);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    setShowJumpButton(el.scrollHeight - el.scrollTop - el.clientHeight > 240);
  };

  const jumpToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderMessagesWithDateLabels = () => {
    return messages.map((message, i) => {
      const prev = messages[i - 1];
      const next = messages[i + 1];

      const isSent = message.senderId === authUser._id;
      const newDay =
        !prev || new Date(prev.createdAt).toDateString() !== new Date(message.createdAt).toDateString();
      const sameAsPrev =
        !newDay && Boolean(prev) && prev.senderId === message.senderId;
      const sameAsNext =
        Boolean(next) &&
        next.senderId === message.senderId &&
        new Date(next.createdAt).toDateString() === new Date(message.createdAt).toDateString();

      const showDateLabel = newDay;

      return (
        <div key={message._id}>
          {showDateLabel && (
            <div className="my-8 flex items-center justify-center">
              <span className="rounded-full border border-base-300 bg-base-100/90 px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-base-content/50 shadow-sm backdrop-blur">
                {formatDayLabel(message.createdAt)}
              </span>
            </div>
          )}

          <div
            className={`flex items-end gap-2.5 ${isSent ? "justify-end" : "justify-start"} ${
              sameAsPrev ? "mt-1" : "mt-4"
            }`}
          >
            {!isSent &&
              (sameAsNext ? (
                <div className="size-8 shrink-0" />
              ) : (
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt={selectedUser.fullName}
                  className="size-8 shrink-0 rounded-full object-cover ring-1 ring-base-300"
                />
              ))}

            <div
              className={`flex max-w-[82%] flex-col sm:max-w-[68%] ${
                isSent ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`flex flex-col px-4 py-2.5 shadow-sm ${
                  isSent
                    ? `bg-primary text-primary-content shadow-primary/20 ${
                        sameAsNext ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-br-md"
                      }`
                    : `border border-base-300 bg-base-100 text-base-content ${
                        sameAsNext ? "rounded-2xl rounded-bl-sm" : "rounded-2xl rounded-bl-md"
                      }`
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="mb-1.5 max-w-[240px] cursor-pointer rounded-xl transition-transform duration-200 hover:scale-[1.02]"
                    onClick={() => window.open(message.image, "_blank")}
                  />
                )}
                {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
              </div>
              {!sameAsNext && (
                <p
                  className={`mt-1.5 px-1 text-[10px] font-medium tabular-nums tracking-wide text-base-content/45 ${
                    isSent ? "text-right" : "text-left"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  if (isMessagesLoading) {
    return (
      <div className="flex h-full flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      {/* min-h-0 lets this area shrink when the suggestions panel grows,
          keeping suggestions + composer fully inside the viewport */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto overscroll-contain px-4 pt-6 pb-8 sm:px-6"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center py-24 text-center">
                <div>
                  <div className="inline-block rounded-full bg-base-100 p-2 shadow-md ring-1 ring-base-300">
                    <img
                      src={selectedUser.profilePic || "/avatar.png"}
                      alt={selectedUser.fullName}
                      className="size-16 rounded-full object-cover"
                    />
                  </div>
                  <p className="mt-4 font-semibold tracking-tight">{selectedUser.fullName}</p>
                  <p className="mt-1.5 max-w-[240px] text-sm leading-relaxed text-base-content/50">
                    Send a message to start the conversation
                  </p>
                </div>
              </div>
            ) : (
              renderMessagesWithDateLabels()
            )}
            <div ref={messageEndRef} />
          </div>
        </div>

        {showJumpButton && (
          <button
            onClick={jumpToBottom}
            className="btn btn-circle btn-sm absolute bottom-4 left-1/2 z-10 -translate-x-1/2 border border-base-300 bg-base-100 text-base-content/70 shadow-lg hover:text-primary"
            aria-label="Scroll to latest messages"
          >
            <ArrowDown size={16} />
          </button>
        )}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
