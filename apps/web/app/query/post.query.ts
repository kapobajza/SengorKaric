import { useQuery } from "@tanstack/react-query";
import { defineQueryOptions } from "./util";

const postsQueryPrefix = "posts";

export const postsQueryKey = {
    home: [postsQueryPrefix, "home"],
} as const;

export const postsQueryOptions = defineQueryOptions({
    queryKey: postsQueryKey.home,
    queryFn({ api }) {
        return api.postApi.getAllPosts();
    },
});

export function usePostsQuery() {
    return useQuery(postsQueryOptions);
}    
 

