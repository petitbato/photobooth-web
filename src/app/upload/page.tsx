import Form from 'next/form'
import { uploadPhoto } from '@/lib/actions/upload'

export default function UploadForm() {
  return (
    <Form action={uploadPhoto} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-md border">
      <div>
        <label htmlFor="photo" className="w-full rounded px-3 py-2 text-black">
          Fichier image
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/*"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-black"
        />
      </div>

      <div>
        <label htmlFor="uploader" className="w-full rounded px-3 py-2 text-black">
          Nom de l’envoyeur
        </label>
        <input
          type="text"
          name="uploader"
          id="uploader"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          placeholder="Votre nom"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Envoyer la photo
      </button>
    </Form>
  )
}
