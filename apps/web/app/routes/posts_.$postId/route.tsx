import { CreatePostApi } from '@/web/networking/posts.api';
import { type LoaderFunction } from 'react-router';
import PostDetail from './components/post-detail';

export const loader: LoaderFunction = async ({ params })=> {
  const api = CreatePostApi(undefined);
  const { postId } = params;
   const post = await api.getPostById(postId);
   if (!post) {
     throw new Response("Post not found", { status: 404 });
   }
   return post;
};

export default function route() {
    return (
      <PostDetail></PostDetail>
    );
  }


