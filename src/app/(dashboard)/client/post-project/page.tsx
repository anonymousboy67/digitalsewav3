"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, X, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-wrapper";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { CATEGORIES, DISTRICTS, SKILLS } from "@/lib/constants";
import { formatNPR } from "@/lib/utils";

export default function PostProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "", description: "", category: "", budgetType: "fixed",
    budgetMin: "", budgetMax: "", deadline: "", district: "", city: "",
    remote: false, urgency: "normal",
  });

  const update = (field: string, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) setSkills((p) => [...p, skill]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          skills,
          budget: { min: Number(form.budgetMin), max: Number(form.budgetMax), type: form.budgetType },
          deadline: new Date(form.deadline).toISOString(),
          location: { district: form.remote ? "Remote" : form.district, city: form.remote ? "Remote" : form.city, remote: form.remote },
          urgency: form.urgency,
        }),
      });

      if (res.ok) {
        toast.success("Project posted successfully!");
        router.push("/client/my-projects");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to post project");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Details", "Budget & Timeline", "Location & Urgency", "Review"];
  const progress = (step / 4) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
          Post a New Project
        </h1>
        <p className="text-gray-500 text-sm mt-1">Find the perfect freelancer for your needs</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((s, i) => (
            <span key={s} className={`text-xs font-medium ${i + 1 <= step ? "text-teal-600" : "text-gray-400"}`}>
              {s}
            </span>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Project Title *</Label>
                  <Input
                    placeholder="E.g., Build an e-commerce website for my clothing brand"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select onValueChange={(v) => update("category", v)}>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Description *</Label>
                  <Textarea
                    placeholder="Describe your project in detail. What needs to be done? What are the requirements? What does success look like?"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={5}
                  />
                  <p className="text-xs text-gray-400">{form.description.length} chars (min. 50)</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Required Skills</Label>
                  <Select onValueChange={addSkill}>
                    <SelectTrigger><SelectValue placeholder="Add required skills" /></SelectTrigger>
                    <SelectContent>
                      {SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <Badge key={skill} className="bg-teal-50 text-teal-700 gap-1">
                        {skill}
                        <button onClick={() => setSkills((p) => p.filter((s) => s !== skill))}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="space-y-2">
                  <Label>Budget Type *</Label>
                  <RadioGroup value={form.budgetType} onValueChange={(v) => update("budgetType", v)} className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed">Fixed Price</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <Label htmlFor="hourly">Hourly Rate</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Min Budget (NPR) *</Label>
                    <Input type="number" placeholder="5000" value={form.budgetMin} onChange={(e) => update("budgetMin", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Max Budget (NPR) *</Label>
                    <Input type="number" placeholder="20000" value={form.budgetMax} onChange={(e) => update("budgetMax", e.target.value)} />
                  </div>
                </div>
                {form.budgetMin && form.budgetMax && (
                  <p className="text-sm text-teal-600 bg-teal-50 px-3 py-2 rounded-lg">
                    Budget range: {formatNPR(Number(form.budgetMin))} – {formatNPR(Number(form.budgetMax))}
                    {form.budgetType === "hourly" && " per hour"}
                  </p>
                )}
                <div className="space-y-1.5">
                  <Label>Project Deadline *</Label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.deadline}
                    onChange={(e) => update("deadline", e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Remote Work</p>
                    <p className="text-xs text-gray-500">Allow freelancers from any location</p>
                  </div>
                  <Switch checked={form.remote} onCheckedChange={(v) => update("remote", v)} />
                </div>

                {!form.remote && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>District</Label>
                      <Select onValueChange={(v) => update("district", v)}>
                        <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                        <SelectContent>
                          {DISTRICTS.slice(0, 20).map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>City</Label>
                      <Input placeholder="Kathmandu" value={form.city} onChange={(e) => update("city", e.target.value)} />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <RadioGroup value={form.urgency} onValueChange={(v) => update("urgency", v)}>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.urgency === "normal" ? "border-teal-500 bg-teal-50" : "border-gray-200"}`}>
                        <RadioGroupItem value="normal" id="normal" />
                        <div>
                          <p className="font-medium text-sm">Normal</p>
                          <p className="text-xs text-gray-500">Standard timeline</p>
                        </div>
                      </label>
                      <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.urgency === "urgent" ? "border-red-500 bg-red-50" : "border-gray-200"}`}>
                        <RadioGroupItem value="urgent" id="urgent" />
                        <div>
                          <p className="font-medium text-sm flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-red-500" /> Urgent</p>
                          <p className="text-xs text-gray-500">ASAP needed</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Review Your Project</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Title</span>
                    <span className="font-medium text-right max-w-xs">{form.title}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium">{CATEGORIES.find(c => c.value === form.category)?.label}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium">{formatNPR(Number(form.budgetMin))} – {formatNPR(Number(form.budgetMax))}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Deadline</span>
                    <span className="font-medium">{form.deadline}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium">{form.remote ? "Remote" : `${form.city}, ${form.district}`}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Urgency</span>
                    <span className={`font-medium ${form.urgency === "urgent" ? "text-red-600" : "text-gray-900"}`}>{form.urgency}</span>
                  </div>
                  {skills.length > 0 && (
                    <div className="py-2">
                      <span className="text-gray-500 text-sm">Skills Required</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {skills.map((s) => (
                          <Badge key={s} className="bg-teal-50 text-teal-700 text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            )}
            <Button
              className="flex-1 bg-teal-600 hover:bg-teal-700 gap-2"
              onClick={() => {
                if (step < 4) setStep(s => s + 1);
                else handleSubmit();
              }}
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {step < 4 ? (
                <>Continue <ChevronRight className="h-4 w-4" /></>
              ) : "Post Project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
