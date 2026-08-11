@php
$setting = \App\Models\Setting::first();
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);
            const theme = isDark ? 'dark' : 'light';

            document.documentElement.classList.toggle('dark', isDark);
            document.documentElement.style.colorScheme = theme;
            document.body.setAttribute('data-theme', theme);
            document.body.setAttribute('sidebar-data-theme', 'sidebar-show');
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <link rel="icon" href={{asset($setting?->favicon)}} sizes="any">
    <link rel="icon" href={{asset($setting?->favicon)}} type="image/svg+xml">
    <link rel="apple-touch-icon" href={{asset($setting?->favicon)}}>

    @fonts

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    <x-inertia::head>
        {{-- <title>{{ config('app.name', 'Laravel') }}</title> --}}
        <title> {{ $page['props']['site_settings'] ?? config('app.name') }}</title>
    </x-inertia::head>
    <link href="{{asset('/backend/assets/css/sidebar-menu.css')}}" rel="stylesheet" />
    <link href="{{asset('/backend/assets/css/simplebar.css')}}" rel="stylesheet" />
    <link href="{{asset('/backend/assets/css/prism.css')}}" rel="stylesheet" />
    <link href="{{asset('/backend/assets/css/quill.snow.css')}}" rel="stylesheet" />
    <link href="{{asset('/backend/assets/css/remixicon.css')}}" rel="stylesheet" />
    <link href="{{asset('/backend/assets/css/swiper-bundle.min.css')}}" rel="stylesheet" />
    <link href="{{asset('/backend/assets/css/jsvectormap.min.css')}}" rel="stylesheet" />
    <link href="{{asset('/backend/assets/images/favicon.png')}}" rel="icon" type="image/png" />
    <link href="{{asset('/backend/assets/css/style.css')}}" rel="stylesheet" />
</head>

<body class="font-sans antialiased">
    <x-inertia::app />

    <script src="{{asset('/backend/assets/js/bootstrap.bundle.min.js')}}"></script>
    <script src="{{asset('/backend/assets/js/sidebar-menu.js')}}"></script>
    <script src="{{asset('/backend/assets/js/quill.min.js')}}"></script>
    <script src="{{asset('/backend/assets/js/data-table.js')}}"></script>
    <script src="{{asset('/backend/assets/js/prism.js')}}"></script>
    <script src="{{asset('/backend/assets/js/clipboard.min.js')}}"></script>
    <script src="{{asset('/backend/assets/js/simplebar.min.js')}}"></script>
    {{-- <script src="{{asset('/backend/assets/js/apexcharts.min.js')}}"></script> --}}
    <script src="{{asset('/backend/assets/js/echarts.min.js')}}"></script>
    <script src="{{asset('/backend/assets/js/swiper-bundle.min.js')}}"></script>
    <script src="{{asset('/backend/assets/js/fullcalendar.main.js')}}"></script>
    <script src="{{asset('/backend/assets/js/jsvectormap.min.js')}}"></script>
    <script src="{{asset('/backend/assets/js/world-merc.js')}}"></script>
    <script src="{{asset('/backend/assets/js/custom/apexcharts.js')}}"></script>
    <script src="{{asset('/backend/assets/js/custom/echarts.js')}}"></script>
    <script src="{{asset('/backend/assets/js/custom/maps.js')}}"></script>
    <script src="{{asset('/backend/assets/js/custom/custom.js')}}"></script>
</body>

</html>