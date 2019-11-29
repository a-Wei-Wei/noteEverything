console.log('aaaa');

process.nextTick(() => {
    console.log("nextTick_1");
    process.nextTick(() => {
        console.log("nextTick_2")
        process.nextTick(() => {
            console.log("nextTick_3")
        });
        setTimeout(() => {
            console.log("setTimeout_2")
        }, 0);
    });
});

Promise.resolve().then(() => {
    console.log("promise_1");
    Promise.resolve().then(() => {
        console.log("Promise_1_1")
    })
});

setTimeout(() => {
    console.log("setTimeout_1");
}, 0)


console.log("ffff");

/**
 * 结果为：
 *aaaa
 *ffff
 *nextTick_1
 *nextTick_2
 *nextTick_3
 *promise_1
 *Promise_1_1
 *setTimeout_1
 *setTimeout_2
 * 
 * 分析如下：
 * 
 * 首先 执行 console， 因此
 * 
 * 首先打印* aaaa
 * 
 * process.nextTick 在执行栈（主线程）尾部插入 nextTick_1 
 * 
 * 然后继续向下运行 注册Promise——1到 Microtask
 * 
 * 继续向下运行 注册 setTimeout_1 
 * 
 * 打印 ffff
 * 
 * 主进程运行完后，执行第一个 nextTick：打印nextTick——1，并注册 nextTick——2
 * 
 * 执行 打印 nextTick_2， 注册nextTick_3 和 setTimeout-2 此时 Macrotask 中：顺序为 setTimeout_1  setTimeout_2
 * 
 * 执行 打印 nextTick_3
 * 
 * 先执行Microtask: Promise_1, 并注册 Promise_2
 * 
 * 再执行 Promise_2
 * 
 * 执行 setTimeOut_1 
 * 
 * 再 执行 setTimeout_2
 * 
 * 注意此时 设置 setTimeout_1 为延迟1秒，那么就先打印setTimeout_2 再打印setTimeout_1 
 * 
 * 
 * 
 * 
 * 知识点如下：
 * 首先是JS是 只有一个主线程，所有的所有的同步任务是会形成一个执行栈，所有异步任务将进入事件队列，只有等待同步任务全部执行完毕，才会执行异步任务
 * 异步任务为两种：Microtask 和 Macrotask
 * Macrotask: setTimeout、setInterval、setImmediate、I/O、render function
 * Microtask：process.nextTick、Promise、MutationObserver
 * 
 * js引擎在 运行中 每次执行完 执行栈之后，总会先去检查Microtask队列，等待完成之后，再去检查Macrotask
 * 
 * Macrotask 是在每次的event loop中只会提取一个，并执行
 * 而 Microtask 会一次运行完，直到清空
 *
 * 如果 在 Microtask 运行时 如果有=又推一个Microtask， 那么主线程将继续执行，直到Microtask完成为止
 * 
 * process.nextTick 总会插在执行栈尾部，也就是在所有的异步任务前执行
 * 
 * 
 * 
*/