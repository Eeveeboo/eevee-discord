import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * TODO: comment axiosRetry
 * Axios retry
 * @template T 
 * @param config 
 * @returns retry 
 */
export function axiosRetry<T = any>(config: AxiosRequestConfig):AxiosPromise<T> {
  return <AxiosPromise<T>>(axios(config).catch(axiosRetryErrorHandler.bind(null, config)));
}
/**
 * TODO: comment axiosRetryErrorHandler
 * Axios retry error handler
 * @template T 
 * @param config 
 * @param e 
 * @returns retry error handler 
 */
function axiosRetryErrorHandler<T>(config: AxiosRequestConfig, e: AxiosError):AxiosPromise<T> {
  return new Promise<AxiosResponse<T>>((done, reject) => {
    if (
      e.response &&
      e.response.status == 429 &&
      e.response.data.retry_after !== undefined
    ) {
      setTimeout(
        done.bind(null, axiosRetry(config)),
        e.response.data.retry_after * 1000
      );
    } else {
      reject(e);
    }
  });
}
