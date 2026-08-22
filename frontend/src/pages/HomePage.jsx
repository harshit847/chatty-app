import { useChatStore } from "../store/useChatStore";

import IconRail from "../components/IconRail";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen flex overflow-hidden bg-base-100">
      <IconRail />

      {/* Chat sidebar - full screen on mobile when no chat is open */}
      <div
        className={`h-full border-r border-base-300 bg-base-100 ${
          selectedUser ? "hidden lg:block" : "block w-full lg:w-80 xl:w-96"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main chat area */}
      <main
        className={`chat-canvas h-full flex-1 flex-col bg-base-200/40 ${
          selectedUser ? "flex" : "hidden lg:flex"
        }`}
      >
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </main>
    </div>
  );
};
export default HomePage;
