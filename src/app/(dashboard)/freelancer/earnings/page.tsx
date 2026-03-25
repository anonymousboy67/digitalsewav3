"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Clock, AlertCircle, Loader2, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatsCard } from "@/components/shared/StatsCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ITransaction } from "@/types";
import { formatNPR, formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PAYMENT_METHODS } from "@/lib/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const chartData = [
  { month: "Aug", amount: 12000 },
  { month: "Sep", amount: 18000 },
  { month: "Oct", amount: 14000 },
  { month: "Nov", amount: 25000 },
  { month: "Dec", amount: 20000 },
  { month: "Jan", amount: 32000 },
];

export default function FreelancerEarningsPage() {
  const { user } = useCurrentUser();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarned, setTotalEarned] = useState(0);
  const [withdrawMethod, setWithdrawMethod] = useState("khalti");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const goal = 100000;

  const fetchData = async () => {
    const res = await fetch("/api/transactions");
    if (res.ok) {
      const data = await res.json();
      setTransactions(data.transactions || []);
      setTotalEarned(data.totalEarned || 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleWithdraw = async () => {
    setWithdrawing(true);
    await new Promise((r) => setTimeout(r, 2000));
    toast.success(`Demo: Rs. ${totalEarned.toLocaleString()} withdrawal initiated to ${withdrawMethod}!`, { icon: "💰" });
    setWithdrawing(false);
  };

  const monthlyEarnings = totalEarned / 6;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-outfit)" }}>Earnings</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500 text-sm">Your earnings dashboard</p>
            <Badge className="bg-orange-100 text-orange-700 text-xs gap-1">
              <AlertCircle className="h-3 w-3" /> DEMO MODE
            </Badge>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2" onClick={() => setWithdrawDialogOpen(true)}>
          <ArrowDownLeft className="h-4 w-4" /> Withdraw
        </Button>
        <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Earnings (Demo)</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm text-orange-700">
                  This is a demo. No real withdrawal is processed. Available: {formatNPR(totalEarned)}
                </p>
              </div>
              <RadioGroup value={withdrawMethod} onValueChange={setWithdrawMethod}>
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.value} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${withdrawMethod === m.value ? "border-teal-500 bg-teal-50" : "border-gray-200"}`}>
                    <RadioGroupItem value={m.value} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="font-medium text-sm">{m.label}</span>
                  </label>
                ))}
              </RadioGroup>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleWithdraw} disabled={withdrawing}>
                {withdrawing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Simulate Withdrawal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Total Earned" value={formatNPR(totalEarned)} icon={DollarSign} color="teal" />
        <StatsCard title="This Month" value={formatNPR(monthlyEarnings)} icon={TrendingUp} color="emerald" delay={0.1} />
        <StatsCard title="Pending" value={formatNPR(0)} icon={Clock} color="orange" delay={0.2} />
      </div>

      {/* Goal Progress */}
      <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-teal-900">Earnings Goal</h2>
            <span className="text-sm text-teal-600 font-medium">{Math.round((totalEarned / goal) * 100)}%</span>
          </div>
          <Progress value={(totalEarned / goal) * 100} className="h-3 bg-teal-100" />
          <p className="text-sm text-teal-700 mt-2">
            {formatNPR(totalEarned)} of {formatNPR(goal)} monthly goal
          </p>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="border-gray-200">
        <CardContent className="p-5">
          <h2 className="font-semibold mb-4">Earnings Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => [`Rs. ${Number(v).toLocaleString()}`, "Earned"]} />
              <Bar dataKey="amount" fill="#0D9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="p-5 border-b">
            <h2 className="font-semibold">Transaction History</h2>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={DollarSign} title="No transactions yet" description="Complete projects to see your earnings" />
            </div>
          ) : (
            <div className="divide-y">
              {transactions.map((tx) => {
                const project = tx.project as { title?: string };
                return (
                  <div key={tx._id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                      <ArrowDownLeft className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Payment Received</p>
                      <p className="text-xs text-gray-500">{project?.title} • {tx.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+{formatNPR(tx.amount)}</p>
                      <p className="text-xs text-gray-400">{tx.createdAt && formatRelativeTime(tx.createdAt)}</p>
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
