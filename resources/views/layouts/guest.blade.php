<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@yield('title') - Kaupod</title>
    @vite(['resources/css/app.css','resources/js/app.tsx'])
    <style>body{background:#FFD1D1;font-family:Inter,ui-sans-serif,system-ui,sans-serif}</style>
</head>
<body class="min-h-screen">
    <main>@yield('content')</main>
</body>
</html>
