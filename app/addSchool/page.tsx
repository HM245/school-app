"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
	name: string;
	address: string;
	email: string;
	phone: string;
	website?: string;
	image: FileList;
};

export default function AddSchoolForm() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>();

	const [message, setMessage] = useState<string | null>(null);

	const onSubmit = async (data: FormValues) => {
		setMessage(null);
		try {
			const form = new FormData();
			form.append("name", data.name);
			form.append("address", data.address);
			form.append("email", data.email);
			form.append("phone", data.phone);
			if (data.website) form.append("website", data.website);
			if (data.image && data.image.length > 0) form.append("image", data.image[0]);

			const res = await fetch("/api/schools", {
				method: "POST",
				body: form,
			});

			// if (!res.ok) throw new Error("Failed to save school");
			setMessage("School saved successfully.");
			reset();
		} catch (err) {
			console.error(err);
			setMessage("Failed to save school. See console for details.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-black p-6">
			<div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl text-black text-center font-semibold mb-4">Add a School</h2>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label className="block text-sm text-black font-bold">Name *</label>
						<input
							className="mt-1 block text-black w-full rounded border px-3 py-2"
							{...register("name", { required: "Name is required" })}
						/>
						{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
					</div>

					<div>
						<label className="block text-sm text-black font-bold">Address *</label>
						<input
							className="mt-1 block text-black w-full rounded border px-3 py-2"
							{...register("address", { required: "Address is required" })}
						/>
						{errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm text-black font-bold">Email *</label>
							<input
								className="mt-1 block text-black w-full rounded border px-3 py-2"
								{...register("email", {
									required: "Email is required",
									pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
								})}
							/>
							{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
						</div>

						<div>
							<label className="block text-sm text-black font-bold">Phone *</label>
							<input
								className="mt-1 block text-black w-full rounded border px-3 py-2"
								{...register("phone", { required: "Phone is required" })}
							/>
							{errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
						</div>
					</div>

					<div>
						<label className="block text-sm text-black font-bold">Website</label>
						<input
							className="mt-1 block w-full rounded border px-3 py-2 text-black"
							{...register("website", { pattern: { value: /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/, message: "Invalid URL" } })}
						/>
						{errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
					</div>

					<div>
						<label className="block text-sm text-black font-bold">School Image *</label>
						<input
							type="file"
							accept="image/*"
							className="mt-1 block w-full text-black bg-gray-400"
							{...register("image", { required: "Image is required" })}
						/>
						{errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
					</div>

					<div className="flex items-center gap-3">
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
						>
							{isSubmitting ? "Saving..." : "Save"}
						</button>
						<button type="button" onClick={() => reset()} className="px-4 py-2 rounded border text-black">
							Reset
						</button>
					</div>

					{message && <p className="mt-2 text-sm">{message}</p>}
				</form>
			</div>
		</div>
	);
}

