export type UserProfile = {
  id: string
  email: string
  role: string
  createdAt: string
  totalPhotos: number
  totalLikes: number
  photos: {
    id: string
    url: string
    createdAt: string
    likes: number
  }[]
}
