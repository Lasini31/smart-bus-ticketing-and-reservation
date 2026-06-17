import { useState } from 'react'

export default function About() {
	const [formState, setFormState] = useState({ name: '', rating: '5', message: '' })
	const [submitted, setSubmitted] = useState(false)

	const handleSubmit = (event) => {
		event.preventDefault()
		setSubmitted(true)
	}

	return (
		<main className="min-h-screen pt-24 pb-12 px-4">
			<div className="mx-auto max-w-4xl space-y-8">
				<section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/40 sm:p-8">
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">About</p>
					<h1 className="mt-2 text-3xl font-bold text-emerald-950">Smart Bus Ticketing & Reservation</h1>
					<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">We provide an easy-to-use online booking system for buses, allowing passengers to search routes, reserve seats, pay securely and download digital tickets. This demo app showcases the core booking and wallet flows.</p>
				</section>

				<section className="rounded-3xl border border-slate-100 bg-white p-6 shadow sm:p-8">
					<h2 className="text-xl font-semibold">Terms &amp; Conditions</h2>
					<p className="mt-3 text-sm text-slate-600">These are sample terms for the demo application. Replace this text with your legal terms and privacy policy when deploying to production. By using this demo, you acknowledge this is a mock service and no real payments or reservations are processed.</p>
				</section>

				<section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/40 sm:p-8">
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Feedback</p>
					<h3 className="mt-2 text-2xl font-bold text-emerald-950">Share your travel experience</h3>
					<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Tell us how the booking flow, service, or demo experience felt so we can improve the app.</p>

					<form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
						<div className="grid gap-4 sm:grid-cols-2">
							<label className="grid gap-2 text-sm font-medium text-slate-700">
								Your name
								<input
									type="text"
									value={formState.name}
									onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
									className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
									placeholder="Enter your name"
								/>
							</label>

							<label className="grid gap-2 text-sm font-medium text-slate-700">
								Rating
								<select
									value={formState.rating}
									onChange={(event) => setFormState((current) => ({ ...current, rating: event.target.value }))}
									className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
								>
									<option value="5">Excellent</option>
									<option value="4">Good</option>
									<option value="3">Average</option>
									<option value="2">Needs improvement</option>
									<option value="1">Poor</option>
								</select>
							</label>
						</div>

						<label className="grid gap-2 text-sm font-medium text-slate-700">
							Message
							<textarea
								rows="5"
								value={formState.message}
								onChange={(event) => setFormState((current) => ({ ...current, message: event.target.value }))}
								className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
								placeholder="Write your comments here"
							/>
						</label>

						<div className="flex items-center justify-between gap-4">
							<p className="text-sm text-slate-500">We read every submission and use it to improve the service.</p>
							<button type="submit" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Submit feedback</button>
						</div>
					</form>

					{submitted ? (
						<p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Thanks for your feedback. Your message was captured locally for this demo.</p>
					) : null}
				</section>
			</div>
		</main>
	)
}