import { createFileRoute } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";

import { SignUpForm } from "@/components/sign-up-form";
import { useAuth } from "@/auth/auth";
import { LoadingAnimation } from "@/components/loading";

export const Route = createFileRoute("/_logged/register")({
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
                <div className="bg-opacity-70 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                    <div className="flex w-full max-w-sm flex-col gap-6">
                        <a
                            href="/"
                            className="flex items-center gap-2 self-center font-medium"
                        >
                            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                            Weather Component
                        </a>
                        <SignUpForm className="text-[#25252b]" />
                    </div>
                </div>
            )}
        </>
    );
}
