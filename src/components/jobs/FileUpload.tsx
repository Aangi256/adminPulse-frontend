export default function FileUpload({ setFile }: any) {

  return (
    <div className="space-y-3">

      <div className="bg-gray-700 text-white px-4 py-2 rounded font-semibold">
        FILE UPLOAD
      </div>

      <div className="border-2 border-dashed rounded p-6 text-center">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload File
        </label>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <p className="text-gray-500 text-sm mt-2">
          Drag & drop or click to upload
        </p>

      </div>

    </div>
  );
}