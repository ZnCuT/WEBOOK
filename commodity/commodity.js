document.addEventListener("DOMContentLoaded", () => {
    // 假设后端 API 提供 Excel 数据解析后的 JSON 地址
    const apiUrl = "https://example.com/api/excel-to-json";

    // 从后端获取解析后的 JSON 数据
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("网络响应错误: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.bookDetails) {
                throw new Error("返回数据格式错误");
            }

            // 更新页面内容
            const bookDetails = data.bookDetails; // 假设 JSON 包含 bookDetails 字段
            document.getElementById("book-title").textContent = `书名: ${bookDetails.title}`;
            document.getElementById("seller-name").textContent = bookDetails.sellerName;
            document.getElementById("price").textContent = `¥${bookDetails.price}`;
            document.getElementById("description").textContent = bookDetails.description;
            document.getElementById("book-condition").textContent = bookDetails.condition;
        })
        .catch(error => {
            console.error("获取数据时发生错误:", error);
        });
});
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有的删除按钮
    const removeButtons = document.querySelectorAll('.remove-btn');

    // 遍历所有按钮并为每个按钮添加点击事件
    removeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // 获取当前按钮所在的父元素（即 .box-item）
            const boxItem = button.parentElement;
            // 删除该 .box-item 元素
            boxItem.remove();
        });
    });
});