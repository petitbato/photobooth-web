import { uploadPhoto } from '@/lib/actions/upload' // ou '@/lib/actions/photo' si tu l’as rangé là

export default async function UploadPage({
  searchParams,
}: {
  searchParams?: { success?: string }
}) {
  const success = searchParams?.success === '1'

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          📤 Envoyer une photo
        </h1>

        {success && (
          <p className="text-green-600 bg-green-50 p-3 rounded-md text-center border border-green-200 shadow">
            ✅ Photo envoyée avec succès !
          </p>
        )}

        <form
          action={uploadPhoto}
          className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-md border"
        >
          <div>
            <label htmlFor="photo" className="block font-medium mb-1">
              Fichier image
            </label>
            <input
              type="file"
              name="photo"
              id="photo"
              accept="image/*"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="uploader" className="block font-medium mb-1">
              Nom de l’envoyeur
            </label>
            <input
              type="text"
              name="uploader"
              id="uploader"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Envoyer la photo
          </button>
        </form>
      </div>
    </main>
  )
}
