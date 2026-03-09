"use client";

import { useState, useEffect } from "react";
import { Loader2, User, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DISTRICTS, SKILLS, AVAILABILITY_OPTIONS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function FreelancerSettingsPage() {
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "", phone: "", bio: "", district: "", city: "",
    avatar: "", hourlyRate: "", availability: "",
  });

  useEffect(() => {
    if (!user) return;
    fetch(`/api/users/${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setForm({
            name: d.user.name || "", phone: d.user.phone || "",
            bio: d.user.bio || "", district: d.user.location?.district || "",
            city: d.user.location?.city || "", avatar: d.user.avatar || "",
            hourlyRate: d.user.hourlyRate?.toString() || "",
            availability: d.user.availability || "available",
          });
          setSkills(d.user.skills || []);
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, phone: form.phone, bio: form.bio,
          location: { district: form.district, city: form.city },
          avatar: form.avatar, hourlyRate: Number(form.hourlyRate),
          availability: form.availability, skills,
        }),
      });
      if (res.ok) {
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your profile and preferences</p>
      </div>

      {/* Avatar */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              <AvatarImage src={form.avatar} />
              <AvatarFallback className="bg-teal-100 text-teal-700 text-xl font-semibold">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label>Profile Photo URL</Label>
              <Input
                placeholder="https://..."
                value={form.avatar}
                onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal */}
      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-teal-600" />
            <h2 className="font-semibold">Personal Information</h2>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={4} placeholder="Tell clients about yourself..." />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-teal-600" />
            <h2 className="font-semibold">Location</h2>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>District</Label>
              <Select value={form.district} onValueChange={(v) => setForm((p) => ({ ...p, district: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DISTRICTS.slice(0, 15).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional */}
      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-teal-600" />
            <h2 className="font-semibold">Professional Details</h2>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Hourly Rate (NPR)</Label>
              <Input type="number" value={form.hourlyRate} onChange={(e) => setForm((p) => ({ ...p, hourlyRate: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Availability</Label>
              <Select value={form.availability} onValueChange={(v) => setForm((p) => ({ ...p, availability: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_OPTIONS.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Skills</Label>
            <Select onValueChange={(v) => { if (!skills.includes(v)) setSkills((p) => [...p, v]); }}>
              <SelectTrigger><SelectValue placeholder="Add skills" /></SelectTrigger>
              <SelectContent>
                {SKILLS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((s) => (
                <Badge key={s} className="bg-teal-50 text-teal-700 gap-1 pr-1">
                  {s}
                  <button onClick={() => setSkills((p) => p.filter((sk) => sk !== s))} className="hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="bg-teal-600 hover:bg-teal-700 px-8">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Save Changes
      </Button>
    </div>
  );
}
