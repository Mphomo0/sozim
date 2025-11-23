interface NewApplicationCardProps {
  studentId: string
}

export default function NewApplicationCard({
  studentId,
}: NewApplicationCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Apply for a New Program</h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Program Name</label>
          <input
            type="text"
            name="program"
            placeholder="Enter program name"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Describe your application"
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  )
}
