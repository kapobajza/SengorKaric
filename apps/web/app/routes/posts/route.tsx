import React from 'react'
import type { Route } from "./+types/route";
import { dehydratedQueryResponse } from '@/web/query/util';
import { meQueryOptions } from '@/web/query/user.query';
import PostCard from './components/post-card';
import PostCardList from './components/posts-list';

type Props = {}
export async function loader({ request }: Route.LoaderArgs) {
  return dehydratedQueryResponse(request, meQueryOptions);
}

export default function route({}: Props) {
  return (
    <div>
        <PostCardList limit={0} showPagination={false}></PostCardList>
    </div>
  )
}