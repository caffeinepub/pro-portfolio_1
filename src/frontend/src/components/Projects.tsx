import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { PortfolioData, Project } from "../types/portfolio";

interface ProjectsProps {
  data: PortfolioData;
  isAdmin: boolean;
  onUpdate: (patch: Partial<PortfolioData>) => void;
}

const EMPTY_PROJECT: Omit<Project, "id"> = {
  title: "",
  description: "",
  techStack: [],
  projectUrl: "",
  image: "",
};

function ProjectGradient({ index }: { index: number }) {
  const gradients = [
    "linear-gradient(135deg, #0A4A4A 0%, #0B2D35 100%)",
    "linear-gradient(135deg, #1A2A3A 0%, #0A1A2A 100%)",
    "linear-gradient(135deg, #1A1A2E 0%, #0B0B1A 100%)",
    "linear-gradient(135deg, #2A1A0A 0%, #1A0A05 100%)",
  ];
  return (
    <div
      className="w-full h-40 rounded-t-xl"
      style={{ background: gradients[index % gradients.length] }}
    />
  );
}

export function Projects({ data, isAdmin, onUpdate }: ProjectsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY_PROJECT);
  const [techInput, setTechInput] = useState("");
  const [imageFile, setImageFile] = useState<string>("");

  function openAdd() {
    setEditingProject(null);
    setForm(EMPTY_PROJECT);
    setTechInput("");
    setImageFile("");
    setDialogOpen(true);
  }

  function openEdit(project: Project) {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      projectUrl: project.projectUrl,
      image: project.image,
    });
    setTechInput(project.techStack.join(", "));
    setImageFile(project.image);
    setDialogOpen(true);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setImageFile(result);
        setForm((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    const techStack = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const projectData = { ...form, techStack, image: imageFile };

    if (editingProject) {
      const updated = data.projects.map((p) =>
        p.id === editingProject.id ? { ...p, ...projectData } : p,
      );
      onUpdate({ projects: updated });
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        ...projectData,
      };
      onUpdate({ projects: [...data.projects, newProject] });
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    onUpdate({ projects: data.projects.filter((p) => p.id !== id) });
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const newProjects = [...data.projects];
    [newProjects[index - 1], newProjects[index]] = [
      newProjects[index],
      newProjects[index - 1],
    ];
    onUpdate({ projects: newProjects });
  }

  function moveDown(index: number) {
    if (index === data.projects.length - 1) return;
    const newProjects = [...data.projects];
    [newProjects[index], newProjects[index + 1]] = [
      newProjects[index + 1],
      newProjects[index],
    ];
    onUpdate({ projects: newProjects });
  }

  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-16 lg:px-24"
      data-ocid="projects.section"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            My <span style={{ color: "var(--accent)" }}>Projects</span>
          </h2>
          {isAdmin && (
            <button
              type="button"
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-200 hover:opacity-80"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
              data-ocid="projects.add.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {data.projects.map((project, idx) => (
            <article
              key={project.id}
              className="rounded-2xl border overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border)",
              }}
              data-ocid={`projects.item.${idx + 1}`}
            >
              {/* Image */}
              <div className="relative">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <ProjectGradient index={idx} />
                )}
                {/* Admin controls */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.7)", color: "white" }}
                      data-ocid={`projects.move_up.button.${idx + 1}`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === data.projects.length - 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30 transition-opacity"
                      style={{ background: "rgba(0,0,0,0.7)", color: "white" }}
                      data-ocid={`projects.move_down.button.${idx + 1}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(project)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                      style={{
                        background: "rgba(20,184,177,0.8)",
                        color: "black",
                      }}
                      data-ocid={`projects.edit.button.${idx + 1}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                      style={{
                        background: "rgba(239,68,68,0.8)",
                        color: "white",
                      }}
                      data-ocid={`projects.delete.button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4 flex-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-full text-xs border"
                      style={{
                        background: "var(--bg-surface-2)",
                        borderColor: "var(--border)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Link */}
                {project.projectUrl && project.projectUrl !== "#" ? (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-75"
                    style={{ color: "var(--accent)" }}
                    data-ocid={`projects.link.${idx + 1}`}
                  >
                    View Project <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    View Project →
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {data.projects.length === 0 && (
          <div
            className="text-center py-16 rounded-2xl border border-dashed"
            style={{ borderColor: "var(--border)" }}
            data-ocid="projects.empty_state"
          >
            <p style={{ color: "var(--text-muted)" }}>
              No projects yet. {isAdmin ? "Add your first project!" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
          data-ocid="projects.dialog"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "var(--text-primary)" }}>
              {editingProject ? "Edit Project" : "Add Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Project Title
              </Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="My Awesome Project"
                className="mt-1"
                style={{
                  background: "var(--bg-surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                data-ocid="projects.title.input"
              />
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe what this project does…"
                rows={3}
                className="mt-1 resize-none"
                style={{
                  background: "var(--bg-surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                data-ocid="projects.description.textarea"
              />
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Tech Stack (comma-separated)
              </Label>
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="React, TypeScript, Node.js"
                className="mt-1"
                style={{
                  background: "var(--bg-surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                data-ocid="projects.tech.input"
              />
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Project URL
              </Label>
              <Input
                value={form.projectUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, projectUrl: e.target.value }))
                }
                placeholder="https://github.com/you/project"
                className="mt-1"
                style={{
                  background: "var(--bg-surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                data-ocid="projects.url.input"
              />
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Project Image
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full text-sm"
                style={{ color: "var(--text-muted)" }}
                data-ocid="projects.image.upload_button"
              />
              {imageFile && (
                <img
                  src={imageFile}
                  alt="Preview"
                  className="mt-2 h-24 w-full object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
              data-ocid="projects.cancel.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.title.trim()}
              style={{
                background: "var(--accent)",
                color: "#000",
                border: "none",
              }}
              data-ocid="projects.save.confirm_button"
            >
              {editingProject ? "Save Changes" : "Add Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
