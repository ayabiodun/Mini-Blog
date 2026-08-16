import type { BlogInfo } from "./types.js";
import { v4 as uuidv4 } from 'uuid';

export const blogData: BlogInfo[] = [];

export function createBlog(title: string, content: string, description: string, imageUrl: string): BlogInfo{
    const userBlog: BlogInfo = {
        title,
        content,
        description,
        image: imageUrl,
        id: uuidv4(),
        views: Math.floor(Math.random() * 1000000) + 1,
        date: new Date(),
        comments: []
    }

    blogData.push(userBlog);
    return userBlog;
};
