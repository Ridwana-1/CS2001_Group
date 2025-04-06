/**
 * ChatInterface Component
 * @author Sultan Jurabekov
 * @functionality Main chat interface component that handles:
 * - Real-time messaging between users
 * - Chat list management
 * - User search and new chat creation
 * - Message history and grouping
 * - Typing indicators
 * - Theme switching
 * - User profile management
 * - Responsive design with mobile support
 * @created February 15, 2024
 */

import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/InputDesign.module.css";
import { getAvatarByEmail } from "../../utils/avatars";
import api from "../../api/axios";
import UserSearch from "./UserSearch";
import { useNavigate } from 'react-router-dom';
import useAvatar from '../../hooks/useAvatar';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/ThemeColors.css';
import { FaUser, FaCog, FaSignOutAlt, FaSun, FaMoon, FaPaperPlane, FaPlus } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from "../../contexts/AuthContext";
import chatStyles from '../../styles/ChatStyles.module.css';
import MessageNotification from './MessageNotification';

// SVG Components
const MessagesIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 4V10C20 11.1 19.6 12 18.9 12.6C18.2 13.3 17.3 13.6 16.2 13.6V15.2C16.2 15.8 15.5 16.1 15 15.8L14.2 15.3C14.3 15.1 14.3 14.8 14.3 14.5V11C14.3 9.3 13 7.9 11.3 7.9H5.8C5.7 7.9 5.6 7.9 5.5 7.9V4C5.5 2.3 7 0.8 8.7 0.8H16.8C18.5 0.8 20 2.3 20 4Z"
      stroke="#476CFF"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.3 11V14.5C14.3 14.8 14.3 15.1 14.2 15.3C13.9 16.5 12.8 17.3 11.3 17.3H8.9L6.2 19.1C6.1 19.2 6 19.2 5.9 19.2C5.8 19.2 5.7 19.2 5.6 19.1C5.5 19.1 5.4 19 5.4 18.9C5.3 18.8 5.3 18.7 5.3 18.6V17.3C4.4 17.3 3.7 17 3.2 16.5C2.6 16 2.3 15.3 2.3 14.5V11C2.3 9.3 3.6 7.9 5.3 7.8C5.4 7.8 5.5 7.8 5.6 7.8H11.1C12.8 7.9 14.3 9.3 14.3 11Z"
      stroke="#476CFF"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.1667 10C16.1667 10.3333 16.1333 10.6667 16.0667 11L17.8667 12.4C18.0333 12.5333 18.0667 12.7667 17.9667 12.9333L16.3 15.7667C16.2 15.9333 15.9667 16 15.8 15.9333L13.7 15.1C13.2333 15.4333 12.7333 15.7 12.2 15.9L11.8667 18.1333C11.8333 18.3333 11.6667 18.5 11.4667 18.5H8.13333C7.93333 18.5 7.76667 18.3333 7.73333 18.1333L7.4 15.9C6.86667 15.7 6.36667 15.4333 5.9 15.1L3.8 15.9333C3.63333 16 3.4 15.9333 3.3 15.7667L1.63333 12.9333C1.53333 12.7667 1.56667 12.5333 1.73333 12.4L3.53333 11C3.46667 10.6667 3.43333 10.3333 3.43333 10C3.43333 9.66667 3.46667 9.33333 3.53333 9L1.73333 7.6C1.56667 7.46667 1.53333 7.23333 1.63333 7.06667L3.3 4.23333C3.4 4.06667 3.63333 4 3.8 4.06667L5.9 4.9C6.36667 4.56667 6.86667 4.3 7.4 4.1L7.73333 1.86667C7.76667 1.66667 7.93333 1.5 8.13333 1.5H11.4667C11.6667 1.5 11.8333 1.66667 11.8667 1.86667L12.2 4.1C12.7333 4.3 13.2333 4.56667 13.7 4.9L15.8 4.06667C15.9667 4 16.2 4.06667 16.3 4.23333L17.9667 7.06667C18.0667 7.23333 18.0333 7.46667 17.8667 7.6L16.0667 9C16.1333 9.33333 16.1667 9.66667 16.1667 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3333 14.1667L17.5 10L13.3333 5.83334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AddSquareIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 12H16M12 16V8M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Types
interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

interface Chat {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientAvatar?: string;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
  unreadCount: number;
}

interface User {
  id: string;
  email: string;
  fullname: string;
  avatar?: string;
}

// Add type for timeout
type TimeoutId = ReturnType<typeof setTimeout>;

// Sidebar Component
const Sidebar = ({ currentUser }: { currentUser: User | null }) => {
  const location = window.location.pathname;
  const isSettingsActive = location.includes('/settings');

  return (
    <aside className={styles.div2}>
      <div>
        <div className="w-[60px] h-[60px] rounded-full bg-blue-100 flex items-center justify-center mb-[65px]">
          <span className="text-2xl font-bold text-blue-500">M</span>
        </div>
        <nav className={styles.div3}>
          <a href="#" className={!isSettingsActive ? styles.div4 : styles.div6} aria-current={!isSettingsActive ? "page" : undefined}>
            <MessagesIcon />
            <h2 className={!isSettingsActive ? styles.div5 : styles.div7}>Chat</h2>
          </a>
          <a href="/settings" className={isSettingsActive ? styles.div4 : styles.div6} aria-current={isSettingsActive ? "page" : undefined}>
            <SettingsIcon />
            <h2 className={isSettingsActive ? styles.div5 : styles.div7}>Settings</h2>
          </a>
          <a href="/logout" className={styles.div6}>
            <LogoutIcon />
            <h2 className={styles.div7}>Logout</h2>
          </a>
        </nav>
      </div>
      <div className={styles.div8}>
        <img
          src={currentUser?.avatar || getAvatarByEmail(currentUser?.email || "")}
          alt="User profile"
          className={styles.avatar}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getAvatarByEmail(currentUser?.email || "");
          }}
        />
      </div>
    </aside>
  );
};

// Chat List Item Component
interface ChatListItemProps {
  chat: Chat;
  isActive?: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isActive = false,
  onClick,
}) => {
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`${chatStyles.chatListItem} ${isActive ? chatStyles.chatListItemActive : ''}`}
      onClick={onClick}
    >
      <div className={chatStyles.avatarContainer}>
        {chat.recipientAvatar ? (
          <img
            src={chat.recipientAvatar}
            alt={`${chat.recipientName}'s profile`}
            className={chatStyles.avatar}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.recipientName)}&background=random`;
            }}
          />
        ) : (
          <span className={chatStyles.avatarInitial}>{getInitial(chat.recipientName)}</span>
        )}
      </div>
      <div className={chatStyles.chatInfo}>
        <div className={chatStyles.chatName}>{chat.recipientName}</div>
        <div className={chatStyles.lastMessage}>
          {chat.lastMessage?.content || "No messages yet"}
        </div>
      </div>
      {chat.unreadCount > 0 && !isActive && (
        <div className={chatStyles.unreadIndicator}>
          {chat.unreadCount}
        </div>
      )}
    </div>
  );
};

// Chat List Component
const ChatList = ({
  chats,
  activeChat,
  onChatSelect,
  onAddChat
}: {
  chats: Chat[],
  activeChat: string | null,
  onChatSelect: (chatId: string) => void,
  onAddChat: () => void
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = searchTerm
    ? chats.filter(chat =>
        chat.recipientName.toLowerCase().includes(searchTerm.toLowerCase()))
    : chats;

  return (
    <section className={styles.div10}>
      <header className={styles.div11}>
        <h2 className={styles.div12}>Chats</h2>
        <button onClick={onAddChat} aria-label="Add new chat" className="cursor-pointer">
          <AddSquareIcon />
        </button>
      </header>
      <div className={styles.div13}>
        <div className="w-[372px] mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messenger..."
            className="w-full h-[53px] px-4 bg-[#F5F5F5] rounded-[16px] outline-none text-[16px] placeholder-gray-400 font-[-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif]"
          />
        </div>
      </div>
      <div className={styles.div16} role="list">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChat === chat.id}
              onClick={() => onChatSelect(chat.id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? "No chats found" : "No chats yet"}
          </div>
        )}
      </div>
    </section>
  );
};

// Message Component
interface MessageProps {
  text: string;
  isSent: boolean;
  isFile?: boolean;
  profileImage: string;
  timestamp: string;
}

const Message: React.FC<MessageProps> = ({
  text,
  isSent,
  isFile = false,
  profileImage,
  timestamp
}) => {
  const containerClass = isSent ? styles.div41 : styles.div43;
  const messageClass = isSent
    ? isFile
      ? styles.div50
      : styles.div42
    : styles.div44;

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  // Format timestamp to human-readable time
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={containerClass}>
      {isSent && (
        <p className={messageClass}>{text}</p>
      )}
      <div className="w-[32px] h-[32px] rounded-full bg-gray-100 flex items-center justify-center">
        {profileImage ? (
          <img
            src={profileImage}
            alt={isSent ? "Your profile" : "Contact's profile"}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent('User')}&background=random`;
            }}
          />
        ) : (
          <span className="text-sm font-medium text-gray-600">{getInitial("user@example.com")}</span>
        )}
      </div>
      {!isSent && (
        <p className={messageClass}>{text}</p>
      )}
    </div>
  );
};

