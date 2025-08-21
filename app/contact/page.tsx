"use client"
import React, { useState } from "react"

export default function ContactOverlay({ onClose }: { onClose: () => void }) {
  const [result, setResult] = useState("")

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResult("Sending...")

    const formData = new FormData(event.currentTarget)
    // ✅ Your real Web3Forms access key
    formData.append("access_key", "f8741ccf-8e2d-476e-920b-aac3c75eaf69")

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      setResult("✅ Form Submitted Successfully")
      event.currentTarget.reset()
    } else {
      console.log("Error", data)
      setResult("❌ " + data.message)
    }
  }

  return (
    <div className="overlay">
      <div className="backdrop" onClick={onClose}></div>
      <div className="panel" style={{ maxWidth: "600px" }}>
        <div className="panel-head">
          <h2 className="panel-title">Contact Us</h2>
          <button className="btn close" onClick={onClose}>✕</button>
        </div>

        <div className="panel-body">
          <form onSubmit={onSubmit} className="grid gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="p-2 rounded bg-black/40 border border-white/20"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="p-2 rounded bg-black/40 border border-white/20"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              className="p-2 rounded bg-black/40 border border-white/20 h-32"
            ></textarea>

            <button type="submit" className="btn wide">
              Send Message
            </button>
          </form>

          <span className="mt-3 block text-sm">{result}</span>
        </div>
      </div>
    </div>
  )
}
