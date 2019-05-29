export const noop = Function.prototype;

export const request = (method: string, url: string, data: string, responseType?: XMLHttpRequestResponseType, contentType?: string) => {
    return new Promise<XMLHttpRequest>(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', contentType ? contentType : 'application/json');
        xhr.responseType = responseType ? responseType : 'blob';
        xhr.onload = function(ev) {
            if (!!ev.target && ev.target instanceof XMLHttpRequest) {
                resolve(ev.target)
            } else {
                reject(ev)
            }
        };
        xhr.onerror = reject;
        xhr.send(data);
    })
};

export const saveBlob = (blob: Blob, fileName: string): void => {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.dispatchEvent(new MouseEvent('click'));
    a.remove();
};