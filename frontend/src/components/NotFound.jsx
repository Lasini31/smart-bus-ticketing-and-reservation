import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-sm text-slate-600">Page not found.</p>
        <div className="mt-4">
          <Link to="/" className="text-emerald-600 font-semibold">Go home</Link>
        </div>
      </div>
    </main>
  )
}
