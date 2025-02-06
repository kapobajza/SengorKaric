import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/web/components/ui/card";
import { Badge } from "@/web/components/ui/badge";
import { HandHeart } from "lucide-react";
import type { PostDto } from "@/toolkit/dto/post.dto";
import { Link } from "react-router";

type Props = {
  post: PostDto;
};
export default function PostCard({post} : Props) {
  return (
    <Link to={ post.slug }><Card className="max-w-sm mx-auto">
      <CardHeader className="bg-blue-100 rounded-t-xl p-4">
        <div className="flex space-x-2 mb-2">
          <Badge variant="secondary">{ post.category }</Badge>
          <Badge variant="secondary">{ post.type }</Badge>
        </div>
        <div className="flex justify-center">
          <HandHeart className="w-12 h-12 text-black" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle>{ post.title }</CardTitle>
        <CardDescription>
         Opis: {post.title} {post.id} //
        </CardDescription>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm justify-end">
        { post.createdAt }
      </CardFooter>
    </Card>
    </Link>
  );
}
