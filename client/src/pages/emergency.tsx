import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Send,
  Phone,
  MapPin,
  AlertCircle,
  Bot,
  User,
  Loader2,
  Building2,
  Heart,
  RefreshCw,
  Mic,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Hospital } from "@shared/schema";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isRedAlert?: boolean;
  severity?: "LOW" | "MEDIUM" | "CRITICAL";
  timestamp: Date;
}

export default function Emergency() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [severity, setSeverity] = useState<"LOW" | "MEDIUM" | "CRITICAL">("LOW");
  const [location, setLocation] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);

  /* ---------------- HOSPITAL FETCH ---------------- */

  const { data: hospitals } = useQuery<Hospital[]>({
    queryKey: ["/api/hospitals"],
  });

  /* ---------------- LOCATION ---------------- */

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
    });
  }, []);

  /* ---------------- LOCAL STORAGE SAVE ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem("emergency-chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("emergency-chat", JSON.stringify(messages));
  }, [messages]);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ---------------- SEVERITY DETECTION ---------------- */

  const detectSeverity = (text: string) => {
    const t = text.toLowerCase();

    if (
      t.includes("chest pain") ||
      t.includes("unconscious") ||
      t.includes("breathing")
    ) return "CRITICAL";

    if (t.includes("fever") || t.includes("vomiting")) return "MEDIUM";

    return "LOW";
  };

  /* ---------------- VOICE INPUT ---------------- */

  const startVoice = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.start();

    recognition.onresult = (e: any) => {
      setInput(e.results[0][0].transcript);
    };
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {
    if (!input.trim()) return;

    const detected = detectSeverity(input);
    setSeverity(detected);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      severity: detected,
      timestamp: new Date(),
    };

    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsStreaming(true);

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      severity: detected,
      isRedAlert: detected === "CRITICAL",
      timestamp: new Date(),
    };

    setMessages((p) => [...p, assistantMsg]);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/emergency/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, location }),
      });

      const data = await res.json();

      setMessages((p) => {
        const copy = [...p];
        copy[copy.length - 1].content = data.reply;
        return copy;
      });

    } catch {
      setMessages((p) => {
        const copy = [...p];
        copy[copy.length - 1].content = "Server error. Seek medical help.";
        return copy;
      });
    }

    setIsStreaming(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col h-full p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-3 items-center">
          <AlertTriangle className="text-red-500 w-8 h-8 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold">Emergency AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Real-time medical triage + hospital guidance
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setMessages([]);
            localStorage.removeItem("emergency-chat");
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* SEVERITY METER */}
      <Card className="mb-4">
        <CardContent className="flex items-center justify-between py-2">
          <span className="text-sm">Current Risk Level</span>

          <Badge
            variant={
              severity === "CRITICAL"
                ? "destructive"
                : severity === "MEDIUM"
                ? "secondary"
                : "outline"
            }
          >
            <ShieldAlert className="w-3 h-3 mr-1" />
            {severity}
          </Badge>
        </CardContent>
      </Card>

      {/* CHAT */}
      <Card className="flex-1 flex flex-col">

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground">
              <Heart className="mx-auto mb-2" />
              Describe symptoms to begin diagnosis
            </div>
          )}

          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${
                  m.role === "user" ? "justify-end" : ""
                }`}
              >
                {m.role === "assistant" && <Bot />}

                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%]
                  ${
                    m.role === "user"
                      ? "bg-primary text-white"
                      : m.isRedAlert
                      ? "bg-red-100"
                      : "bg-muted"
                  }`}
                >
                  {m.content || (
                    <Loader2 className="animate-spin w-4 h-4" />
                  )}
                </div>

                {m.role === "user" && <User />}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* INPUT */}
        <div className="border-t p-4 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe symptoms..."
            disabled={isStreaming}
          />

          <Button onClick={sendMessage}>
            {isStreaming ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send />
            )}n
          </Button>

          <Button variant="secondary" onClick={startVoice}>
            <Mic />
          </Button>
        </div>
      </Card>

      {/* FLOATING EMERGENCY CALL */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-xl"
        variant="destructive"
      >
        <Phone />
      </Button>
    </div>
  );
}
