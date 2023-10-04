#!/bin/bash

# 安装Git
install_git() {
    echo "Installing Git..."
    apt-get update
    apt-get install -y git
}

# 安装.NET 6 SDK
install_dotnet_sdk() {
    echo "Installing .NET 6 SDK..."
    wget https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
    dpkg -i packages-microsoft-prod.deb
    apt-get update
    apt-get install -y apt-transport-https
    apt-get install -y dotnet-sdk-6.0
}

# 安装 Nginx
install_nginx() {
    echo "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
}

# 设置下载目录和GitHub仓库url
github_url="https://github.com/winter2048/syzero-pi-car.git"

# 检查git是否安装
git --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    install_git
fi

# 克隆GitHub仓库
git clone "$github_url"

# 检查克隆是否成功
if [ $? -eq 0 ]; then
    echo "Download complete."
else
    echo "Download failed. Please check the URL and try again."
fi

dotnet --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    install_dotnet_sdk
fi

# 检查安装是否成功
dotnet --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo ".NET 6 SDK installed successfully."
else
    echo "Failed to install .NET 6 SDK."
fi

# 检查是否已安装 Nginx
nginx -v > /dev/null 2>&1
if [ $? -ne 0 ]; then
    install_nginx
fi

# 检查安装是否成功
nginx -v > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Nginx installed successfully."
else
    echo "Failed to install Nginx."
fi