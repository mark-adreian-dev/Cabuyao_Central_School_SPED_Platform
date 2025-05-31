import { type Icon } from "@tabler/icons-react";

export interface SidebarType {
    user: User;
    navMain: Nav[];
    navClouds: NavCloud[];
    navSecondary: Nav[];
    documents: Document[];
}

export interface Document {
    name: string;
    url: string;
    icon: Icon;
}

export interface NavCloud {
    title: string;
    icon: Icon;
    isActive?: boolean;
    url: string;
    items: Item[];
}

export interface Item {
    title: string;
    url: string;
}

export interface Nav {
    title: string;
    url: string;
    icon: Icon;
}

export interface User {
    name: string;
    email: string;
    avatar: string;
}
