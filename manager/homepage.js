document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('items-container');

    // 1. 页面加载时获取数据
    fetch('/items')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((item) => {
                const boxItem = document.createElement('div');
                boxItem.classList.add('box-item');
                boxItem.dataset.id = item.id; // 保存 item 的 ID
                boxItem.innerHTML = `
                    <p>${item.content}</p>
                    <button class="remove-btn">Remove</button>
                `;
                container.appendChild(boxItem);

                // 绑定删除事件
                boxItem.querySelector('.remove-btn').addEventListener('click', function () {
                    const itemId = boxItem.dataset.id;
                    fetch(`/items/${itemId}`, { method: 'DELETE' })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Failed to delete item');
                            }
                            return response.json();
                        })
                        .then((data) => {
                            console.log(data.message);
                            boxItem.remove();
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                });
            });
        });

    // 如果已经有删除逻辑，可以重复利用：
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const boxItem = button.closest('.box-item');
            const itemId = boxItem.dataset.id;

            fetch(`/items/${itemId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to delete item');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data.message);
                    boxItem.remove();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    });
});
