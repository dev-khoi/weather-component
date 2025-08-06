import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "@/components/functionalUi/LoginForm";
import { useAuth } from "@/auth/auth";
import { LoadingAnimation } from "@/components/ui/loading";

export const Route = createFileRoute("/_logged/login")({
    component: RouteComponent,
});

function RouteComponent() {
    const context = useAuth();
    const { isLoading } = context;

    return (
        <>
            {isLoading ? (
                <LoadingAnimation />
            ) : (
                <>
                    <div className=" bg-opacity-70 flex min-h-svh flex-col items-center justify-center gap-6 p-2 md:p-10">
                        <div className="flex w-full max-w-sm flex-col gap-6">
                            <a
                                href="/"
                                className="flex items-center gap-2 hover:text-(--header-text) self-center font-medium"
                            >
                                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                                    <img className="size-4" src="/logo.svg" />
                                </div>
                                Weather Component
                            </a>
                            <LoginForm className="text-[#25252b]" />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
