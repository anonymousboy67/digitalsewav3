"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownLeft, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/shared/StatsCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ITransaction } from "@/types";
import { formatNPR, formatRelativeTime, cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PAYMENT_METHODS } from "@/lib/constants";

export default function ClientPaymentsPage() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("khalti");
  const [demoLoading, setDemoLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    if (res.ok) {
      const data = await res.json();
      setTransactions(data.transactions || []);
      setTotalSpent(data.totalSpent || 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleDemoDeposit = async () => {
    setDemoLoading(true);
    await new Promise((r) => setTimeout(r, 1500)); // simulate delay
    toast.success("Demo: Rs. 10,000 escrow deposit simulated!", { icon: "💳" });
    setDemoLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Payments</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">Manage your project payments</p>
            <Badge className="bg-orange-100 text-orange-700 text-xs gap-1">
              <AlertCircle className="h-3 w-3" /> DEMO MODE
            </Badge>
          </div>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 gap-2" onClick={() => setDialogOpen(true)}>
          <CreditCard className="h-4 w-4" /> Fund Escrow
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Fund Escrow Account (Demo)</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-700">
                  This is a demo. No real payments are processed. All transactions are simulated for demonstration purposes.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-3">Select Payment Method</p>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === m.value ? "border-teal-500 bg-teal-50" : "border-gray-200"}`}
                    >
                      <RadioGroupItem value={m.value} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="font-medium text-sm">{m.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700"
                onClick={handleDemoDeposit}
                disabled={demoLoading}
              >
                {demoLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Simulate Deposit Rs. 10,000
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Total Spent" value={formatNPR(totalSpent)} icon={DollarSign} color="teal" />
        <StatsCard title="Active Escrow" value={formatNPR(0)} icon={CreditCard} color="blue" delay={0.1} />
        <StatsCard title="Transactions" value={transactions.length} icon={ArrowUpRight} color="emerald" delay={0.2} />
      </div>

      {/* Transactions */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="p-5 border-b">
            <h2 className="font-semibold text-gray-900">Transaction History</h2>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-2 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={CreditCard} title="No transactions yet" description="Fund your escrow to start hiring freelancers" />
            </div>
          ) : (
            <div className="divide-y">
              {transactions.map((tx) => {
                const project = tx.project as { title?: string };
                const to = tx.to as { name?: string };
                const from = tx.from as { name?: string };
                const isOut = tx.type === "escrow_deposit" || tx.type === "escrow_release";
                return (
                  <div key={tx._id} className="flex items-center gap-4 px-5 py-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOut ? "bg-red-50" : "bg-green-50"}`}>
                      {isOut ? <ArrowUpRight className="h-5 w-5 text-red-500" /> : <ArrowDownLeft className="h-5 w-5 text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {tx.type === "escrow_deposit" ? "Escrow Deposit" : tx.type === "escrow_release" ? "Payment Released" : "Refund"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {project?.title} • {tx.paymentMethod} • {tx.createdAt && formatRelativeTime(tx.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isOut ? "text-red-600" : "text-green-600"}`}>
                        {isOut ? "-" : "+"}{formatNPR(tx.amount)}
                      </p>
                      <Badge className={cn("text-xs", tx.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
