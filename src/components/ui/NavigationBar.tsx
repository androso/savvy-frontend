import { Book, Clipboard, User } from "lucide-react";
import { Button } from "./button";
import { NavLink } from "react-router-dom";
import { useUser } from "@/lib/useUser";

export default function NavigationBar() {
    const { user, logout } = useUser(); 

    return (
        
        user ? (
            <nav className="absolute bottom-0 left-0 right-0 bg-background border-t border-border py-4">
                <div className="flex justify-around max-w-2xl mx-auto">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `hover:text-foreground ${isActive ? "" : "text-muted-foreground"}`
                        }
                    >
                        <Button variant="ghost" size="icon">
                            <User className="h-6 w-6" />
                        </Button>
                    </NavLink>
                    <NavLink
                        to="/review"
                        className={({ isActive }) =>
                            `hover:text-foreground ${isActive ? "" : "text-muted-foreground"}`
                        }
                    >
                        <Button variant="ghost" size="icon">
                            <Clipboard className="h-6 w-6" />
                        </Button>
                    </NavLink>
                    <NavLink
                        to="/notes"
                        className={({ isActive }) =>
                            `hover:text-foreground ${isActive ? "" : "text-muted-foreground"}`
                        }
                    >
                        <Button variant="ghost" size="icon">
                            <Book className="h-6 w-6" />
                        </Button>
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `hover:text-foreground ${isActive ? "" : "text-muted-foreground"}`
                        }
                        onClick={logout} 
                    >
                        <Button variant="ghost" size="icon">
                            <span className="h-6 w-6">Log Out</span>
                        </Button>
                    </NavLink>
                </div>
            </nav>
        ) : null 
    );
}
