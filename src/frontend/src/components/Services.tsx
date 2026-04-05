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
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { PortfolioData, Service } from "../types/portfolio";

interface ServicesProps {
  data: PortfolioData;
  isAdmin: boolean;
  onUpdate: (patch: Partial<PortfolioData>) => void;
}

const EMPTY_SERVICE: Omit<Service, "id"> = {
  icon: "⭐",
  title: "",
  description: "",
};

export function Services({ data, isAdmin, onUpdate }: ServicesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>(EMPTY_SERVICE);

  function openAdd() {
    setEditingService(null);
    setForm(EMPTY_SERVICE);
    setDialogOpen(true);
  }

  function openEdit(service: Service) {
    setEditingService(service);
    setForm({
      icon: service.icon,
      title: service.title,
      description: service.description,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (editingService) {
      const updated = data.services.map((s) =>
        s.id === editingService.id ? { ...s, ...form } : s,
      );
      onUpdate({ services: updated });
    } else {
      const newService: Service = { id: Date.now().toString(), ...form };
      onUpdate({ services: [...data.services, newService] });
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    onUpdate({ services: data.services.filter((s) => s.id !== id) });
  }

  return (
    <section
      id="services"
      className="py-24 px-6 md:px-16 lg:px-24"
      data-ocid="services.section"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            My <span style={{ color: "var(--accent)" }}>Services</span>
          </h2>
          {isAdmin && (
            <button
              type="button"
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-200 hover:opacity-80"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
              data-ocid="services.add.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service, idx) => (
            <div
              key={service.id}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl border transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border)",
              }}
              data-ocid={`services.item.${idx + 1}`}
            >
              {/* Admin controls */}
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(service)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{
                      background: "rgba(20,184,177,0.8)",
                      color: "black",
                    }}
                    data-ocid={`services.edit.button.${idx + 1}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{
                      background: "rgba(239,68,68,0.8)",
                      color: "white",
                    }}
                    data-ocid={`services.delete.button.${idx + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <span className="text-5xl mb-4">{service.icon}</span>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {service.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {data.services.length === 0 && (
          <div
            className="text-center py-16 rounded-2xl border border-dashed"
            style={{ borderColor: "var(--border)" }}
            data-ocid="services.empty_state"
          >
            <p style={{ color: "var(--text-muted)" }}>
              No services yet. {isAdmin ? "Add your first service!" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Service Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-md"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
          data-ocid="services.dialog"
        >
          <DialogHeader>
            <DialogTitle style={{ color: "var(--text-primary)" }}>
              {editingService ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>
                Icon (emoji)
              </Label>
              <Input
                value={form.icon}
                onChange={(e) =>
                  setForm((p) => ({ ...p, icon: e.target.value }))
                }
                placeholder="💻"
                className="mt-1"
                style={{
                  background: "var(--bg-surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                data-ocid="services.icon.input"
              />
            </div>
            <div>
              <Label style={{ color: "var(--text-secondary)" }}>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Web Development"
                className="mt-1"
                style={{
                  background: "var(--bg-surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                data-ocid="services.title.input"
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
                placeholder="What you offer…"
                rows={3}
                className="mt-1 resize-none"
                style={{
                  background: "var(--bg-surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
                data-ocid="services.description.textarea"
              />
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
              data-ocid="services.cancel.cancel_button"
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
              data-ocid="services.save.confirm_button"
            >
              {editingService ? "Save Changes" : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
