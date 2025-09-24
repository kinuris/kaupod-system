@extends('layouts.guest')

@section('title', 'Login')

@section('content')
<div class="max-w-md mx-auto mt-12 bg-white shadow rounded p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-center">Log in to your account</h1>
    @if(session('status'))
        <div class="text-sm text-green-600 text-center">{{ session('status') }}</div>
    @endif
    <form method="POST" action="{{ route('login.store') }}" class="space-y-4">
        @csrf
        <div>
            <label class="block text-sm font-medium mb-1" for="email">Email</label>
            <input type="email" name="email" id="email" value="{{ old('email') }}" required autofocus class="w-full border rounded px-3 py-2" />
            @error('email') <p class="text-xs text-red-600 mt-1">{{ $message }}</p> @enderror
        </div>
        <div>
            <div class="flex justify-between items-center mb-1">
                <label class="block text-sm font-medium" for="password">Password</label>
                @if($canResetPassword)
                    <a href="{{ route('password.request') }}" class="text-xs text-pink-600 hover:underline">Forgot?</a>
                @endif
            </div>
            <input type="password" name="password" id="password" required class="w-full border rounded px-3 py-2" />
            @error('password') <p class="text-xs text-red-600 mt-1">{{ $message }}</p> @enderror
        </div>
        <div class="flex items-center space-x-2">
            <input id="remember" name="remember" type="checkbox" class="h-4 w-4 rounded border-gray-300" />
            <label for="remember" class="text-sm">Remember me</label>
        </div>
        <button class="w-full bg-pink-500 hover:bg-pink-600 text-white rounded py-2 font-medium">Log In</button>
    </form>
    <p class="text-xs text-center text-gray-600">Don't have an account? <a href="{{ route('register') }}?blade=1" class="text-pink-600 hover:underline">Sign up</a></p>
</div>
@endsection
