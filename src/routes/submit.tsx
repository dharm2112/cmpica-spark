import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { CheckCircle2, Clock, Info, Loader2, Send, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";

import { AuroraBackground } from "@/components/aurora-background";
import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryBadge, UrgencyBadge } from "@/components/badges";
import { classifyMock } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a Ticket — CMPICA AI Helpdesk" },
      {
        name: "description",
        content:
          "Describe your issue in one message. The AI helpdesk classifies, prioritises and routes it to the right CMPICA department automatically.",
      },
      { property: "og:title", content: "Submit a Ticket — CMPICA AI Helpdesk" },
      {
        property: "og:description",
        content: "Raise a student support request and let AI route it to the right department.",
      },
    ],
  }),
  component: SubmitPage,
});

const MAX = 600;

function SubmitPage() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [contact, setContact] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({ name: false, message: false });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const timestamp = new Date();
  const nameError = touched.name && name.trim().length < 2 ? "Please enter your full name." : "";
  const messageError =
    touched.message && message.trim().length < 12
      ? "Describe the issue in at least 12 characters."
      : "";
  const valid = name.trim().length >= 2 && message.trim().length >= 12;
  const preview = classifyMock(message);

  const submit = () => {
    setConfirmOpen(false);
    setLoading(true);
    setTimeout(() => {
      const id = `CMP-${1043 + Math.floor(Math.random() * 40)}`;
      setTicketId(id);
      setLoading(false);
      toast.success("Ticket submitted", { description: `Reference ${id} · routed to ${preview.department}` });
    }, 1400);
  };

  const reset = () => {
    setTicketId(null);
    setName("");
    setStudentId("");
    setContact("");
    setDepartment("");
    setMessage("");
    setTouched({ name: false, message: false });
  };

  return (
    <div className="relative overflow-hidden px-4 py-16 sm:px-6">
      <AuroraBackground />
      <div className="relative mx-auto max-w-5xl">
        <PageHeader
          eyebrow="Submit ticket"
          title="Tell us what went wrong"
          sub="One message is enough. The AI figures out the category, urgency and the department that owns it."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-2xl border-border/60 shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Ticket details</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {ticketId ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-6 text-center"
                  >
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
                      <CheckCircle2 className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">Ticket submitted</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Save this reference to track your request.
                    </p>
                    <p className="mt-4 font-mono text-2xl font-semibold text-primary">{ticketId}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <CategoryBadge value={preview.category} />
                      <UrgencyBadge value={preview.urgency} />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Routed to <span className="text-foreground">{preview.department}</span>
                    </p>
                    <Button onClick={reset} variant="outline" className="mt-7 rounded-full">
                      Submit another ticket
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setTouched({ name: true, message: true });
                      if (valid) setConfirmOpen(true);
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="sender">
                        Sender Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="sender"
                        value={name}
                        placeholder="e.g. Ananya Patel"
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        aria-invalid={!!nameError}
                        className={cn("rounded-xl", nameError && "border-danger")}
                      />
                      {nameError && <p className="text-xs text-danger">{nameError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student-id">
                        Student ID{" "}
                        <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="student-id"
                        value={studentId}
                        placeholder="e.g. 22CS001"
                        onChange={(e) => setStudentId(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="message">
                          Message <span className="text-danger">*</span>
                        </Label>
                        <span
                          className={cn(
                            "text-xs tabular-nums text-muted-foreground",
                            message.length > MAX * 0.9 && "text-warning",
                          )}
                        >
                          {message.length}/{MAX}
                        </span>
                      </div>
                      <Textarea
                        id="message"
                        rows={6}
                        maxLength={MAX}
                        value={message}
                        placeholder="e.g. My examination timetable has not been updated."
                        onChange={(e) => setMessage(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                        aria-invalid={!!messageError}
                        className={cn("resize-none rounded-xl", messageError && "border-danger")}
                      />
                      {messageError && <p className="text-xs text-danger">{messageError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact">
                        Contact Information{" "}
                        <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="contact"
                        value={contact}
                        placeholder="Email or phone number"
                        onChange={(e) => setContact(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">
                        Department{" "}
                        <span className="text-xs font-normal text-muted-foreground">(optional — AI will infer if blank)</span>
                      </Label>
                      <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Let AI decide</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      Timestamp generated automatically ·{" "}
                      <span className="text-foreground">{timestamp.toLocaleString()}</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="w-full rounded-full bg-gradient-brand text-white shadow-elegant hover:opacity-95"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting ticket…
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Submit ticket
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-2xl border-border/60 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" /> Live AI preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {message.trim().length < 6 ? (
                  <p className="text-sm text-muted-foreground">
                    Start typing your message to see how the classifier reads it.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <CategoryBadge value={preview.category} />
                      <UrgencyBadge value={preview.urgency} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Confidence</span>
                        <span className="tabular-nums">{Math.round(preview.confidence * 100)}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-gradient-brand"
                          animate={{ width: `${preview.confidence * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Suggested route:{" "}
                      <span className="text-foreground">{preview.department}</span>
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Alert className="rounded-2xl border-border/60">
              <Info className="h-4 w-4" />
              <AlertTitle>Only four fields</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Sender name, message and timestamp are required; contact information is optional.
                Everything else is inferred by the AI.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm submission</DialogTitle>
            <DialogDescription>
              Review your ticket before it enters the AI pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-4 text-sm">
            <p>
              <span className="text-muted-foreground">Sender:</span> {name}
            </p>
            {studentId && (
              <p>
                <span className="text-muted-foreground">Student ID:</span> {studentId}
              </p>
            )}
            <p>
              <span className="text-muted-foreground">Contact:</span> {contact || "Not provided"}
            </p>
            {department && (
              <p>
                <span className="text-muted-foreground">Department:</span> {department}
              </p>
            )}
            <p className="text-pretty">
              <span className="text-muted-foreground">Message:</span> {message}
            </p>
            <p className="text-xs text-muted-foreground">{timestamp.toLocaleString()}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setConfirmOpen(false)}>
              Keep editing
            </Button>
            <Button className="rounded-full bg-gradient-brand text-white" onClick={submit}>
              Confirm &amp; submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
