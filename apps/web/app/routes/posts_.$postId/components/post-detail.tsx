import { useLoaderData } from "react-router";

export default function PostDetail() {
  const post = useLoaderData();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gray-50">
      <div className="max-w-7xl w-full">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 text-center italic">
          Datum objave: {new Date(post.createdAt).toDateString()}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {post.categories.map((c: any, index: number) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {c.name}
            </span>
          ))}
        </div>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-800 text-justify">
          {post.content.map((t: any, index: number) => (
            <p key={index} className="indent-6">{t.text}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
