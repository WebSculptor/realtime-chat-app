import ChatContainer from "../components/chat-container";
import NotSelected from "../components/not-selected";
import Sidebar from "../components/sidebar";
import { useChatStore } from "../store/useChatStore";

export default function HomePage() {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-7xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NotSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}
