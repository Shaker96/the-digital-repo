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
  subscription: string,
  renewal: Date,
  downloads: number
}

export type chatQuestion = {
    name: string,
    value: string,
    response: string,
}

export const subscriptions = [
  {
    id: 1,
    name: 'BASIC MONTHLY',
    price: 3.99
  },
  {
    id: 2,
    name: 'BASIC ANNUAL',
    price: 39.99
  },
  {
    id: 3,
    name: 'PREMIUM MONTHLY',
    price: 7.99
  },
  {
    id: 4,
    name: 'PREMIUM ANNUAL',
    price: 79.99
  }
]
