import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import { useRef, useState } from "react";
import type { ContactSubmission, PortfolioData } from "../types/portfolio";

const SUBMISSIONS_KEY = "portfolio_submissions";

function loadSubmissions(): ContactSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveSubmission(sub: ContactSubmission) {
  const existing = loadSubmissions();
  existing.push(sub);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(existing));
}

interface ContactProps {
  data: PortfolioData;
  isAdmin: boolean;
  onUpdate: (patch: Partial<PortfolioData>) => void;
}

const SOCIAL_META = [
  { key: "github" as const, label: "GitHub", Icon: Github },
  { key: "linkedin" as const, label: "LinkedIn", Icon: Linkedin },
  { key: "twitter" as const, label: "Twitter", Icon: Twitter },
  { key: "instagram" as const, label: "Instagram", Icon: Instagram },
  { key: "website" as const, label: "Website", Icon: Globe },
];

export function Contact({ data, isAdmin, onUpdate }: ContactProps) {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(() =>
    loadSubmissions(),
  );

  // Editable contact fields
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(data.email);
  const [editPhone, setEditPhone] = useState(data.phone);
  const [editingSocialKey, setEditingSocialKey] = useState<string | null>(null);
  const [editSocialVal, setEditSocialVal] = useState("");

  const socialInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;
    const sub: ContactSubmission = {
      id: Date.now().toString(),
      name: formName,
      email: formEmail,
      message: formMessage,
      timestamp: new Date().toISOString(),
    };
    saveSubmission(sub);
    setSubmissions(loadSubmissions());
    setSubmitted(true);
    setFormName("");
    setFormEmail("");
    setFormMessage("");
  }

  function startEditSocial(key: string, currentVal: string) {
    setEditingSocialKey(key);
    setEditSocialVal(currentVal);
    setTimeout(() => socialInputRef.current?.focus(), 20);
  }

  function commitSocial() {
    if (!editingSocialKey) return;
    onUpdate({
      socialLinks: { ...data.socialLinks, [editingSocialKey]: editSocialVal },
    });
    setEditingSocialKey(null);
  }

  function startEditPhone() {
    setEditingPhone(true);
    setTimeout(() => phoneInputRef.current?.focus(), 20);
  }

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-16 lg:px-24"
      data-ocid="contact.section"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12"
          style={{ color: "var(--text-primary)" }}
        >
          Get In <span style={{ color: "var(--accent)" }}>Touch</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Social Links */}
          <div>
            <h3
              className="text-lg font-semibold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Connect With Me
            </h3>

            {/* Email */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--bg-surface-2)" }}
              >
                <Mail className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              {isAdmin && editingEmail ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdate({ email: editEmail });
                    setEditingEmail(false);
                  }}
                  className="flex gap-2 flex-1"
                >
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="h-8 text-sm"
                    style={{
                      background: "var(--bg-surface-2)",
                      borderColor: "var(--accent)",
                      color: "var(--text-primary)",
                    }}
                    data-ocid="contact.email.input"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    style={{ background: "var(--accent)", color: "#000" }}
                    data-ocid="contact.email.save_button"
                  >
                    Save
                  </Button>
                </form>
              ) : (
                <a
                  href={`mailto:${data.email}`}
                  className="text-sm transition-colors duration-200 hover:opacity-80"
                  style={{
                    color: "var(--text-secondary)",
                    outline: isAdmin ? "1px dashed var(--accent)" : "none",
                    outlineOffset: "2px",
                    borderRadius: "2px",
                    cursor: isAdmin ? "text" : "pointer",
                  }}
                  onClick={(e) => {
                    if (isAdmin) {
                      e.preventDefault();
                      setEditingEmail(true);
                    }
                  }}
                  data-ocid="contact.email.button"
                >
                  {data.email}
                </a>
              )}
            </div>

            {/* Phone */}
            {(data.phone || isAdmin) && (
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--bg-surface-2)" }}
                >
                  <Phone
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                </div>
                {isAdmin && editingPhone ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onUpdate({ phone: editPhone });
                      setEditingPhone(false);
                    }}
                    className="flex gap-2 flex-1"
                  >
                    <Input
                      ref={phoneInputRef}
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="h-8 text-sm"
                      placeholder="+1 (555) 123-4567"
                      style={{
                        background: "var(--bg-surface-2)",
                        borderColor: "var(--accent)",
                        color: "var(--text-primary)",
                      }}
                      data-ocid="contact.phone.input"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      style={{ background: "var(--accent)", color: "#000" }}
                      data-ocid="contact.phone.save_button"
                    >
                      Save
                    </Button>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="text-sm text-left"
                    style={{
                      color: "var(--text-secondary)",
                      outline: isAdmin ? "1px dashed var(--accent)" : "none",
                      outlineOffset: "2px",
                      borderRadius: "2px",
                      cursor: isAdmin ? "text" : "default",
                      background: "transparent",
                      border: "none",
                    }}
                    onClick={() => {
                      if (isAdmin) startEditPhone();
                    }}
                    data-ocid="contact.phone.button"
                  >
                    {data.phone || (isAdmin ? "+ Add phone number" : "")}
                  </button>
                )}
              </div>
            )}

            {/* Social links */}
            <div className="space-y-3 mt-6">
              {SOCIAL_META.map(({ key, label, Icon }) => {
                const url = data.socialLinks[key];
                if (!url && !isAdmin) return null;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--bg-surface-2)" }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: "var(--accent)" }}
                      />
                    </div>

                    {isAdmin && editingSocialKey === key ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          commitSocial();
                        }}
                        className="flex gap-2 flex-1"
                      >
                        <Input
                          ref={socialInputRef}
                          value={editSocialVal}
                          onChange={(e) => setEditSocialVal(e.target.value)}
                          className="h-8 text-sm"
                          placeholder={`https://${key}.com/yourhandle`}
                          style={{
                            background: "var(--bg-surface-2)",
                            borderColor: "var(--accent)",
                            color: "var(--text-primary)",
                          }}
                          data-ocid="contact.social.input"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          style={{ background: "var(--accent)", color: "#000" }}
                          data-ocid="contact.social.save_button"
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSocialKey(null)}
                          data-ocid="contact.social.cancel_button"
                        >
                          ✕
                        </Button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm transition-opacity hover:opacity-70"
                            style={{
                              color: "var(--text-secondary)",
                              outline: isAdmin
                                ? "1px dashed var(--accent)"
                                : "none",
                              outlineOffset: "2px",
                              borderRadius: "2px",
                            }}
                            onClick={(e) => {
                              if (isAdmin) {
                                e.preventDefault();
                                startEditSocial(key, url);
                              }
                            }}
                            data-ocid={`contact.social.${key}.link`}
                          >
                            {label}
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="text-sm"
                            style={{
                              color: "var(--text-muted)",
                              background: "transparent",
                              border: "none",
                            }}
                            onClick={() => startEditSocial(key, "")}
                            data-ocid={`contact.social.${key}.button`}
                          >
                            + Add {label}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Admin: view submissions */}
            {isAdmin && (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setShowMessages((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors duration-200"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                  data-ocid="contact.submissions.toggle"
                >
                  📬 {showMessages ? "Hide" : "View"} Messages (
                  {submissions.length})
                </button>

                {showMessages && (
                  <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                    {submissions.length === 0 ? (
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                        data-ocid="contact.submissions.empty_state"
                      >
                        No messages yet.
                      </p>
                    ) : (
                      submissions.map((sub, idx) => (
                        <div
                          key={sub.id}
                          className="p-4 rounded-xl border"
                          style={{
                            background: "var(--bg-surface-2)",
                            borderColor: "var(--border)",
                          }}
                          data-ocid={`contact.submissions.item.${idx + 1}`}
                        >
                          <div className="flex justify-between mb-1">
                            <span
                              className="font-semibold text-sm"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {sub.name}
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {new Date(sub.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p
                            className="text-xs mb-1"
                            style={{ color: "var(--accent)" }}
                          >
                            {sub.email}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {sub.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Contact Form */}
          <div>
            <h3
              className="text-lg font-semibold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Send a Message
            </h3>

            {submitted ? (
              <div
                className="flex flex-col items-center justify-center py-12 rounded-2xl border text-center"
                style={{
                  background: "var(--bg-surface)",
                  borderColor: "var(--border)",
                }}
                data-ocid="contact.form.success_state"
              >
                <span className="text-4xl mb-4">✅</span>
                <h4
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Message Sent!
                </h4>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-sm"
                  style={{ color: "var(--accent)" }}
                  data-ocid="contact.form.reset_button"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label style={{ color: "var(--text-secondary)" }}>Name</Label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="mt-1"
                    style={{
                      background: "var(--bg-surface-2)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                    data-ocid="contact.name.input"
                  />
                </div>
                <div>
                  <Label style={{ color: "var(--text-secondary)" }}>
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="mt-1"
                    style={{
                      background: "var(--bg-surface-2)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                    data-ocid="contact.email_field.input"
                  />
                </div>
                <div>
                  <Label style={{ color: "var(--text-secondary)" }}>
                    Message
                  </Label>
                  <Textarea
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Tell me about your project or say hello…"
                    rows={5}
                    required
                    className="mt-1 resize-none"
                    style={{
                      background: "var(--bg-surface-2)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                    data-ocid="contact.message.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-3 rounded-full font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), #0FA39C)",
                    color: "#000",
                    border: "none",
                  }}
                  data-ocid="contact.form.submit_button"
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
