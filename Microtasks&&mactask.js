/**
 * 这里主要介绍 事件循环（js的执行机制）  event loop中 宏任务和微任务在事件循环中扮演的位置以及何时调用
 * mactask简称tasks  宏任务：主代码块、setTimeout、setInterval等（可以看到，事件队列中的每一个事件都是一个 macrotask，现在称之为宏任务队列）
 * microtask：微任务： Promise、process.nextTick等
 * 其实看了很多关于这个事件循环的文章，我觉得很多文章都没有讲清楚怎么才算一个循环，
 * 这就导致了很多人看的云里雾里，纠结于概念的理解和不断循环的事件，最后自己都搞不清楚
 * 执行的规则到底是怎样的，怎样才算一个循环
 * 鉴于此，我们看一段非常经典的例子
 */
const p = Promise.resolve("hello");

p.then(function(params) {
  console.log(params);
});

setTimeout(function() {
  console.log(11);
}, 1000);

Promise.resolve().then(function(params) {
  // Promise.resolve() 这里得到一个promise对象
  console.log(22);
});
console.log(33);

// 先自己来判断一下
33
hello
22
11
/**
 * 1.首先我们需要再次强调一个概念：代码块属于宏任务；不用管宏任务和微任务的执行顺序，
 *   这样比较本身就没有意思，我们搞清楚整个流程是怎么执行，怎样算一个循环对你的理解才大有裨益
 * 2.首先肯定执行同步任务 打印出 11
 * 3.然后就有了promise和settimeout的执行问题了
 * 4.其实我们在执行宏任务（这段代码）的时候，我们会将注册settimeout的回调函数和promise的回调函数（可能会有嵌套，还是一样的放入队列中）
 *      分别放入 宏任务队列和微任务队列，两个不同的Event Queue（队列）中
 *      settimeout属于宏任务，promise属于微任务
 * 5.执行到同步任务的时候，其实有两个队列了，一个是settimeout 的宏任务队列，一个promise的微任务队列（这里含嵌套）
 * 6.同步任务执行完之后，检查微任务队列是否为空，如果不为空的话，将微任务队列放入到执行栈中去执行
 * 7.微任务队列为空了，此时这一轮循环结束，注意这一轮的事件循环结束了
 * 8.然后检查宏任务队列是否空，如果不为空的话，将该队列压入执行栈中执行，此时第二轮事件循环开始
 */


 // 我们再来看一下一个更复杂的例子
 Promise.resolve().then(()=>{
    console.log('Promise1')  
    setTimeout(()=>{
      console.log('setTimeout2')
    },0)
  })
  
  setTimeout(()=>{
    console.log('setTimeout1')
    Promise.resolve().then(()=>{
      console.log('Promise2')    
    })
  },0)

  /**
   * 这回是嵌套，大家可以看看，最后输出结果是Promise1，setTimeout1，Promise2，setTimeout2

    一开始执行栈的同步任务执行完毕，会去 microtasks queues 找
    清空 microtasks queues ，输出Promise1，同时会生成一个异步任务 setTimeout1
    去宏任务队列查看此时队列是 setTimeout1 在 setTimeout2 之前，因为setTimeout1执行栈一开始的时候就开始异步执行,所以输出 setTimeout1
    在执行setTimeout1时会生成Promise2的一个 microtasks ，放入 microtasks queues 中，接着又是一个循环，去清空 microtasks queues ，输出 Promise2
    清空完 microtasks queues ，就又会去宏任务队列取一个，这回取的是 setTimeout2
   */
  // 这个例子的参考链接：https://juejin.im/post/5b498d245188251b193d4059
  

  
