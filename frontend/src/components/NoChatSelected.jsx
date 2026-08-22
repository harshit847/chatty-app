import { Image as ImageIcon, MessageSquare, Sparkles } from "lucide-react";
import logo from "../assets/chatty-logo.png";

const FEATURES = [
  { icon: MessageSquare, label: "Realtime messaging" },
  { icon: ImageIcon, label: "Image sharing" },
  { icon: Sparkles, label: "AI reply suggestions" },
];

const NoChatSelected = () => {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center p-8">
      <div className="max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="relative rounded-3xl bg-primary/10 p-7 shadow-sm ring-1 ring-primary/15">
            <div className="absolute inset-0 rounded-3xl border border-primary/10" />
            <img src={logo} alt="Chatty Logo" className="w-24 object-contain sm:w-28" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome to Chatty</h2>
          <p className="text-sm leading-relaxed text-base-content/60 sm:text-base">
            Select a conversation from the sidebar to start chatting.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {FEATURES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100/80 px-3 py-1.5 text-xs font-medium text-base-content/60 shadow-sm"
            >
              <Icon className="size-3.5 text-primary" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
