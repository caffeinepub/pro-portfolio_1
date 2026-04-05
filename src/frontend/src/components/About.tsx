import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import type { PortfolioData } from "../types/portfolio";

interface AboutProps {
  data: PortfolioData;
  isAdmin: boolean;
  onUpdate: (patch: Partial<PortfolioData>) => void;
}

export function About({ data, isAdmin, onUpdate }: AboutProps) {
  const [editingBio, setEditingBio] = useState(false);
  const [bioVal, setBioVal] = useState(data.bio);
  const [newSkill, setNewSkill] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  function commitBio() {
    setEditingBio(false);
    onUpdate({ bio: bioVal });
  }

  function removeSkill(skill: string) {
    onUpdate({ skills: data.skills.filter((s) => s !== skill) });
  }

  function addSkill() {
    const trimmed = newSkill.trim();
    if (!trimmed || data.skills.includes(trimmed)) return;
    onUpdate({ skills: [...data.skills, trimmed] });
    setNewSkill("");
    setAddingSkill(false);
  }

  function startAddingSkill() {
    setAddingSkill(true);
    setTimeout(() => skillInputRef.current?.focus(), 20);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        onUpdate({ profilePhoto: result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section
      id="about"
      className="py-24 px-6 md:px-16 lg:px-24"
      data-ocid="about.section"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12"
          style={{ color: "var(--text-primary)" }}
        >
          About <span style={{ color: "var(--accent)" }}>Me</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Profile photo */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative w-64 h-64 rounded-2xl border overflow-hidden flex items-center justify-center"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border)",
              }}
            >
              {data.profilePhoto ? (
                <img
                  src={data.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
                    style={{
                      background: "var(--bg-surface-2)",
                      color: "var(--accent)",
                    }}
                  >
                    {data.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">
                    {isAdmin ? "Click to upload photo" : data.name}
                  </span>
                </div>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                  data-ocid="about.photo.upload_button"
                >
                  <span className="text-white text-sm font-medium">
                    Upload Photo
                  </span>
                </button>
              )}
            </div>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Right: Bio + Skills */}
          <div>
            <div className="mb-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Who I Am
              </h3>
              {editingBio ? (
                <div>
                  <textarea
                    value={bioVal}
                    onChange={(e) => setBioVal(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none"
                    style={{
                      background: "var(--bg-surface-2)",
                      borderColor: "var(--accent)",
                      color: "var(--text-primary)",
                    }}
                    data-ocid="about.bio.textarea"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={commitBio}
                      className="px-4 py-1.5 rounded-lg text-sm font-semibold"
                      style={{ background: "var(--accent)", color: "#000" }}
                      data-ocid="about.bio.save_button"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBio(false);
                        setBioVal(data.bio);
                      }}
                      className="px-4 py-1.5 rounded-lg text-sm"
                      style={{ color: "var(--text-muted)" }}
                      data-ocid="about.bio.cancel_button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="text-base leading-relaxed"
                  style={{
                    color: "var(--text-secondary)",
                    outline: isAdmin ? "1px dashed var(--accent)" : "none",
                    outlineOffset: "4px",
                    borderRadius: "4px",
                    cursor: isAdmin ? "text" : "default",
                    padding: isAdmin ? "4px" : "0",
                  }}
                  onClick={() => {
                    if (isAdmin) {
                      setBioVal(data.bio);
                      setEditingBio(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (isAdmin && (e.key === "Enter" || e.key === " ")) {
                      setBioVal(data.bio);
                      setEditingBio(true);
                    }
                  }}
                  title={isAdmin ? "Click to edit bio" : undefined}
                  data-ocid="about.bio.input"
                >
                  {data.bio}
                </div>
              )}
            </div>

            {/* Skills */}
            <div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {skill}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 rounded-full p-0.5 hover:opacity-70 transition-opacity"
                        style={{ color: "var(--text-muted)" }}
                        data-ocid="about.skill.delete_button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}

                {/* Add skill */}
                {isAdmin &&
                  (addingSkill ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addSkill();
                      }}
                      className="flex gap-1"
                    >
                      <input
                        ref={skillInputRef}
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="New skill…"
                        className="px-3 py-1 rounded-full text-sm border outline-none"
                        style={{
                          background: "var(--bg-surface-2)",
                          borderColor: "var(--accent)",
                          color: "var(--text-primary)",
                          width: "120px",
                        }}
                        data-ocid="about.skill.input"
                      />
                      <button
                        type="submit"
                        className="px-2 py-1 rounded-full text-xs font-bold"
                        style={{ background: "var(--accent)", color: "#000" }}
                        data-ocid="about.skill.save_button"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingSkill(false)}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ color: "var(--text-muted)" }}
                        data-ocid="about.skill.cancel_button"
                      >
                        ✕
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={startAddingSkill}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border border-dashed transition-colors duration-200 hover:opacity-80"
                      style={{
                        borderColor: "var(--accent)",
                        color: "var(--accent)",
                      }}
                      data-ocid="about.skill.button"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Skill
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
