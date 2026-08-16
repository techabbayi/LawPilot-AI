"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { DashboardWrapper } from "@/components/layout/DashboardWrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Users, Trash2, ShieldCheck, CheckCircle2, UserCheck, RefreshCw, AlertTriangle } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteModalUser, setDeleteModalUser] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (targetUserId: string, newRole: string) => {
    setUpdatingId(targetUserId);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, newRole }),
      });
      if (res.ok) {
        setSuccessMsg(`Role updated to ${newRole.toUpperCase()} successfully.`);
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteModalUser._id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || "User account deleted.");
        setDeleteModalUser(null);
        fetchUsers();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardWrapper title="User Management & Role Access Controls">
      <div className="space-y-8 max-w-6xl mx-auto font-sans">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">User Accounts & Role Governance</h1>
            <p className="text-xs text-slate-500">Manage user roles (User, Legal Reviewer, Enterprise Admin) and delete accounts.</p>
          </div>

          <Button size="sm" onClick={fetchUsers} isLoading={loading} variant="outline" className="text-xs gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </Button>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}

        <Card className="p-6 bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-700">Total Accounts: {users.length}</span>
            <Badge variant="info">Live Database Sync</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Role Status</th>
                  <th className="p-3">Registered Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-[#0F172A]">{u.name}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{u.email}</div>
                    </td>
                    <td className="p-3 text-slate-600">
                      {u.organization || "Independent Counsel"}
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={updatingId === u._id || u.email === "admin@lawpilot.ai"}
                        className="bg-white border border-slate-300 text-[#0F172A] font-bold text-xs rounded-lg p-1.5 focus:border-[#1E3A8A] cursor-pointer disabled:opacity-50"
                      >
                        <option value="user">User (Standard)</option>
                        <option value="legal_reviewer">Legal Reviewer (Pro)</option>
                        <option value="admin">Admin (Enterprise)</option>
                      </select>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      {u.email !== "admin@lawpilot.ai" ? (
                        <button
                          onClick={() => setDeleteModalUser(u)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Root Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {deleteModalUser && (
          <Modal
            isOpen={!!deleteModalUser}
            onClose={() => setDeleteModalUser(null)}
            title="Confirm User Account Deletion"
            description="Permanently delete user account and access records."
            maxWidth="md"
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-red-50 text-red-900 rounded-lg border border-red-200 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" /> Account Target: {deleteModalUser.email}
                </span>
                <p>Are you sure you want to delete this user? Their account credentials will be purged.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setDeleteModalUser(null)}>Cancel</Button>
                <Button variant="danger" onClick={handleDeleteUser} isLoading={deleting}>
                  Delete Account Now
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardWrapper>
  );
}
