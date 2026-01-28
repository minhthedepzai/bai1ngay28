const API_URL = "https://api.escuelajs.co/api/v1/products";
const table = document.getElementById("productTable");

async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error("Load API lỗi:", err);
  }
}

function getImageUrl(images, categoryImage) {
  try {
    // Kiểm tra images là array hay string
    let imageArray = images;
    
    if (typeof images === "string") {
      // Nếu là JSON string, parse nó
      if (images.startsWith("[")) {
        imageArray = JSON.parse(images);
      } else if (images.startsWith("http")) {
        // Nếu là URL trực tiếp, return luôn
        return images;
      }
    }

    // Nếu là array, lấy phần tử đầu tiên
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      const firstImg = imageArray[0];
      
      // Nếu phần tử là URL
      if (typeof firstImg === "string" && firstImg.startsWith("http")) {
        return firstImg;
      }
      
      // Nếu phần tử là object với property url
      if (typeof firstImg === "object" && firstImg.url) {
        return firstImg.url;
      }
    }
  } catch (e) {
    console.warn("Parse image lỗi:", images, e);
  }

  // 🔁 FALLBACK - sử dụng ảnh category hoặc placeholder
  return categoryImage || "https://via.placeholder.com/40";
}

function renderProducts(products) {
  table.innerHTML = "";

  products.forEach(p => {
    const imageUrl = getImageUrl(p.images, p.category?.image);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="badge">${p.id}</span></td>
      <td class="title">${p.title}</td>
      <td class="slug">${p.slug || "-"}</td>
      <td class="price">$${p.price}</td>
      <td class="desc">${p.description}</td>
      <td class="category">${p.category?.name || "-"}</td>
      <td class="image">
        <img 
          src="${imageUrl}" 
          alt="${p.title}"
          onerror="this.src='https://via.placeholder.com/40'"
        />
      </td>
    `;
    table.appendChild(tr);
  });
}

loadProducts();
