import PostCard from './post-card'
import { usePostsQuery } from '@/web/query/post.query';
import { Link } from 'react-router';

export default function PostCardList() {
  const { data, isLoading } = usePostsQuery();

  if (isLoading || !data) return <div>Loading...</div>; 

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.map((post) => (
        <Link to={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          key={post.id}>
          <PostCard post={post} />
        </Link>
      ))}
    </div>
    </div>
  );
}
