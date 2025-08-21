"use client"
import { useState } from "react"

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    formData.set("access_key", "f8741ccf-8e2d-476e-920b-aac3c75eaf69") // ✅ your key

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })

    if (res.ok) {
      setStatus("success")
      e.currentTarget.reset()
    } else {
      setStatus("error")
    }
  }

  return (
    <div className="form-container" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="form-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="form-input"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          className="form-textarea"
        />
        <button type="submit" className="btn">Send</button>
      </form>

      {status === "success" && <p style={{ color: "limegreen" }}>✅ Message sent!</p>}
      {status === "error" && <p style={{ color: "red" }}>❌ Something went wrong.</p>}

      {/* Direct email fallback */}
      <p style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
        or email us directly at{" "}
        <a href="mailto:contact@toiletcoin.wtf" style={{ color: "#ffd24a", fontWeight: 700 }}>
          contact@toiletcoin.wtf
        </a>
      </p>
    </div>
  )
}
