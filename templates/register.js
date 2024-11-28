// 注册函数
function register() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    if (!email ||!password) {
        alert('请先完整输入邮箱地址和注册密码');
        return;
    }

    // 构造要发送到后端的数据
    const data = {
        email: email,
        password: password
    };

    // 发送POST请求到后端的 /register 路由
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
  .then(response => response.json())
  .then(result => {
        if (result.success) {
            alert(result.message);
            // 启用验证码输入框和验证按钮
            document.getElementById('verificationCodeInput').disabled = false;
            document.getElementById('verifyButton').disabled = false;
        } else {
            alert(result.message);
        }
    })
  .catch(error => {
        console.error('注册请求出错：', error);
        alert('注册请求出错，请稍后再试');
    });
}

// 验证函数
function verify() {
    const email = document.getElementById('emailInput').value;
    const code = document.getElementById('verificationCodeInput').value;
    if (!email ||!code) {
        alert('请先完整输入邮箱地址和验证码');
        return;
    }

    // 构造要发送到后端的数据
    const data = {
        email: email,
        code: code
    };

    // 发送POST请求到后端的 /verify 路由
    fetch('/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
  .then(response => response.json())
  .then(result => {
        if (result.success) {
            alert(result.message);
            // 这里可以添加后续操作，比如跳转到登录页面等
        } else {
            alert(result.message);
        }
    })
  .catch(error => {
        console.error('验证请求出错：', error);
        alert('验证请求出错，请稍后再试');
    });
}