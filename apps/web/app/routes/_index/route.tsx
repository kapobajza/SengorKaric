import { Link } from "react-router";

import { Button } from "@/web/components/ui/button";

export default function Index() {
  return (
    <div>
      <Button asChild>
        <Link to="/admin">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
