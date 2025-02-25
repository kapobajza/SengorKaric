import type { Route } from "./+types/route";
import { dehydratedQueryResponse } from '@/web/query/util';
import PostCardList from './components/posts-list';
import { postsQueryOptions } from '@/web/query/post.query';

export async function loader({ request }: Route.LoaderArgs) {
  return dehydratedQueryResponse(request, postsQueryOptions);
}

export default function route() {
  return (
        <PostCardList></PostCardList>
  )
}