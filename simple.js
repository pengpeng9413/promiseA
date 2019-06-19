/**
 * 先来实现一个比较简单的promise
 * 满足要求 （=》promise的状态）
 */
// promise的三种状态 
 const    PENDING='pending'  // 初试状态
 const    FULFILLED='fulfilled'  // 
 const    REJECTED='rejected'

 // 用es的实现方式来实现一遍
 // Promise 是一个构造函数， new Promise 返回一个 promise对象 接收一个excutor执行函数作为参数, excutor有两个函数类型形参resolve reject
 class ajPromise{
     constructor(fn){  //  这个fn 其实就是excutor执行函数
         // 当前状态
         this.state=PENDING
         // 终值
         this.value=null
         // 拒因
         this.reason=null
         // 成功态回调队列
         this.onfulfilledCallbacks=[]
         // 拒绝态的回调队列
         this.onrejectedCallbacks=[]

         // 成功态回调
         const resolve=value=>{
             // 使用macro-task机制（settimeout）,确保onFulfilled异步执行，且在then方法被调用的
             // 那一轮事件循环之后的新执行栈中执行

             // 一句macro-task 宏任务的执行机制，settimeout会在第二轮循环是被执行，这样就保证了，onfulfilled是异步的，
             // then和 settimeout 在不同的事件循环中，也就保证了异步的要求 
             // 再详细点吧，就是执行到then的时候，去注册回调函数onfulfilled回调函数，放入微任务的事件队列，此时这轮event loop的最后执行的就是then
             // 后续没有任务了，从执行栈弹出，开始第二轮  event loop ，开始执行（微任务的事件队列）settimeout里面的代码
             setTimeout(()=>{
                 if(this.state===PENDING){
                     // pengding 等待态  迁移至 fulfilled (执行态)，确保调用次数不超过一次
                     this.state=FULFILLED
                     // 终值
                     this.value=value
                     
                     this.onfulfilledCallbacks.map(cb=>{
                         this.value=cb(this.value)
                     })
                 }
             })
         }
        // 拒绝态回调
         const reject=reason=>{
             setTimeout(()=>{
                 if(this.state===PENDING){
                     // pending 等待态  迁移至  rejected（被拒绝态）
                     this.state=REJECTED
                     // 拒因
                     this.reason=reason
                     // 
                     this.onrejectedCallbacks.map(cb=>{
                         this.reason=cb(this.reason)
                     })
                 }
             })
         }

         try{
             // 执行promise
             fn(resolve,reject)
         }
         catch(e){
            reject(e)
         }
     }

     then(onFulfilled,onRejected){
        typeof  onFulfilled ==='function' && this.onfulfilledCallbacks.push(onFulfilled)
        typeof  onRejected==='function' && this.onrejectedCallbacks.push(onRejected)
        // 返回this支持then 方法可以被同一个promise调用多次
        return this
     }

 }

 // 就这样，一个简单的promise就完成了
 new ajPromise((resolve,reject)=>{
     setTimeout(() => {
         resolve(2)
     }, 2000);
 })
    .then(res=>{
        console.log(res)
        return res+1
    })
    .then(res=>{
        console.log(res)
    })

//output  

// delay 2s..
//  2 
//  3 

//===========接下来，我们来看看我们的实现是否完全符合promises/A+规范~
npm run test

// GG,测试用例只过了一小部分,大部分飘红~

// OK,接下来,我们来继续了解promises/A+ 进一步的规范要求~

//（未完待续）