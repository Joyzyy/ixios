import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute('/about')({
    component: () => {
        return <div className="p-2">
            <h3>Welcome to about!</h3>
        </div>
    }
})