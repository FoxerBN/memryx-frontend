import { useEffect, useState } from 'react'
const themes = ['light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
  'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury',
  'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 
  'winter', 'procyon'] as const
type Theme = (typeof themes)[number]

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) ?? 'light'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
      <div className="dropdown mb-4">
        <div tabIndex={0} role="button" className="btn m-1">
          Theme
          <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content bg-base-300 rounded-box z-10 w-52 p-2 shadow-2xl"
        >
          {themes.map((t) => (
            <li key={t}>
              <button
                className={`theme-controller w-full btn btn-sm btn-ghost justify-start ${
                  theme === t ? 'active bg-primary text-primary-content' : ''
                }`}
                aria-label={t.charAt(0).toUpperCase() + t.slice(1)}
                onClick={() => setTheme(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {theme === t && <span className="ml-auto">✔</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }