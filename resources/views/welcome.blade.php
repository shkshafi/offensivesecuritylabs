<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Offensive Security Labs</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">

        <style>
            :root {
                --bg-color: #0b0f19;
                --text-color: #f3f4f6;
                --accent-color: #3b82f6;
                --accent-hover: #2563eb;
                --card-bg: rgba(30, 41, 59, 0.7);
                --card-border: rgba(255, 255, 255, 0.08);
            }

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                background-color: var(--bg-color);
                color: var(--text-color);
                font-family: 'Outfit', sans-serif;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                background-image: 
                    radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
                    radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%);
            }

            header {
                width: 100%;
                max-width: 1200px;
                padding: 30px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .logo {
                font-size: 1.5rem;
                font-weight: 800;
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-decoration: none;
            }

            nav a {
                color: #9ca3af;
                text-decoration: none;
                margin-left: 20px;
                font-weight: 600;
                transition: color 0.2s ease;
            }

            nav a:hover {
                color: var(--text-color);
            }

            .btn-nav {
                border: 1px solid var(--card-border);
                padding: 8px 18px;
                border-radius: 20px;
                background: rgba(255, 255, 255, 0.03);
            }

            .btn-nav:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.15);
            }

            main {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-grow: 1;
                padding: 20px;
                width: 100%;
            }

            .card {
                max-width: 650px;
                width: 100%;
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                border-radius: 24px;
                padding: 50px 40px;
                backdrop-filter: blur(12px);
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                text-align: center;
                animation: fadeInUp 0.8s ease;
            }

            h1 {
                font-size: 3rem;
                font-weight: 800;
                margin-bottom: 20px;
                line-height: 1.1;
                background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            p {
                font-size: 1.15rem;
                color: #9ca3af;
                line-height: 1.6;
                margin-bottom: 40px;
                font-weight: 300;
            }

            .btn-primary {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
                padding: 16px 36px;
                font-size: 1.1rem;
                font-weight: 600;
                text-decoration: none;
                border-radius: 30px;
                box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
            }

            footer {
                padding: 30px;
                color: #4b5563;
                font-size: 0.9rem;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 640px) {
                h1 {
                    font-size: 2.2rem;
                }
                .card {
                    padding: 40px 20px;
                }
            }
        </style>
    </head>
    <body>
        <header>
            <a href="/" class="logo">Offensive Security Labs</a>
            @if (Route::has('login'))
                <nav>
                    @auth
                        <a href="{{ url('/dashboard') }}" class="btn-nav">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}">Log in</a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="btn-nav">Register</a>
                        @endif
                    @endauth
                </nav>
            @endif
        </header>

        <main>
            <div class="card">
                <h1>Offensive Security Labs</h1>
                <p>
                    A comprehensive hub for vulnerability research, red teaming methodology, and threat intelligence. Explore our structured guides, methodologies, and cheat sheets.
                </p>
                <a href="/kb/" class="btn-primary">Access Knowledge Base (/kb)</a>
            </div>
        </main>

        <footer>
            Copyright &copy; {{ date('Y') }} Offensive Security Labs. All Rights Reserved.
        </footer>
    </body>
</html>
