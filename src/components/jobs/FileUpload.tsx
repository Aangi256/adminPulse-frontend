interface Props {
  setFile: (file: File | null) => void;
}

export default function FileUpload({ setFile }: Props) {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  return (
    <div className="bg-white rounded shadow p-6 space-y-2">
      <h2 className="text-lg font-semibold text-gray-700">Attach File</h2>

      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0 file:text-sm file:font-medium
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <p className="text-xs text-gray-400">
        Accepted: PDF, JPG, PNG, XLSX, DOCX
      </p>
    </div>
  );
}