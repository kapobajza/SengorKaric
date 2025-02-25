
import { createWebApiClient, defineApiConfig } from "./client";
import postsData from "./postsData.json";

export const CreatePostApi = defineApiConfig(() => {
  const postApi = createWebApiClient({
    routePrefix: "posts",
    request: undefined,  
    options: {
      withCredentials: false, 
    },
  })
  const data = postsData;

    return {
        async getAllPosts()
        {
            return data;
        },

       async getPostById(id:any) {
        let selectedPost = data.find(post => post.id === id);
        return selectedPost;
       }
    }
})

export type PostApi = ReturnType<typeof CreatePostApi>;