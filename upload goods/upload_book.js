// script.js

// 用于上传图片的函数
function uploadImage() {
    document.getElementById("imageInput").click();
}

// 显示上传的图片
function displayImage(event) {
    const leftSidebar = document.querySelector(".left-sidebar");
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            leftSidebar.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" style="max-width:100%; height:auto;">`;
        };
        reader.readAsDataURL(file);
    }
}

// 输入文字的函数
function enterText() {
    const text = prompt("Enter your text:");
    if (text) {
        document.querySelector(".right-sidebar").textContent = text;
    }
}

// 保存内容的函数
function saveContent() {
    const imageSrc = document.querySelector(".left-sidebar img")?.src;
    const textContent = document.querySelector(".right-sidebar").textContent;

    if (imageSrc || textContent) {
        // 模拟保存的操作，可以替换为实际的服务器保存逻辑
        alert("Content saved!\nImage: " + (imageSrc || "No image") + "\nText: " + (textContent || "No text"));
    } else {
        alert("Nothing to save!");
    }
}
