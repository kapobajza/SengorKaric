import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/web/components/ui/card";
import { Badge } from "@/web/components/ui/badge";
import { HandHeart } from "lucide-react";
import type { PostDto } from "@/toolkit/dto/post.dto";

type Props = {
  post: PostDto;
};
export default function PostCard({post} : Props) {
  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader className="bg-blue-200 rounded-t-xl p-4">
        <div className="flex space-x-2 mb-12">
          {post.categories.map((category) =>{
            return (<Badge variant="secondary">
              { category.name }
            </Badge>)
          })} 
        </div>
        <div className="flex justify-center">
          <HandHeart className="w-12 h-12 text-black" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle>{ post.title }</CardTitle>
        <CardDescription>
         {post.content.map((t)=>{
          return (<p>{t.text.slice(0,100)}</p>)
         })}
        </CardDescription>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm justify-end">
        { post.createdAt }
      </CardFooter>
    </Card>
  );
}
