import { motion } from "framer-motion";
import { Github, Mail, PersonStanding } from "lucide-react";
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'ui';
import { itemVariants } from "../animations";

export default function OAuthButtons() {
    const oauthProviders = [
        { icon: Github, name: "GitHub" },
        { icon: Mail, name: "Gmail" },
        { icon: PersonStanding, name: "Discord" },
    ];

    return (
        <motion.div className="grid grid-cols-3 gap-3" variants={itemVariants} custom={6}>
            {oauthProviders.map((provider) => (
                <TooltipProvider key={provider.name}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" className="bg-[#0a0a0a] text-title border-outline hover:bg-[rgb(39,38,39)] hover:text-subtitle transition-all duration-500">
                                <provider.icon className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Continue with {provider.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </motion.div>
    );
}