// Chat Detail Component
const ChatDetail = ({
  currentUser,
  activeRecipient,
  messages,
  onSendMessage
}: {
  currentUser: User | null,
  activeRecipient: Chat | null,
  messages: Message[],
  onSendMessage: (content: string) => void
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<TimeoutId | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch typing state
  useEffect(() => {
    if (!activeRecipient) return;

    const fetchTypingStatus = async () => {
      try {
        const response = await api.get(`/chats/${activeRecipient.id}/typing`);
        setIsTyping(response.data.isTyping);
      } catch (error) {
        console.error('Error fetching typing status:', error);
        setIsTyping(false);
      }
    };

    const intervalId = setInterval(fetchTypingStatus, 3000);

    return () => {
      clearInterval(intervalId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeRecipient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      // Send typing status false
      api.post(`/chats/${activeRecipient?.id}/typing`, { isTyping: false });
    }
  };

  // Handle typing status with debounce
  useEffect(() => {
    if (!activeRecipient) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const handleTyping = async () => {
      try {
        await api.post(`/chats/${activeRecipient.id}/typing`, {
          isTyping: message.length > 0
        });
      } catch (error) {
        console.error('Error updating typing status:', error);
      }
    };

    if (message.length > 0) {
      handleTyping();
      typingTimeoutRef.current = setTimeout(async () => {
        try {
          await api.post(`/chats/${activeRecipient.id}/typing`, {
            isTyping: false
          });
        } catch (error) {
          console.error('Error updating typing status:', error);
        }
      }, 2000);
    } else {
      handleTyping();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, activeRecipient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeRecipient || !currentUser) {
    return (
      <div className={styles.noChatSelected}>
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  // Group messages by day
  const groupedMessages: { [date: string]: Message[] } = {};

  messages.forEach(msg => {
    const date = new Date(msg.timestamp).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(msg);
  });

  return (
    <>
      <div className={styles.chatHeader}>
        <img
          src={activeRecipient.recipientAvatar || getAvatarByEmail(activeRecipient.recipientId)}
          alt={activeRecipient.recipientName}
          className={styles.chatHeaderAvatar}
        />
        <div className={styles.chatHeaderInfo}>
          <div className={styles.chatHeaderName}>{activeRecipient.recipientName}</div>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date} className={styles.messageGroup}>
            <div className="text-center my-2">
              <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                {date}
              </span>
            </div>

            {dayMessages.map((msg) => {
              const isSent = msg.senderId === currentUser.id;
              const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={msg.id} className="mb-2">
                  <div
                    className={`${styles.messageBubble} ${isSent ? styles.sentMessage : styles.receivedMessage}`}
                  >
                    {msg.content}
                  </div>
                  <div className={`${styles.messageTime} ${isSent ? styles.sentMessageTime : styles.receivedMessageTime}`}>
                    {time}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {isTyping && (
          <div className={styles.typingIndicator}>
            {activeRecipient.recipientName} is typing
            <div className={styles.typingDots}>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInputContainer}>
        <textarea
          className={styles.chatInput}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
        />
        <button
          className={styles.chatInputButton}
          onClick={handleSubmit}
          disabled={!message.trim()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </>
  );
};

// Main Component
const ChatInterface: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const activeChatRef = useRef<HTMLDivElement>(null);
  const avatarPath = useAvatar(currentUser?.id);
  const { user } = useAuth();

  // Закрытие бургер-меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowBurgerMenu(false);
      }
    };

    if (showBurgerMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBurgerMenu]);

  // Закрытие активного чата при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeChatRef.current && !activeChatRef.current.contains(event.target as Node)) {
        setActiveChat(null);
      }
    };

    if (activeChat) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeChat]);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/auth/profile');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch chats and update unread status
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get('/chats');
        const chatsData = response.data.chats || [];
        setChats(chatsData);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chats/${activeChat}/messages`);
        if (response.data) {
          setMessages(response.data.messages || []);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    // Initial fetch
    fetchMessages();

    // Poll for new messages
    const intervalId = setInterval(fetchMessages, 2000);

    return () => clearInterval(intervalId);
  }, [activeChat, currentUser]);

  // WebSocket connection
  useEffect(() => {
    if (!user?.id) return;

    const ws = new WebSocket(`ws://localhost:3000/ws?userId=${user.id}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'new_message') {
        const { chatId, message } = data.payload;

        // Update messages if this is the active chat
        if (activeChat === chatId) {
          setMessages(prev => [...prev, message]);
          // Mark as read since we're in the active chat
          setChats(prevChats => prevChats.map(chat =>
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
          ));
        } else {
          // Update unread count and last message for other chats
          setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
              return {
                ...chat,
                unreadCount: chat.unreadCount + 1,
                lastMessage: {
                  content: message.content,
                  timestamp: message.timestamp
                }
              };
            }
            return chat;
          }));

          // Play system sound for new message
          const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
          audio.play().catch(error => console.log('Audio playback failed:', error));

          // Show in-app notification
          const chat = chats.find(c => c.id === chatId);
          if (chat) {
            setNotification({
              content: message.content
            });
          }

          // Show system notification
          if (Notification.permission === "granted") {
            const selectedChat = chats.find(c => c.id === chatId);
            if (selectedChat) {
              new Notification(selectedChat.recipientName, {
                body: message.content,
                icon: selectedChat.recipientAvatar || '/favicon.ico',
                tag: `message-${chatId}-${message.id}`
              });
            }
          }
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [user?.id, activeChat, chats]);

  // Request notification permission with better explanation
  useEffect(() => {
    if (Notification.permission === "default") {
      const requestPermission = async () => {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            console.log("Notification permission granted");
          }
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      };
      requestPermission();
    }
  }, []);

  const handleChatSelect = async (chatId: string) => {
    const selectedChat = chats.find(c => c.id === chatId);
    if (!selectedChat) return;
    setActiveChat(chatId);
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat || !content.trim()) return;

    try {
      const response = await api.post(`/chats/${activeChat}/messages`, { content });
      const newMessage = response.data;

      // Update messages immediately
      setMessages(prev => [...prev, newMessage]);

      // Update chat list with new message and reset unread count
      setChats(prevChats => prevChats.map(chat =>
        chat.id === activeChat
          ? {
              ...chat,
              lastMessage: {
                content,
                timestamp: new Date().toISOString(),
              },
              unreadCount: 0
            }
          : chat
      ));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAddChat = () => {
    setShowUserSearch(true);
  };

  const handleUserSelect = async (user: User) => {
    try {
      // Check if chat already exists
      const existingChat = chats.find(chat => chat.recipientId === user.id);
      if (existingChat) {
        setActiveChat(existingChat.id);
        setShowUserSearch(false);
        return;
      }

      // Create new chat
      const response = await api.post('/chats', { recipientId: user.id });
      const newChat = {
        ...response.data,
        recipientId: user.id,
        recipientName: user.fullname,
        recipientEmail: user.email,
        recipientAvatar: user.avatar,
      };

      // Add new chat to the list and set it as active
      setChats(prevChats => [...prevChats, newChat]);
      setActiveChat(newChat.id);
      setMessages([]); // Reset messages for new chat
      setShowUserSearch(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const activeRecipient = activeChat
    ? chats.find(chat => chat.id === activeChat)
    : null;

  const handleBurgerClick = () => {
    setShowBurgerMenu(!showBurgerMenu);
  };

  const handleSettings = () => {
    navigate('/settings');
    setShowBurgerMenu(false);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      // Clear all user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Clear any other stored data
      sessionStorage.clear();
      // Navigate to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if the API call fails, we should still log out locally
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  const showNotification = (message: string) => {
    const selectedChat = chats.find(c => c.id === activeChat);
    if (!selectedChat) return;
    new Notification(selectedChat.recipientName, {
      body: message,
      icon: selectedChat.recipientAvatar || '/favicon.ico'
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${styles.container} ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Burger Menu */}
      <div ref={menuRef} className={styles.burgerMenu}>
        <img
          src={avatarPath}
          alt="Profile"
          className={styles.burgerAvatar}
          onClick={() => setShowBurgerMenu(!showBurgerMenu)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullname || '')}&background=random`;
          }}
        />

        {showBurgerMenu && (
          <div className={styles.menuDropdown}>
            <div className={styles.menuItem} onClick={handleSettings}>
              <FaCog />
              <span>Settings</span>
            </div>
            <div className={styles.menuItem} onClick={toggleTheme}>
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div
              className={`${styles.menuItem} ${styles.danger}`}
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className={styles.chatList}>
        <div className={styles.chatListHeader}>
          <h1 className={styles.chatListTitle}>Chats</h1>
          <input
            type="text"
            placeholder="Search chats..."
            className={styles.searchInput}
          />
        </div>
        <div className={styles.chatItems}>
          {Array.isArray(chats) && chats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${
                activeChat === chat.id ? styles.chatItemActive : ""
              }`}
              onClick={() => setActiveChat(chat.id)}
            >
              <img
                src={getAvatarByEmail(chat.recipientEmail)}
                alt={chat.recipientName}
                className={styles.chatItemAvatar}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.recipientName)}&background=random`;
                }}
              />
              <div className={styles.chatItemContent}>
                <div className={styles.chatItemName}>{chat.recipientName}</div>
                <div className={styles.chatItemLastMessage}>
                  {chat.lastMessage?.content || "No messages yet"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Chat */}
      <div ref={activeChatRef} className={styles.activeChat}>
        {activeChat ? (
          <ChatDetail
            currentUser={currentUser}
            activeRecipient={chats.find(chat => chat.id === activeChat) || null}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className={styles.noChatSelected}>
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* Add Chat Button */}
      <button className={styles.addButton} onClick={handleAddChat}>
        +
      </button>

      {/* User Search Modal */}
      {showUserSearch && (
        <UserSearch
          onClose={() => setShowUserSearch(false)}
          onSelect={handleUserSelect}
        />
      )}

      {notification && (
        <MessageNotification
          message={notification.content}
          sender={currentUser?.fullname || 'Unknown'}
          timestamp={new Date().toISOString()}
          onClick={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ChatInterface;