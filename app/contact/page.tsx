// Contact page – works in App Router (`app/contact/page.tsx`) or Pages Router (`pages/contact.tsx`)
"use client";
import React, { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    // REQUIRED: your Web3Forms access key
    formData.set("access_key", "f8741ccf-8e2d-476e-920b-aac3c75eaf69");

    // Optional: subject & from_name (for nicer emails)
    formData.set("subject", "New message from ToiletCoin site");
    formData.set("from_name", "ToiletCoin Website");

    // Simple spam trap (honeypot). Must match a hidden input named "botcheck".
    if (formData.get("botcheck")) {
      setStatus("err");
      setMsg("Spam detected.");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setStatus("ok");
        setMsg("Message sent. We’ll get back to you.");
        form.reset();
      } else {
        setStatus("err");
        setMsg(data.message || "Submission failed.");
      }
    } catch {
      setStatus("err");
      setMsg("Network error. Try again.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact ToiletCoin</h1>
        <p className="text-zinc-400 mb-6">
          Questions, partnerships, alpha leaks—drop them here.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Honeypot (hidden) */}
          <input type="text" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              required
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea
              name="message"
              rows={5}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3"
              placeholder="What’s on your mind?"
            />
          </div>

          {/* Optional fields you can uncomment for airdrops later */}
          {/* <div>
            <label className="block text-sm mb-1">Solana Wallet Address</label>
            <input
              name="wallet"
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3"
              placeholder="e.g. 7Qh...xyz"
            />
          </div> */}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Flush 🚽"}
          </button>

          {status !== "idle" && (
            <p
              className={
                "text-sm mt-2 " +
                (status === "ok" ? "text-emerald-400" : status === "err" ? "text-red-400" : "text-zinc-400")
              }
            >
              {msg}
            </p>
          )}
        </form>

        <p className="text-xs text-zinc-500 mt-6">
          Powered by Web3Forms. No wallet required to contact us.
        </p>
      </div>
    </main>
  );
}
