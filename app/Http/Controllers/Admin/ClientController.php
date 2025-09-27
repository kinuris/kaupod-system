<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'client')
            ->with(['kitOrders', 'consultationRequests'])
            ->orderBy('created_at', 'desc');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $status = $request->get('status');
            if ($status === 'active') {
                $query->where('email_verified_at', '!=', null);
            } elseif ($status === 'unverified') {
                $query->whereNull('email_verified_at');
            }
        }

        $clients = $query->paginate(15)->withQueryString();

        // Add computed fields
        $clients->getCollection()->transform(function ($client) {
            $client->total_kit_orders = $client->kitOrders->count();
            $client->total_consultations = $client->consultationRequests->count();
            $client->last_activity = $client->kitOrders->concat($client->consultationRequests)
                ->sortByDesc('created_at')
                ->first()
                ?->created_at;
            return $client;
        });

        return Inertia::render('Admin/clients/index', [
            'clients' => $clients,
            'filters' => [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
            ],
        ]);
    }

    public function show(User $client)
    {
        // Ensure we're only showing clients
        if (!$client->isClient()) {
            abort(404);
        }

        $client->load([
            'kitOrders' => function($query) {
                $query->orderBy('created_at', 'desc');
            },
            'consultationRequests' => function($query) {
                $query->orderBy('created_at', 'desc');
            }
        ]);

        return Inertia::render('Admin/clients/show', [
            'client' => $client,
        ]);
    }

    public function edit(User $client)
    {
        // Ensure we're only editing clients
        if (!$client->isClient()) {
            abort(404);
        }

        return Inertia::render('Admin/clients/edit', [
            'client' => $client,
        ]);
    }

    public function update(Request $request, User $client)
    {
        // Ensure we're only updating clients
        if (!$client->isClient()) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $client->id,
            'personal_info' => 'nullable|array',
            'personal_info.phone' => 'nullable|string|max:20',
            'personal_info.address' => 'nullable|string|max:500',
            'personal_info.date_of_birth' => 'nullable|date',
            'personal_info.emergency_contact' => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        return back()->with('status', 'Client information updated successfully.');
    }

    public function destroy(User $client)
    {
        // Ensure we're only deleting clients
        if (!$client->isClient()) {
            abort(404);
        }

        // Check if client has active orders or consultations
        $hasActiveOrders = $client->kitOrders()
            ->whereNotIn('status', ['cancelled', 'sent_result'])
            ->exists();

        $hasActiveConsultations = $client->consultationRequests()
            ->whereNotIn('status', ['cancelled', 'completed'])
            ->exists();

        if ($hasActiveOrders || $hasActiveConsultations) {
            return back()->withErrors([
                'delete' => 'Cannot delete client with active orders or consultations.'
            ]);
        }

        $client->delete();

        return redirect()->route('admin.clients.index')
            ->with('status', 'Client deleted successfully.');
    }

    public function toggleStatus(User $client)
    {
        // Ensure we're only updating clients
        if (!$client->isClient()) {
            abort(404);
        }

        // Toggle email verification status (this affects account access)
        if ($client->email_verified_at) {
            $client->update(['email_verified_at' => null]);
            $message = 'Client account disabled successfully.';
        } else {
            $client->update(['email_verified_at' => now()]);
            $message = 'Client account enabled successfully.';
        }

        return back()->with('status', $message);
    }
}