export default function Home() {
    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4">
            <div className="group w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-blue-500/20">
                <h1 className="text-xl font-bold tracking-tight text-white md:text-xl">
                    Hello Company B friends, First set up API keys in the .env file. After that, you're ready to go.
                </h1>
            </div>
        </div>
    )
    
}