"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle, Clock, Paperclip,
  MessageSquare, X, Upload, FileText, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { ChatInterface } from "@/components/shared/ChatInterface";
import { IProject, IConversation } from "@/types";
import { formatNPR, formatDate, getStatusColor, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ActiveProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  // Attachments state
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Messaging state
  const [showChat, setShowChat] = useState(false);
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [loadingConv, setLoadingConv] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => setProject(d.project))
      .finally(() => setLoading(false));
  }, [id]);

  const completedMilestones = project?.milestones?.filter((m) => m.status === "completed" || m.status === "paid").length || 0;
  const totalMilestones = project?.milestones?.length || 0;
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Simulate file upload (base64 data URL for demo; swap for real upload endpoint as needed)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const newAttachments = await Promise.all(
        files.map(
          (file) =>
            new Promise<{ name: string; url: string }>((resolve) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({ name: file.name, url: reader.result as string });
              reader.readAsDataURL(file);
            })
        )
      );
      setAttachments((prev) => [...prev, ...newAttachments]);
      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} attached`);
    } catch {
      toast.error("Failed to attach file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const submitDeliverable = () => {
    if (attachments.length === 0) {
      toast.warning("Please attach at least one file before submitting.");
      return;
    }
    toast.success("Deliverable submitted with attachments! Client will review soon.");
  };

  // Open / create conversation with client
  const handleMessageClient = async () => {
    if (!project) return;
    const clientId = typeof project.client === "string" ? project.client : project.client?._id;
    if (!clientId) {
      toast.error("Client information not available");
      return;
    }
    setLoadingConv(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: clientId, projectId: project._id }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setConversation(data.conversation);
      setShowChat(true);
    } catch {
      toast.error("Could not open conversation");
    } finally {
      setLoadingConv(false);
    }
  };

  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;
  }

  if (!project) {
    return <EmptyState icon={ArrowLeft} title="Project not found" description="" action={{ label: "Go Back", href: "/freelancer/active-projects" }} />;
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Main content */}
      <div className={cn("space-y-6 transition-all duration-300", showChat ? "w-full max-w-xl" : "max-w-3xl w-full")}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>{project.title}</h1>
            <Badge className={cn("text-xs mt-1", getStatusColor(project.status))}>{project.status}</Badge>
          </div>
          {/* Message Client button */}
          <Button
            variant="outline"
            className="gap-2 border-teal-300 text-teal-700 hover:bg-teal-50"
            onClick={showChat ? () => setShowChat(false) : handleMessageClient}
            disabled={loadingConv}
          >
            {loadingConv ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : showChat ? (
              <X className="h-4 w-4" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
            {showChat ? "Close Chat" : "Message Client"}
          </Button>
        </div>

        {/* Progress */}
        <Card className="border-teal-200 bg-teal-50/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-teal-800">Project Progress</h2>
              <span className="text-sm font-medium text-teal-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-teal-100" />
            <p className="text-sm text-teal-700 mt-2">{completedMilestones} of {totalMilestones} milestones completed</p>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <h2 className="font-semibold mb-4">Milestones</h2>
            {!project.milestones || project.milestones.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No milestones defined for this project</p>
            ) : (
              <div className="space-y-3">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      m.status === "completed" || m.status === "paid" ? "bg-green-100" : "bg-gray-100"
                    )}>
                      {m.status === "completed" || m.status === "paid" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{m.title}</p>
                      {m.dueDate && <p className="text-xs text-gray-400">Due: {formatDate(m.dueDate)}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-teal-600 text-sm">{formatNPR(m.amount)}</p>
                      <Badge className={cn("text-xs", getStatusColor(m.status))}>{m.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-4" />

            {/* Submit Deliverable with Attachments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Project Budget</p>
                  <p className="font-bold text-teal-600">{formatNPR(project.budget.max)}</p>
                </div>
              </div>

              {/* Attachment Upload Area */}
              <div className="rounded-xl border-2 border-dashed border-gray-200 hover:border-teal-300 transition-colors bg-gray-50 p-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Attach project files</p>
                    <p className="text-xs text-gray-400">Upload your deliverables before submitting</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 border-teal-300 text-teal-700 hover:bg-teal-50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
                    Choose files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Attached file list */}
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                        <FileText className="h-4 w-4 text-teal-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(i)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 gap-2"
                onClick={submitDeliverable}
              >
                <CheckCircle className="h-4 w-4" />
                Submit Deliverable {attachments.length > 0 && `(${attachments.length} file${attachments.length > 1 ? "s" : ""})`}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Project details */}
        <Card className="border-gray-200">
          <CardContent className="p-5">
            <h2 className="font-semibold mb-3">Project Details</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.skills.map((s) => (
                <Badge key={s} className="bg-teal-50 text-teal-700 text-xs">{s}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inline Chat Panel */}
      {showChat && conversation && (
        <div className="flex-1 sticky top-4 h-[calc(100vh-8rem)] rounded-2xl border border-gray-200 overflow-hidden shadow-lg bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-teal-50">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-teal-600" />
              <span className="font-semibold text-sm text-teal-800">Message Client</span>
            </div>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatInterface conversation={conversation} />
          </div>
        </div>
      )}
    </div>
  );
}
