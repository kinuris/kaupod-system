import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface Order { id:number; status:string; price:string; user_id:number; }
interface Paginated<T> { data:T[]; links:unknown[]; }
interface PageProps { orders: Paginated<Order>; statuses: string[]; }

export default function KitOrdersIndex({ orders, statuses }: PageProps) {
  const [updatingId, setUpdatingId] = useState<number|null>(null);

  const updateStatus = (id:number, status:string) => {
    setUpdatingId(id);
    router.patch(`/admin/kit-orders/${id}/status`, { status }, { onFinish:()=> setUpdatingId(null) });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Kit Orders</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-neutral-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.data.map(o => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.id}</td>
              <td className="p-2">{o.user_id}</td>
              <td className="p-2">₱{o.price}</td>
              <td className="p-2 font-mono">{o.status}</td>
              <td className="p-2">
                <select disabled={updatingId===o.id} value={o.status} onChange={e=>updateStatus(o.id, e.target.value)} className="border rounded px-2 py-1 text-xs">
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
