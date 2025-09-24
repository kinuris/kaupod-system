@extends('layouts.guest')

@section('title', 'Register')

@section('content')
<div class="max-w-md mx-auto mt-12 bg-white shadow rounded p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-center">Create an account</h1>
    <form method="POST" action="{{ route('register.store') }}" class="space-y-4">
        @csrf
        <div>
            <label class="block text-sm font-medium mb-1" for="name">Name</label>
            <input type="text" name="name" id="name" value="{{ old('name') }}" required autofocus class="w-full border rounded px-3 py-2" />
            @error('name') <p class="text-xs text-red-600 mt-1">{{ $message }}</p> @enderror
        </div>
        <div>
            <label class="block text-sm font-medium mb-1" for="email">Email</label>
            <input type="email" name="email" id="email" value="{{ old('email') }}" required class="w-full border rounded px-3 py-2" />
            @error('email') <p class="text-xs text-red-600 mt-1">{{ $message }}</p> @enderror
        </div>
        <div>
            <label class="block text-sm font-medium mb-1" for="password">Password</label>
            <input type="password" name="password" id="password" required class="w-full border rounded px-3 py-2" />
            @error('password') <p class="text-xs text-red-600 mt-1">{{ $message }}</p> @enderror
        </div>
        <div>
            <label class="block text-sm font-medium mb-1" for="password_confirmation">Confirm Password</label>
            <input type="password" name="password_confirmation" id="password_confirmation" required class="w-full border rounded px-3 py-2" />
        </div>
        <button class="w-full bg-teal-600 hover:bg-teal-700 text-white rounded py-2 font-medium">Create Account</button>
    </form>
    <p class="text-xs text-center text-gray-600">Already have an account? <a href="{{ route('login') }}?blade=1" class="text-teal-600 hover:underline">Log in</a></p>
</div>
@endsection
