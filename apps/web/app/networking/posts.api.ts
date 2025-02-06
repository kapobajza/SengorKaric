import { createWebApiClient, defineApiConfig } from "./client";
import type { PostDto } from "@/toolkit/dto/post.dto";

export const CreatePostApi = defineApiConfig((request) => {
    const postApi = createWebApiClient({
        routePrefix: "posts",
        request,
        options: {
            withCredentials:false,
        },
    });
    return {
        async getAllPosts()
        {
            // const { data } = await postApi.get<PostDto[]>({
            //     route:"",
            // });
            // return data;

            const data = [
                {
                  "id": "post-1235",
                  "title": "Understanding React Query",
                  "category": "Web Development",
                  "type": "article",
                  "content": [
                    {
                      "type": "heading",
                      "level": 1,
                      "children": [
                        {
                          "text": "Mastering React Query",
                          "type": "text"
                        }
                      ]
                    },
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "text": "React Query simplifies data fetching in React apps.",
                          "type": "text"
                        }
                      ]
                    },
                    {
                      "type": "list",
                      "format": "unordered",
                      "children": [
                        {
                          "type": "list-item",
                          "children": [
                            {
                              "text": "Automatic caching",
                              "type": "text"
                            }
                          ]
                        },
                        {
                          "type": "list-item",
                          "children": [
                            {
                              "text": "Background refetching",
                              "type": "text"
                            }
                          ]
                        },
                        {
                          "type": "list-item",
                          "children": [
                            {
                              "text": "Optimistic updates",
                              "type": "text"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "paragraph",
                      "children": [
                        {
                          "text": "Using React Query can improve performance ",
                          "type": "text"
                        },
                        {
                          "text": "significantly",
                          "type": "text",
                          "bold": true
                        }
                      ]
                    }
                  ],
                  "slug": "understanding-react-query",
                  "createdAt": "2025-02-06T10:00:00.000Z",
                  "updatedAt": "2025-02-06T12:00:00.000Z"
                },
                {
                    "id": "post-123",
                    "title": "Understanding React Query",
                    "category": "Web Development",
                    "type": "article",
                    "content": [
                      {
                        "type": "heading",
                        "level": 1,
                        "children": [
                          {
                            "text": "Mastering React Query",
                            "type": "text"
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "children": [
                          {
                            "text": "React Query simplifies data fetching in React apps.",
                            "type": "text"
                          }
                        ]
                      },
                      {
                        "type": "list",
                        "format": "unordered",
                        "children": [
                          {
                            "type": "list-item",
                            "children": [
                              {
                                "text": "Automatic caching",
                                "type": "text"
                              }
                            ]
                          },
                          {
                            "type": "list-item",
                            "children": [
                              {
                                "text": "Background refetching",
                                "type": "text"
                              }
                            ]
                          },
                          {
                            "type": "list-item",
                            "children": [
                              {
                                "text": "Optimistic updates",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "children": [
                          {
                            "text": "Using React Query can improve performance ",
                            "type": "text"
                          },
                          {
                            "text": "significantly",
                            "type": "text",
                            "bold": true
                          }
                        ]
                      }
                    ],
                    "slug": "understanding-react-query",
                    "createdAt": "2025-02-06T10:00:00.000Z",
                    "updatedAt": "2025-02-06T12:00:00.000Z"
                  },
                {
                    "id": "post-1234",
                    "title": "Understanding React Query",
                    "category": "Web Development",
                    "type": "article",
                    "content": [
                      {
                        "type": "heading",
                        "level": 1,
                        "children": [
                          {
                            "text": "Mastering React Query",
                            "type": "text"
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "children": [
                          {
                            "text": "React Query simplifies data fetching in React apps.",
                            "type": "text"
                          }
                        ]
                      },
                      {
                        "type": "list",
                        "format": "unordered",
                        "children": [
                          {
                            "type": "list-item",
                            "children": [
                              {
                                "text": "Automatic caching",
                                "type": "text"
                              }
                            ]
                          },
                          {
                            "type": "list-item",
                            "children": [
                              {
                                "text": "Background refetching",
                                "type": "text"
                              }
                            ]
                          },
                          {
                            "type": "list-item",
                            "children": [
                              {
                                "text": "Optimistic updates",
                                "type": "text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "paragraph",
                        "children": [
                          {
                            "text": "Using React Query can improve performance ",
                            "type": "text"
                          },
                          {
                            "text": "significantly",
                            "type": "text",
                            "bold": true
                          }
                        ]
                      }
                    ],
                    "slug": "understanding-react-query",
                    "createdAt": "2025-02-06T10:00:00.000Z",
                    "updatedAt": "2025-02-06T12:00:00.000Z"
                  }
              ]
              return data;
        },

        async getById(id: string) 
        {
            const { data } = await postApi.get<PostDto>({
                route: id,
            });
            return data;
        },
        async create(postData: Omit<PostDto, "id">) 
        {
            const { data } = await postApi.post<PostDto>({
                route: "",
                body: postData,
            });
            return data;
        },
        async delete(id: string)
        {
            await postApi.delete<PostDto>({
                route:id,
            });
        }
    }
})

export type PostApi = ReturnType<typeof CreatePostApi>;