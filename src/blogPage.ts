import { getBlogs, saveBlogs } from "./storage";
import type { BlogInfo } from "./types";

const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");
const blogs = getBlogs();
const blog = blogs.find((blog) => blog.id === blogId);

loadBlog();

const backBtn = document.querySelectorAll("#back-btn") as NodeListOf<HTMLButtonElement>;

backBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    window.history.back();
  })
});

function renderBlog(blog: BlogInfo) {
  const container = document.querySelector("#blog-container") as HTMLElement;
  const formtDate = formatDate(blog.date);
  container.innerHTML = `
        <img src=${blog.image}>
        <div class="title">
          <h1>${blog.title}</h1>
          <p>${blog.description}</p>
        </div>
        <div class="details">
          <span>${formatDate(blog.date)}</span>
          <span> <i class="fa-solid fa-eye"></i> ${blog.views} views</span>
        </div>
        <div class="text">
          <p>${blog.content}</p>
        </div>
    `;
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