import { useState } from "react"
import { Smile, Send } from "lucide-react"
import { chatData } from '../DummyData/chatlist'
import MessageList from '../components/MessageList'
import "../CSS-files/MessageUI.css"

export default function MessageUI() {
  const [message, setMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState(null)

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && selectedChat) {
      // In a real application, you would send this message to a backend
      console.log(`Sending message to ${selectedChat.name}: ${message}`)
      setMessage("")
    }
  }

  return (
    <div className="chat-interface">
      {/* Chat List */}
      <MessageList chatData={chatData} onChatSelect={handleChatSelect} />
      {/* Main Content */}
      <div className="main-content">
        {/* Chat Area */}
        <div className="chat-container">
          <div className="messages">
            <div className="date-divider">Today</div>

            {selectedChat ? (
              <>
                <div className="message">
                  <div className="message-user">{selectedChat.name}</div>
                  <div className="message-content">
                    {selectedChat.message}
                    <span className="message-time">{selectedChat.time}</span>
                  </div>
                </div>
                <div className="message sent">
                  <div className="message-content">
                    Thanks for the update!
                    <span className="message-time">12:30</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">Select a chat to start messaging</div>
            )}
          </div>

          <form className="chat-input" onSubmit={handleSendMessage}>
            <button type="button" className="emoji-button">
              <Smile size={20} />
            </button>
            <input
              type="text"
              placeholder="Start typing..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="send-button">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

