import { blogData, createBlog } from "./blog";
import { getBlogs, saveBlogs } from "./storage.js";
import type { BlogInfo } from "./types.js";

const searchInput = document.querySelector("#search-input") as HTMLInputElement;
const blogContainer = document.querySelector("#blog-container") as HTMLElement;
const createForm = document.querySelector(".create-form") as HTMLFormElement;
const createBtn = document.querySelector("#create-btn") as HTMLButtonElement;
const cancelBtn = document.querySelector("#cancel-btn") as HTMLButtonElement;
const modal = document.querySelector('#blog-modal') as HTMLDivElement;
let blogBeingEdited: BlogInfo | null = null;

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

    if(blogBeingEdited){
      blogBeingEdited.title = title;
      blogBeingEdited.description = description;
      blogBeingEdited.content = content;
      blogBeingEdited.image = imageUrl;

      saveBlogs(blogData);
      displayBlog();
      createForm.reset();
      modal.style.display = "none";
      blogBeingEdited = null;
    }
    else{
      createBlog(title, content, description, imageUrl);
      saveBlogs(blogData);
      displayBlog();
      createForm.reset();
      modal.style.display = "none";
    }
    
  });
}

blogContainer.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  const deleteBtn = target.closest(".delete-btn");
  const editBtn = target.closest('.edit-btn');
  const clickedChild = target.closest(".blog-card");

  if (!clickedChild) return;

  const clickedBlog = blogData.find((blog) => blog.id === clickedChild.id);

  if (!clickedBlog) return;
  blogBeingEdited = clickedBlog;

  if(editBtn){
    const titleInput = createForm.elements.namedItem("title") as HTMLInputElement;
    const descriptionInput = createForm.elements.namedItem("description") as HTMLTextAreaElement;
    const contentInput = createForm.elements.namedItem("content") as HTMLTextAreaElement;
    const imageInput = createForm.elements.namedItem("image") as HTMLInputElement;
    const updateBtn = document.querySelector('.submit-btn') as HTMLButtonElement;

    titleInput.value = clickedBlog.title;
    descriptionInput.value = clickedBlog.description;
    contentInput.value = clickedBlog.content;
    imageInput.value = clickedBlog.image;
    updateBtn.innerText = 'Update';

    modal.style.display = "block";
    return;
  }
  if (deleteBtn) {
    const shouldDelete = confirm("Are you sure you want to delete this blog?");

    if (!shouldDelete) return;

    const index = blogData.indexOf(clickedBlog);
    blogData.splice(index, 1);

    saveBlogs(blogData);
    displayBlog();

    return;
  }

  window.location.href = `/blog.html?id=${clickedBlog.id}`;
});

createBtn.addEventListener("click", () => {
  modal.style.display = 'block';
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = 'none';
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
                <div class="card-content">
                  <h2>${blog.title}</h2>
                  <p>${blog.description}</p>
                </div>
                <div class="card-footer">
                  <span>${formatDate(blog.date)}</span><br>
                  <span>${blog.views} views <i class="fa-solid fa-eye"></i></span>
                </div>
                <div class="interact">
                  <button class="edit-btn">Edit</button>
                  <button class="delete-btn">Delete</button>
                </div>
              `;

      blogContainer.appendChild(div);
    });
  } else {
    const div = document.createElement("div");
    div.classList.add('error')
    div.innerText = "No Blogs found";
    blogContainer.append(div);
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString();
}
