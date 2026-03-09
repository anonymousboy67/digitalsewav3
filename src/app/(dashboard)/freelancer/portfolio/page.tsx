"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Image, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-wrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { IPortfolioItem, IUser } from "@/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SKILLS } from "@/lib/constants";
import { toast } from "sonner";

export default function PortfolioPage() {
  const { user } = useCurrentUser();
  const [portfolio, setPortfolio] = useState<IPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<IPortfolioItem | null>(null);
  const [form, setForm] = useState({ title: "", description: "", image: "", link: "", skills: [] as string[] });

  const fetchPortfolio = async () => {
    if (!user) return;
    const res = await fetch(`/api/users/${user.id}`);
    if (res.ok) {
      const data = await res.json();
      setPortfolio(data.user?.portfolio || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPortfolio(); }, [user]);

  const resetForm = () => setForm({ title: "", description: "", image: "", link: "", skills: [] });

  const handleSave = async () => {
    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }
    setSaving(true);
    try {
      let updatedPortfolio;
      if (editItem?._id) {
        updatedPortfolio = portfolio.map((p) => p._id === editItem._id ? { ...p, ...form } : p);
      } else {
        updatedPortfolio = [...portfolio, form];
      }

      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: updatedPortfolio }),
      });

      if (res.ok) {
        toast.success(editItem ? "Portfolio item updated!" : "Portfolio item added!");
        setPortfolio(updatedPortfolio);
        setOpen(false);
        resetForm();
        setEditItem(null);
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: IPortfolioItem) => {
    const updated = portfolio.filter((p) => p._id !== item._id && p.title !== item.title);
    const res = await fetch(`/api/users/${user?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portfolio: updated }),
    });
    if (res.ok) {
      setPortfolio(updated);
      toast.success("Item deleted");
    }
  };

  const handleEdit = (item: IPortfolioItem) => {
    setEditItem(item);
    setForm({ title: item.title, description: item.description, image: item.image || "", link: item.link || "", skills: item.skills || [] });
    setOpen(true);
  };

  const addSkill = (skill: string) => {
    if (!form.skills.includes(skill)) {
      setForm((p) => ({ ...p, skills: [...p.skills, skill] }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Portfolio</h1>
          <p className="text-gray-500 text-sm mt-1">{portfolio.length} items</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { resetForm(); setEditItem(null); } }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Portfolio Item" : "Add Portfolio Item"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input placeholder="E.g., E-commerce Website" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Description *</Label>
                <Textarea
                  placeholder="Describe what you built and technologies used..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Image URL</Label>
                  <Input placeholder="https://..." value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Project Link</Label>
                  <Input placeholder="https://..." value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Skills Used</Label>
                <Select onValueChange={addSkill}>
                  <SelectTrigger><SelectValue placeholder="Add skills" /></SelectTrigger>
                  <SelectContent>
                    {SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.skills.map((s) => (
                    <Badge key={s} className="bg-teal-50 text-teal-700 gap-1 cursor-pointer" onClick={() => setForm((p) => ({ ...p, skills: p.skills.filter((sk) => sk !== s) }))}>
                      {s} ×
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-teal-600 hover:bg-teal-700">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editItem ? "Update Item" : "Add to Portfolio"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-52 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : portfolio.length === 0 ? (
        <EmptyState
          icon={Image}
          title="No portfolio items"
          description="Showcase your best work to attract more clients"
          action={{ label: "Add First Item", onClick: () => setOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {portfolio.map((item, i) => (
              <motion.div
                key={item._id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-teal-200 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="h-40 bg-gradient-to-br from-teal-100 to-emerald-100 relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-10 w-10 text-teal-300" />
                    </div>
                  )}
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.skills?.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
