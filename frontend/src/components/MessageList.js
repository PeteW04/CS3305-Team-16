import { MessageCircle } from "lucide-react"
import "../CSS-files/MessageListcomponent.css"

const messages = [
  {
    id: 1,
    sender: "Dorian F. Gray",
    preview: "Enter your message description h...",
    time: "12:25",
    unread: 2,
  },
  {
    id: 2,
    sender: "Lebron James",
    preview: "Enter your message description h...",
    time: "12:25",
  },
  {
    id: 3,
    sender: "Kaori D. Miyazono",
    preview: "Enter your message description h...",
    time: "12:25",
  },
  {
    id: 4,
    sender: "Saylor Twift",
    preview: "Enter your message description h...",
    time: "12:25",
    unread: 2,
  },
  {
    id: 2,
    sender: "Lebron James",
    preview: "Enter your message description h...",
    time: "12:25",
  },
  {
    id: 3,
    sender: "Kaori D. Miyazono",
    preview: "Enter your message description h...",
    time: "12:25",
  },
  {
    id: 4,
    sender: "Saylor Twift",
    preview: "Enter your message description h...",
    time: "12:25",
    unread: 2,
  },
]

export default function MessageList() {
  return (
    <div className="container">
      <div className="message-box">
        <div className="header">
          <div className="title">
            <MessageCircle className="message-icon" />
            <span>Message</span>
          </div>
          <div className="avatar-group">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="avatar">
                <img src="/placeholder.svg?height=40&width=40" alt="User avatar" />
              </div>
            ))}
            <div className="avatar-more">+2</div>
          </div>
        </div>

        <div className="message-list">
          {messages.map((message) => (
            <div key={message.id} className="message-item">
              <div className="message-content">
                <h3>{message.sender}</h3>
                <p>{message.preview}</p>
              </div>
              <div className="message-meta">
                <span className="time">{message.time}</span>
                {message.unread && <span className="unread-badge">{message.unread}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

