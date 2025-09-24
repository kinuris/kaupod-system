import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface CR { id:number; status:string; user_id:number; }
interface Paginated<T> { data:T[]; links:unknown[]; }
interface PageProps { requests: Paginated<CR>; statuses: string[]; }

export default function ConsultationRequestsIndex({ requests, statuses }: PageProps) {
  const [updatingId, setUpdatingId] = useState<number|null>(null);
  const updateStatus = (id:number, status:string) => {
    setUpdatingId(id);
    router.patch(`/admin/consultation-requests/${id}/status`, { status }, { onFinish:()=> setUpdatingId(null) });
  };
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Consultation Requests</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-neutral-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Update</th>
          </tr>
        </thead>
        <tbody>
          {requests.data.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.user_id}</td>
              <td className="p-2 font-mono">{r.status}</td>
              <td className="p-2">
                <select disabled={updatingId===r.id} value={r.status} onChange={e=>updateStatus(r.id, e.target.value)} className="border rounded px-2 py-1 text-xs">
                  {statuses.map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
