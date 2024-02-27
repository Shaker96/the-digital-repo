import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { article } from '../interfaces';
import { sql } from '@vercel/postgres';

const client = createClient({
  projectId: 'a8orhjh3',
  dataset: 'production',
  apiVersion: '2023-11-03',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_USER_ADDER_TOKEN,
});

// IMAGE
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export async function getAllArticles() {
  const articles = await client.fetch(
    `*[_type == "article" && approved == true][0..6] | order(year desc) {
      ...,
      authors[]->{_id, firstname, lastname},
      category->{name, type, _id},
      "fileUrl": file.asset->url
    }`
  );

  return articles;
}

export async function getAllAuthors() {
  const authors = await client.fetch(
    `*[_type == "author"]`
  );

  // console.log(authors);

  return authors;
}

export async function getAllCategories() {
  const categories = await client.fetch(
    `*[_type == "category"]{_id, type, name}`
  );

  // console.log('Categoria', categories);

  return categories;
}

export async function searchArticles(keyword: string) {
  // let authorsQuery = '';
  // let categQuery = '';

  // selAuthors.map((a, i) => {
  //   authorsQuery += `${i === 0 ? '&& (' : ' || '}`;
    
  //   authorsQuery += `"${a}" in authors[]->_id`;
    
  //   if (i === selAuthors.length - 1) {
  //     authorsQuery += ') ';
  //   }
  // })

  // console.log('authors query ', authorsQuery);
  
  // selCategories.map((c, i) => {
  //   if (i === 0) {
  //     categQuery += `${i === 0 ? '&& (' : ' || '}`;
  //   }
    
  //   categQuery += `category._ref == "${c}"`;
    
  //   if (i === selCategories.length - 1) {
  //     categQuery += ') ';
  //   }
  // })

  // console.log('categ query ', categQuery);

  const query = `*[_type == "article" && approved == true && (pt::text(abstract) match $kw || title match $kw || keywords match $kw)] | score(pt::text(abstract) match $kw, boost(title match $kw, 3), boost(keywords match $kw, 2)){
      ...,
      authors[]->{_id, firstname, lastname},
      category->{name, type, _id},
      "fileUrl": file.asset->url
    }`;
  const params = { kw: `${keyword}` };

  const articles = await client.fetch(query, params);

  // const articles = await client.fetch(
  //   `*[_type == "article"]{
  //     ...,
  //     author->{firstname,lastname},
  //     category->{name}
  //   }`);

  // console.log('SEARCH RES', articles);
  
  return articles;
}

export async function saveNewFile(file: File) {
  const res = await client.assets.upload('file', file, {
    filename: file.name
  })

  // console.log('new file', res);
  
  return res;
}

export async function incrementDownloadCount(articleId: string) {  
  await client
    .patch(articleId)
    .setIfMissing({ downloads: 0 })
    .inc({ 'downloads': 1 })
    .commit()
    .then(() => {
      // show a success message
      console.log('Download count updated');
    })
    .catch((error) => {
      // show an error message
      console.error('Download failed', error);
    });
}

export async function saveNewArticle(article: article) {
  // console.log(client.config());
  
  const abstract = [
    {
      markDefs: [],
      children: [
        {
          _type: 'span',
          marks: [],
          text: article.abstract,
        }
      ],
      _type: 'block',
      style: 'normal',
    }
  ]

  // create new authors in sanity
  const createdAuthors = await Promise.all(article.authors.map(async(author) => {
    let id = author._id;
    if (id.includes('new-author')) {
      await client.create({
        _type: 'author',
        firstname: author.firstname,
        lastname: author.lastname
      }).then((value) => {
        id = value._id;
      });
    }

    return {
      _type: "reference",
      _ref: id
    }
  }))

  // console.log(createdAuthors);

  const res = await client.create({
    _type: 'article',
    title: article.title,
    date: `${article.date}-01-01`,
    authors: createdAuthors,
    source: article.source,
    category: {_type: 'reference', _ref: article.category},
    abstract: abstract,
    keywords: article.keywords,
    file: {_type: 'file', asset: {_type: "reference", _ref: article.fileId}},
    userId: article.userId
  }, {autoGenerateArrayKeys: true});

  // console.log('saved', res);

  return res;

  // await client.assets.upload('file', article.file, {
  //   filename: article.file.name
  // }).then(imageAsset => {
  //   return client
  //     .patch(res._id)
  //     .set({
  //       file: {
  //         _type: 'file',
  //         asset: {
  //           _type: "reference",
  //           _ref: imageAsset._id
  //         }
  //       }
  //     })
  //     .commit()
  // }).then(() => {
  //   console.log("Done!");
  // })
}

export async function getUserArticles(userId: number) {
  const articles = await client.fetch(
    `*[_type == "article" && userId == "${userId}"]{
      ...,
      authors[]->{_id, firstname, lastname},
      category->{name, type, _id},
      "fileUrl": file.asset->url
    }`
  );

  return articles;
}

export async function getStats() {
  const stats = await client.fetch(
    `{
      "docs": count(*[_type == "article"]),
      "downlds": math::sum(*[_type == "article"].downloads)
     }`
  )

  const response = await sql`
    SELECT COUNT (*) FROM users;
  `;
  // console.log(response.rows[0].count);

  stats.users = response.rows[0].count

  return stats;
}

export async function deleteArticle(id: string) {
  return await client.delete(id)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}