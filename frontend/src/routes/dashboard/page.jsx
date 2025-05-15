import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";

import { ArrowUpRightIcon, CopyCheckIcon, CopyIcon, LoaderCircleIcon, PlusCircleIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";

import FinoxaLogo from "@/assets/Finoxa-icon.svg";

import useAuthStore from "@/stores/auth-store";
import useUserStore from "@/stores/user-store";

import { getCookie } from "@/utils/get-cookie";

const Dashboard = () => {
    const navigate = useNavigate();
    const [isCopying, setIsCopying] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const { logout } = useAuthStore();
    const { getUser, generateAPIKey, deleteAPIKey, data } = useUserStore();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const handleGetUser = () => {
        const token = getCookie("token");
        getUser(token);
    };

    const handleGenerateAPIKey = () => {
        const token = getCookie("token");
        generateAPIKey(token);
    };

    const handleDeleteAPIKey = () => {
        const token = getCookie("token");
        deleteAPIKey(token);
    };

    const handleCopyKey = (apiKey) => {
        setIsCopying(true);
        navigator.clipboard.writeText(apiKey);
        setTimeout(() => {
            setIsCopying(false);
        }, 1000);
    };

    useEffect(() => {
        handleGetUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen">
            <header className="container">
                <div className="flex justify-between py-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={FinoxaLogo}
                            alt="Finoxa Logo"
                            className="h-6 w-auto"
                        />
                        <p className="text-lg font-medium">Finoxa API</p>
                    </div>
                    <div>
                        <Button
                            asChild
                            variant="link"
                            className="cursor-pointer"
                        >
                            <a
                                href="https://finoxa-api.apidog.io/"
                                target="_blank"
                            >
                                Docs
                                <ArrowUpRightIcon />
                            </a>
                        </Button>
                        <Button
                            className="cursor-pointer"
                            size="sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container pt-16">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">API Keys</h1>
                        <p className="text-muted-foreground">Manage your API keys to authenticate with our services.</p>
                    </div>
                    <Button
                        className="cursor-pointer"
                        disabled={data?.apiKey}
                        onClick={handleGenerateAPIKey}
                    >
                        <PlusCircleIcon />
                        New Key
                    </Button>
                </div>
                <div className="mt-10">
                    <div className="border rounded-md p-4 flex flex-col gap-4">
                        <div>
                            <p className="font-medium">Key</p>
                        </div>
                        {data?.apiKey ? (
                            <div className="flex items-center justify-between">
                                <p className="text-muted-foreground">
                                    {data.apiKey.slice(0, 25)}
                                    ...
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="cursor-pointer"
                                        onClick={() => handleCopyKey(data.apiKey)}
                                        disabled={isCopying}
                                    >
                                        {!isCopying ? <CopyIcon /> : <CopyCheckIcon />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="group cursor-pointer"
                                        onClick={() => {
                                            setIsGenerating(true);
                                            handleGenerateAPIKey();
                                            setTimeout(() => {
                                                setIsGenerating(false);
                                            }, 1000);
                                        }}
                                        disabled={isGenerating}
                                    >
                                        <RefreshCwIcon className="group-disabled:animate-spin" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="cursor-pointer"
                                        onClick={handleDeleteAPIKey}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p>You have not generated any API keys yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
