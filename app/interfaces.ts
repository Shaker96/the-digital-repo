export type article = {
  title: string,
  date: string,
  authors: author[],
  source?: string,
  category: string,
  abstract: string,
  content?: string,
  fileId: string,
  keywords: string[],
  cover?: File,
  userId: string,
}

export type author = {
  _id: string,
  firstname: string,
  lastname: string
}

export type category = {
  _id: string,
  name: string,
  type: string
}

export type sanityFile = {
  url: string,
  _id: string,
  _createdAt: string,
  _updatedAt: string,
}

export type user = {
  email: string,
  id: number,
  firstname: string,
  lastname: string,
  expiryDate: string,
  downloads: number,
  uploads: number,
  totalDownloads: number,
  totalUploads: number,
  subName: string,
  isSub: boolean
}

export type chatQuestion = {
    name: string,
    value: string,
    response: string,
}

export const subscriptions = [
  {
    name: 'BASIC MONTHLY',
    price: 3.99,
    days_of_benefit: 30,
    uploads: 10,
    downloads: 50,
  },
  {
    name: 'BASIC ANNUAL',
    price: 39.99,
    days_of_benefit: 365,
    uploads: 150,
    downloads: 625,
  },
  {
    name: 'PREMIUM MONTHLY',
    price: 7.99,
    days_of_benefit: 30,
    uploads: 0,
    downloads: 0,
  },
  {
    name: 'PREMIUM ANNUAL',
    price: 79.99,
    days_of_benefit: 365,
    uploads: 0,
    downloads: 0,
  }
]
