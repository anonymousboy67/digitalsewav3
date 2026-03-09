"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Briefcase, Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-wrapper";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DISTRICTS, SKILLS } from "@/lib/constants";
import { X } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"client" | "freelancer" | "">("");
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
    district: "", city: "", hourlyRate: "", bio: "", panNumber: "",
  });

  const updateForm = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) =>
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name, email: formData.email, password: formData.password,
          role, phone: formData.phone, district: formData.district, city: formData.city,
          bio: formData.bio,
          ...(role === "freelancer" && { skills: selectedSkills, hourlyRate: Number(formData.hourlyRate) }),
          ...(role === "client" && { panNumber: formData.panNumber }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      // Auto sign in
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      toast.success("Welcome to DigitalSewa!");
      router.push(`/${role}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-teal-50 items-center justify-center mb-3">
          <span className="text-teal-600 font-bold text-lg" style={{ fontFamily: "var(--font-outfit)" }}>DS</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>
          Create your account
        </h1>
        <p className="text-gray-500 text-sm mt-1">Join Nepal's local freelancing platform</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Step {step} of 3</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-gray-100" />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-center text-gray-600 text-sm mb-6">How will you use DigitalSewa?</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "client", icon: Building2, label: "I want to hire", desc: "Post projects & hire freelancers" },
                { value: "freelancer", icon: Briefcase, label: "I want to work", desc: "Find projects & earn money" },
              ].map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRole(opt.value as "client" | "freelancer")}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    role === opt.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-teal-200"
                  }`}
                >
                  <div className={`inline-flex p-2.5 rounded-xl mb-3 ${role === opt.value ? "bg-teal-100" : "bg-gray-100"}`}>
                    <opt.icon className={`h-5 w-5 ${role === opt.value ? "text-teal-600" : "text-gray-500"}`} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </motion.button>
              ))}
            </div>
            <Button
              disabled={!role}
              onClick={() => setStep(2)}
              className="w-full bg-teal-600 hover:bg-teal-700 h-11 mt-2"
            >
              Continue
            </Button>
          </motion.div>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Full Name *</Label>
                <Input placeholder="Aashish Adhikari" value={formData.name} onChange={(e) => updateForm("name", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input placeholder="9800000000" value={formData.phone} onChange={(e) => updateForm("phone", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Email Address *</Label>
              <Input type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => updateForm("email", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Password *</Label>
                <Input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => updateForm("password", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Confirm Password *</Label>
                <Input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>District *</Label>
                <Select onValueChange={(v: string) => updateForm("district", v)}>
                  <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.slice(0, 15).map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>City *</Label>
                <Input placeholder="Kathmandu" value={formData.city} onChange={(e) => updateForm("city", e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => {
                  if (!formData.name || !formData.email || !formData.password || !formData.district || !formData.city) {
                    toast.error("Please fill all required fields");
                    return;
                  }
                  setStep(3);
                }}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Role-specific info */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {role === "freelancer" ? (
              <>
                <div className="space-y-1">
                  <Label>Hourly Rate (NPR)</Label>
                  <Input type="number" placeholder="1500" value={formData.hourlyRate} onChange={(e) => updateForm("hourlyRate", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Skills</Label>
                  <div className="flex gap-2 mb-2">
                    <Select onValueChange={addSkill}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="Add a skill" /></SelectTrigger>
                      <SelectContent>
                        {SKILLS.filter((s) => !selectedSkills.includes(s)).map((skill) => (
                          <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} className="bg-teal-50 text-teal-700 border-teal-200 gap-1 pr-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Bio</Label>
                  <Textarea
                    placeholder="Tell clients about your experience, skills, and what makes you unique..."
                    value={formData.bio}
                    onChange={(e) => updateForm("bio", e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <Label>PAN Number (Optional)</Label>
                <Input placeholder="123456789" value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
                <p className="text-xs text-gray-400">For verified business badge</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Account
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
