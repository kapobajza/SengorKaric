import { useQuery } from "@tanstack/react-query";
import { defineQueryOptions } from "./util";

const postsQueryPrefix = "posts";

export const postQueryKey = {
    id: [postsQueryPrefix, "id"],
} as const;

export const postQueryOptions = defineQueryOptions({
    queryKey: postQueryKey.id,
    queryFn({ api }) {
        return api.postApi.getAllPosts();
    },
});

export function usePostQuery() {
    return useQuery(postQueryOptions);
}

export function usePostQueryCached() {
    return useQuery({
        ...postQueryOptions,
        staleTime: Infinity,
    });
}