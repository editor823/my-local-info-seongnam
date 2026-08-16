"use client";

import { useState, useRef, useEffect } from "react";
import chatData from "../../public/data/chat-data.json";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "안녕하세요! 성남시 생활 정보 봇입니다. 🤖\n궁금하신 질문을 아래 버튼에서 선택해주세요!",
      time: getCurrentTime(),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // 메시지가 추가될 때마다 아래로 부드럽게 스크롤
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleQuestionClick = (question: string, answer: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: question,
      time: getCurrentTime(),
    };

    // 내 질문(오른쪽 파란 말풍선) 추가
    setMessages((prev) => [...prev, userMsg]);

    // 약간의 딜레이 후 AI 답변(왼쪽 회색 말풍선) 추가
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: answer,
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* 1. 채팅창 컨테이너 */}
      <div
        className={`fixed inset-0 sm:inset-auto sm:right-5 sm:bottom-20 w-full sm:w-[360px] h-full sm:h-[500px] bg-white sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right z-50 ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* 상단: 봇 이름과 상태 표시 */}
        <div className="bg-[#2b72c4] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-xl backdrop-blur-sm">
              🤖
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#2b72c4] rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm">성남이 AI 상담원</h3>
              <p className="text-[11px] text-blue-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                온라인 · 실시간 응답 가능
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="채팅창 닫기"
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 중앙: 카카오톡 스타일 말풍선 대화 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#b2c7da]/20">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                {!isUser && (
                  <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-1">
                    AI 상담원
                  </span>
                )}
                <div
                  className={`flex items-end gap-1.5 max-w-[85%] ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                      isUser
                        ? "bg-[#2b72c4] text-white rounded-br-none"
                        : "bg-white text-slate-800 rounded-bl-none border border-slate-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 pb-0.5">
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* 하단: 자주 묻는 질문 버튼 영역 */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <p className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <span>💡</span> 자주 묻는 질문을 눌러보세요:
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {chatData.map((item, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(item.question, item.answer)}
                className="text-left text-xs bg-slate-100 hover:bg-[#e8f3ff] hover:text-[#2b72c4] text-slate-700 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors leading-tight"
              >
                💬 {item.question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 플로팅 챗봇 버튼 (오른쪽 하단 원형 버튼) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "채팅 닫기" : "채팅 열기"}
        className="w-14 h-14 rounded-full bg-[#2b72c4] hover:bg-[#205ca1] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
