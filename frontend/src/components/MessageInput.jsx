import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  const {
    sendMessage,
    selectedUser,
    messages,
    aiSuggestions,
    isAiSuggestionsLoading,
    aiSuggestionsError,
    requestAiReplySuggestions,
    clearAiReplySuggestions,
  } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleUseSuggestion = (suggestion) => {
    setText(suggestion);
    textInputRef.current?.focus();
  };

  const handleAiReply = async () => {
    const lastMessage = messages.filter((m) => m.senderId === selectedUser._id).slice(-1)[0];
    if (!lastMessage) {
      toast.error("No message to suggest replies for");
      return;
    }
    await requestAiReplySuggestions(lastMessage);
  };

  return (
    <div className="w-full shrink-0 px-3 pb-3 pt-2 sm:px-6 sm:pb-4">
      <div className="mx-auto w-full max-w-3xl">
      {(isAiSuggestionsLoading || aiSuggestions.length > 0 || aiSuggestionsError) && (
        <div className="mb-2.5">
          {isAiSuggestionsLoading && (
            <div className="flex items-center gap-1.5 rounded-2xl border border-primary/20 bg-primary/5 px-3.5 py-2.5 text-xs text-base-content/60 shadow-sm">
              <span className="loading loading-dots loading-xs text-primary" />
              Thinking of replies...
            </div>
          )}

          {!isAiSuggestionsLoading && aiSuggestions.length > 0 && (
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/5 p-2.5 shadow-md shadow-primary/10 backdrop-blur">
              <div className="mb-1.5 flex items-center gap-1.5 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary/80">
                <Sparkles size={12} />
                Suggested replies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {aiSuggestions.map((suggestion, idx) => (
                  <button
                    key={`${suggestion}-${idx}`}
                    type="button"
                    onClick={() => handleUseSuggestion(suggestion)}
                    className="btn btn-sm h-8 rounded-full border border-primary/25 bg-base-100 normal-case shadow-sm transition-all duration-150 hover:-translate-y-px hover:border-primary/50 hover:bg-primary hover:text-primary-content"
                  >
                    <Sparkles size={12} className="text-primary transition-colors group-hover:text-primary-content" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isAiSuggestionsLoading && !aiSuggestions.length && aiSuggestionsError && (
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-base-300 bg-base-100 px-3.5 py-2 text-xs text-base-content/50 shadow-sm">
              <span>{aiSuggestionsError}</span>
              <button
                type="button"
                onClick={clearAiReplySuggestions}
                aria-label="Dismiss"
                className="btn btn-circle btn-ghost btn-xs"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      )}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-base-300 shadow-sm"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-1 rounded-full border border-base-300 bg-base-100 py-1.5 pl-4 pr-1.5 shadow-lg shadow-base-300/30 transition-colors focus-within:border-primary/40"
      >
        <input
          type="text"
          className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-base-content/40 sm:h-10"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={textInputRef}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button
          type="button"
          className={`btn btn-circle btn-sm shrink-0 bg-transparent transition-colors duration-150 ${
            imagePreview ? "text-success" : "text-base-content/40 hover:bg-base-200 hover:text-primary"
          }`}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach image"
        >
          <Image size={19} />
        </button>
        <button
          type="button"
          className="btn btn-circle btn-sm shrink-0 bg-transparent text-primary hover:bg-primary/10 disabled:text-base-content/30"
          onClick={handleAiReply}
          disabled={isAiSuggestionsLoading || !selectedUser}
          title="AI Reply Suggestions"
          aria-label="AI reply suggestions"
        >
          <Sparkles size={19} />
        </button>
        <button
          type="submit"
          className="btn btn-circle btn-sm btn-primary shrink-0 shadow-md shadow-primary/30"
          disabled={!text.trim() && !imagePreview}
          aria-label="Send message"
        >
          <Send size={17} />
        </button>
      </form>
      </div>
    </div>
  );
};

export default MessageInput;
