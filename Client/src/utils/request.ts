import axios, { AxiosRequestConfig } from 'axios';
import store from "../store";

//基础URL，axios将会自动拼接在url前
//process.env.NODE_ENV 判断是否为开发环境 根据不同环境使用不同的baseURL 方便调试
let baseURL =  store.getState().config.SERVER_URL;

//默认请求超时时间
const timeout = 90000;

//创建axios实例
const service = axios.create({
    timeout,
    baseURL
});

//统一请求拦截 可配置自定义headers 例如 language、token等
service.interceptors.request.use(
    (config) => {
        //配置自定义请求头
        const token = window.localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = token;
        }
        // 租户ID
        config.headers['tenantId'] = '1';
        config.headers["language"] = 'zh-cn';
        return config
    },
    error => {
        console.log(error)
        Promise.reject(error)
    }
)
//axios返回格式
interface axiosTypes<T>{
    data: T;
    status: number;
    statusText: string;
}

//核心处理代码 将返回一个promise 调用then将可获取响应的业务数据
const requestHandler = <T>(method: 'get' | 'post' | 'put' | 'delete', url: string, params: object = {}, config: AxiosRequestConfig = {}): Promise<RequestResult<T>> => {
    let response: Promise<axiosTypes<RequestResult<T>>>;
    switch(method){
        case 'get':
            response = service.get(url, {params: { ...params }, ...config});
            break;
        case 'post':
            response = service.post(url, {...params}, {...config});
            break;
        case 'put':
            response = service.put(url, {...params}, {...config});
            break;
        case 'delete':
            response = service.delete(url, {params: { ...params }, ...config});
            break;
    }

    return new Promise<RequestResult<T>>((resolve, reject) => {
        response.then(res => {
            //业务代码 可根据需求自行处理
            const data = res.data;
            if(data.code !== 1){
                //特定状态码 处理特定的需求
                if(data.code === 401){
                    console.log('登录异常，执行登出...');
                }

                let e = JSON.stringify(data);
                console.log(`请求错误：${e}`)
                //数据请求错误 使用reject将错误返回
                reject(data);
            }else{
                //数据请求正确 使用resolve将结果返回
                resolve(data);
            }

        }).catch(error => {
            let e = JSON.stringify(error);
            console.log(`网络错误：${e}`)
            reject(error);
        })
    })
}

// 使用 request 统一调用，包括封装的get、post、put、delete等方法
export const request = {
    get: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('get', url, params, config),
    post: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('post', url, params, config),
    put: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('put', url, params, config),
    delete: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('delete', url, params, config)
};
