import type { BlogInfo } from "./types";

export function getBlogs(): BlogInfo[] {
    const storedBlogs = localStorage.getItem('blogs');

    if(!storedBlogs) return [];

    const gottenBlogs: BlogInfo[] = JSON.parse(storedBlogs);
    const blogsWithDates = gottenBlogs.map(blog => {
        return {
            ...blog,
            date: new Date(blog.date)
        };
    });

    return blogsWithDates;
}

export function saveBlogs(blogs: BlogInfo[]){
    const blogJson = JSON.stringify(blogs);
    localStorage.setItem('blogs', blogJson)
}