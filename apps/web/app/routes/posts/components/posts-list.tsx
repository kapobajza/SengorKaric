import React from 'react'
import PostCard from './post-card'
import { usePostQueryCached } from '@/web/query/post.query'
import { cn } from '@/web/lib/utils';

type PostListProps = {
  limit: number;
  showPagination: boolean;
  grid?: string;
}

export default function PostCardList({ grid }: PostListProps) {
  const { data, isLoading } = usePostQueryCached();

  if (isLoading || !data) return <div>Loading...</div>; // Možemo dodati loading indicator.

  return (
    <div className={cn("grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", grid)}>
      {data.map((post) => (
        <div 
          key={post.id}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
