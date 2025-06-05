import Form from 'next/form'
import { uploadPhoto } from '@/lib/actions/upload'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function UploadForm() {
  'use server'
  const session = await cookies()
  const sessionId = session.get('session-id')?.value

  if (!sessionId) {
    redirect('/login')
  }
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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Envoyer la photo
      </button>
    </Form>
  )
}
