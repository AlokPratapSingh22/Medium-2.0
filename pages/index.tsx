import Head from 'next/head'
import Link from 'next/link';

import Header from '../components/Header'
import { sanityClient, urlFor } from "../sanity";
import { Post } from '../typings';

interface Props {
  posts: Post[];
}

export default function Home({ posts }: Props) {

  return (
    <div>
      <Head>
        <title>Medium 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className='bg-yellow-400 sticky top-0 z-50 border-black border-b'>
          <Header />
        </div>

        <div className='bg-yellow-400 border-b border-black py-10 relative'>

          <div className='max-w-7xl mx-auto flex justify-between items-center'>

            <div className='px-10 space-y-5'>
              <h1 className='text-7xl font-merriweather max-w-xl tracking-tight font-serif'>
                Medium is a place to write, read, and connect</h1>
              <h2>It's easy and free to post your thinking on any topic
                and connect with millions of readers.</h2>
              <div className=' cursor-pointer bg-white w-32 text-center py-2 border border-black rounded-3xl'>Start Writing</div>
            </div>

            <img src="https://miro.medium.com/max/698/4*BIK9VGjeCj2TaTDw4id2nA.png"
              className='hidden md:inline-flex h-80 lg:h-80 mr-8' alt="" />

          </div>
        </div>

        {/* POSTS */}
        <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6'>
          {posts.map(post => (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className='group cursor-pointer border rounded-lg overflow-hidden'>

                <img src={urlFor(post.mainImage).url()!}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                  alt="" />

                <div className='flex justify-between p-5 bg-white'>
                  <div>
                    <p className='text-lg font-bold'>{post.title}</p>
                    <p className='text-xs'>{post.description} by {post.author.name}</p>
                  </div>
                  <img src={urlFor(post.author.image).url()!} className="h-12 w-12 rounded-full object-cover" alt="" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type=='post']{
    _id,
    title,  
    author -> {
    name,
    image
  },
  description,
  mainImage,
  slug,
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }
};