import { getBlogs, saveBlogs } from "./storage";
import type { BlogInfo } from "./types";
console.log("BLOGPAGE.TS IS RUNNING");
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");
const blogs = getBlogs();
const blog = blogs.find((blog) => blog.id === blogId);

loadBlog();

const backBtn = document.querySelector("#back-btn") as HTMLButtonElement;

backBtn.addEventListener("click", () => {
  window.history.back();
});

function renderBlog(blog: BlogInfo) {
  const container = document.querySelector("#blog-container") as HTMLElement;
  const formtDate = formatDate(blog.date);
  container.innerHTML = `
    <img src="${blog.image}">
    <h1>${blog.title}</h1>
    <h3>${blog.description}</h3>
    <p>${blog.content}</p>
    <span>${formtDate}</span><br>
    <span>${blog.views}views</span>
    <p>${blog.comments}</p>`;
}

function loadBlog() {
  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  const blogs = getBlogs();
  const blog = blogs.find((blog) => blog.id === blogId);

  const container = document.querySelector("#blog-container") as HTMLElement;

  if (!blog) {
    container.innerHTML = `
            <h1>Blog not found</h1>
            <p>The blog you're looking for doesn't exist.</p>
        `;

    return;
  }

  blog.views++;
  saveBlogs(blogs);
  renderBlog(blog);
}

function formatDate(date: Date) {
  return date.toLocaleDateString();
}