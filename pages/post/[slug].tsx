import { sanityClient, urlFor } from "../../sanity";
import React, { useState } from 'react'
import Header from "../../components/Header";
import { Post } from "../../typings";
import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import Head from "next/head";

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props {
    post: Post;
}

function Post({ post }: Props) {

    const [submitted, setSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        console.log(data)
        fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            setSubmitted(true);
        }).catch((err) => {
            console.log(err);
            setSubmitted(false);
        })
    };

    return (

        <main>
            <Head>
                <title>{post.title} | by {post.author.name} - Medium 2.0 </title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="bg-white sticky top-0 z-50 border-black border-b">
                <Header />
            </div>

            <img className="w-full h-40 object-cover" src={urlFor(post.mainImage).url()!} alt="" />


            <article className="max-w-3xl mx-auto p-5">
                <div className="items-center flex space-x-2">
                    <img src={urlFor(post.author.image).url()!} className="h-10 w-10 object-cover rounded-full"
                        alt="" />
                    <div className="mt-2">
                        <p className="">{post.author.name}</p>
                        <p className="mt-1 text-gray-500 font-extralight text-sm">{new Date(post._createdAt).toDateString()}</p>
                    </div>
                </div>
                <h1 className="font-bold text-4xl mt-4 mb-3">{post.title}</h1>
                <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>

                <div>
                    <PortableText
                        content={post.body}
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                        serializers={
                            {
                                h1: ({ children }: any) => (
                                    <h1 className="text-2xl font-bold my-5">{children}</h1>
                                ),
                                h2: ({ children }: any) => (
                                    <h2 className="text-xl font-bold my-5">{children}</h2>
                                ),
                                li: ({ children }: any) => (
                                    <li className="ml-4 list-disc">{children}</li>
                                ),
                                link: ({ href, children }: any) => (
                                    <a href={href} className="text-blue-500 hover:underline">
                                        {children}
                                    </a>
                                ),
                            }
                        }
                    />
                </div>
            </article>

            <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

            {submitted ? (
                <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white mx-auto max-w-2xl">
                    <h3 className="text-3xl">
                        Thank you for your comment.
                    </h3>
                    <p>
                        Once it has been approved. It will appear below.
                    </p>
                </div>
            ) : (
                <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10 my-10"
                    onSubmit={handleSubmit(onSubmit)}>
                    <h3 className="text-sm text-yellow-500" >Enjoyed the article?</h3>
                    <h4 className="text-3xl font-bold">Leave a comment below!</h4>
                    <hr className="py-3 mt-2" />

                    <input
                        type="hidden"
                        {...register("_id")}
                        name="_id"
                        value={post._id}
                    />

                    <label className="block mb-5 ">
                        <span className="text-gray-700">Name</span>
                        <input placeholder="John Doe" type="text"
                            {...register("name", { required: true })}
                            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none  ring-yellow-500 focus:ring" />
                    </label>
                    <label className="block mb-5 ">
                        <span className="text-gray-700">Email</span>
                        <input placeholder="John.Doe@example.com" type="email"
                            {...register("email", { required: true })}
                            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none ring-yellow-500 focus:ring" />
                    </label>
                    <label className="block mb-5 ">
                        <span className="text-gray-700">Comment</span>
                        <textarea placeholder="Write your comment here" rows={8}
                            {...register("comment", { required: true })}
                            className="shadow border rounded py-2 px-3 form-textarea ring-yellow-500 mt-1 block w-full outline-none focus:ring" />
                    </label>

                    <div className="flex flex-col p-5">
                        {errors.name && (
                            <span className="text-red-500">
                                * The name field is required
                            </span>
                        )}
                        {errors.comment && (
                            <span className="text-red-500">
                                * The comment field is required
                            </span>
                        )}
                        {errors.email && (
                            <span className="text-red-500">
                                * The email field is required
                            </span>
                        )}
                    </div>

                    <input type="submit" value="Submit"
                        className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline
                 focus:outline-none text-white font-bold py-2
                 rounded cursor-pointer"
                    />
                </form>)}

            {/* Comments */}
            <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
                <h3 className="text-4xl">Comments</h3>
                <hr className="pb-2" />
                {post.comments.map((comment) => (
                    <div key={comment._id}>
                        <p className="">
                            <span className="text-yellow-500 italic">{comment.name}</span>
                            : {comment.comment}</p>
                    </div>
                ))}
            </div>
        </main >
    )
}

export default Post;

export const getStaticPaths = async () => {
    const query = `*[_type=="post"]{
        _id,
        slug{
            current
        }
    }`

    // fetching posts
    const posts = await sanityClient.fetch(query)

    // creating a list of paths
    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
        // block the path from showing if doesn't exists
    }
}

// prepare page to use the paths information
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type=="post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image,
        },
        'comments': *[
            _type == "comment" && 
            post._ref == ^._id && 
            approved == true
        ],
        description,
        mainImage,
        slug,
        body
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug
    });

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post,
        },
        revalidate: 60, // after every 60s it will update the cache
    }
}