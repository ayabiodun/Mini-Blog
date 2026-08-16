import { blogData, createBlog } from "./blog";
import { getBlogs, saveBlogs } from "./storage.js";
import type { BlogInfo } from "./types.js";

const searchInput = document.querySelector("#search-input") as HTMLInputElement;
const blogContainer = document.querySelector("#blog-container") as HTMLElement;
const createForm = document.querySelector(".create-form") as HTMLFormElement;
const createBtn = document.querySelector("#create-btn") as HTMLButtonElement;
const cancelBtn = document.querySelector("#cancel-btn") as HTMLButtonElement;

window.addEventListener("pageshow", () => {
  const updatedBlogs = getBlogs();

  blogData.length = 0;
  blogData.push(...updatedBlogs);

  displayBlog();
});

if(createForm){
  createForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(createForm);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("image") as string;

    createBlog(title, content, description, imageUrl);
    saveBlogs(blogData);
    displayBlog();
    createForm.reset();
  });
}

blogContainer.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  const clickedChild = target.closest(".blog-card");

  if (!clickedChild) return;

  const clickedBlog = blogData.find((blog) => blog.id === clickedChild.id);

  if (!clickedBlog) return;

  window.location.href = `/blog.html?id=${clickedBlog.id}`;
});

createBtn.addEventListener("click", () => {
  createForm.style.display = "block";
  cancelBtn.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
  createForm.style.display = "none";
  cancelBtn.style.display = "none";
  createForm.reset();
});

searchInput.addEventListener("input", () => {
  const searchData = searchInput.value.toLocaleLowerCase();
  const searchBlog = blogData.filter((blog) => {
    return (
      blog.content.toLocaleLowerCase().includes(searchData) ||
      blog.description.toLocaleLowerCase().includes(searchData) ||
      blog.title.toLocaleLowerCase().includes(searchData)
    );
  });

  displayBlog(searchBlog);
});

function displayBlog(blogs: BlogInfo[] = blogData) {
  blogContainer.innerHTML = "";
  if (blogs.length !== 0) {
    blogs.forEach((blog) => {
      const div = document.createElement("div");
      div.id = blog.id;
      div.classList.add("blog-card");

      div.innerHTML = `
                <img src='${blog.image}' alt='${blog.description}'>
                <h2>${blog.title}</h2>
                <p>${blog.description}</p>
                <span>${formatDate(blog.date)}</span><br>
                <span>${blog.views}views</span>
            `;

      blogContainer.appendChild(div);
    });
  } else {
    const div = document.createElement("div");
    div.innerText = "No Blogs found";
    blogContainer.append(div);
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString();
}
