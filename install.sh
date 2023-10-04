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

# 设置 GitHub 仓库名称和文件名
repo="winter2048/syzero-pi-car"
file="syzero.pi.car.zip"

# 获取最新版本的下载链接
url=$(curl -s "https://api.github.com/repos/$repo/releases/latest" | grep "browser_download_url.*$file" | cut -d : -f 2,3 | tr -d '\" ')

# 设置下载目录
download_dir="."

# 下载文件
wget -P "$download_dir" "$url"

# 检查下载是否成功
if [ $? -eq 0 ]; then
    echo "Download complete."
else
    echo "Download failed. Please check the GitHub repo and file name."
fi

# 解压缩 zip 文件
unzip "$download_dir/$file" -d "$download_dir"

# 检查解压缩是否成功
if [ $? -eq 0 ]; then
    echo "Unzip complete."
    rm "$download_dir/$file"
else
    echo "Unzip failed. Please check the downloaded file and try again."
    exit 1
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

client_dir=$(realpath "./PiCar/Client")
# 2. 创建一个新的配置文件片段
echo "server {
    listen 8080;
    root $client_dir;
    
    location / {
            try_files \$uri \$uri/ @router;
            index  index.html index.htm;
    }
    
    location @router {
            rewrite ^.*$ /index.html last;
    }
}" > /etc/nginx/conf.d/syzeropicar.conf

# 3. 检查 NGINX 配置是否有语法错误
nginx -t

# 4. 如果没有错误，则重新加载 NGINX 配置
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "Static directory successfully added to NGINX."
else
    echo "Failed to add static directory. Please check the NGINX configuration."
fi

# 2. 创建Service
service_dir=$(realpath "./PiCar/Service")
echo "[Unit]
Description=syzero-picar

[Service]
WorkingDirectory=$service_dir
ExecStart=dotnet SyZero.PiCar.Service.dll
Restart=always
# Restart service after 10 seconds if the dotnet service crashes:
RestartSec=10
SyslogIdentifier=picar
User=root
Environment=ASPNETCORE_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/syzero-picar.service

systemctl enable syzero-picar

systemctl start syzero-picar
systemctl restart syzero-picar
systemctl status syzero-picar