/* 

JavaScript设计模式种，原文如下；
Observe模式要求希望接收到统治者的观察者必须订阅内容改变的事件。
Subscribe/Publish模式使用了一个主题/事件通道，这个通道介于订阅者和发布者之间。
该事件系统允许代码定义应用程序的特定事件，该事件可以传递自定义参数，自定义参数包含订阅者所需要的值。
其目的是避免订阅者和发布者产生依赖关系。

与观察者模式不同的之处在于它允许任何订阅者执行适当的事件处理程序来注册和接受发布者发出的通知。

--------
观察者模式中，目标对象负责维护观察者。发布/订阅模式中发布者不关心订阅者，只负责把消息丢出去就好。
观察者模式中，观察者需要提供一个接口。然后当目标对象发生改变时调用此接口使自身状态和目标状态保持一致。
也就是说所有的观察者都需要一个统一的接口，（比如update方法，统一了更新的方法）
发布/订阅者中，订阅者事件的触发不是依靠这样的一个接口，二十订阅者通过监听的一个特定的消息（这个消息一般包含名称和订阅者所需要的参数）来触发
可以理解为，订阅者监听的不是发布者，而是消息池。只要消息池里有它关心的消息，就会触发。不管这个消息是谁发布的


https://segmentfault.com/a/1190000016960203

 

*/
// class Observe{
//     constructor() {
//         this.handlers = {};
//     }
//     // 绑定注册事件
//     register(type, hander) {
//         // 如果注册的事件类型没有注册过，则直接进行注册
//         if (!this.handlers.hasOwnProperty(type)) {
//             this.handlers[type] = []
//         } 
        
//         this.handlers[type].push(hander)
        
//         return this
//     }
//     // 触发事件
//     emit(...args) {
//         let type = Array.prototype.shift.call(args)
//         if (this.handlers.hasOwnProperty(type)) {
//             // console.log(this.handlers[type])
//             this.handlers[type].forEach(item => {
//                 // console.log(item)
//                 item.apply(item, args)
//             });
//         } else {
//             throw new Error(`${type} event isn't register`)
//         }
//         return this
//     }
// }

// let observe = new Observe();
// observe.register('hello', function(a)  {
//     console.log(a)
// })

// observe.emit('hello',[1,2,4])
// observe.emit('word',2)


// // 观察者模式
// function ObserveList() {
//     this.observeList = [];
// }
// // 观察者中添加一个方法
// ObserveList.prototype.add = function (obj) {  
//     return this.observeList.push(obj);
// }
// // 统计观察者中的数量
// ObserveList.prototype.count = function () {  
//     return this.observeList.length;
// }
// // 获取当前观察者中具体的观察者
// ObserveList.prototype.get = function (index) {  
//     if (index > -1 && index < this.observeList.length) {
//         return this.observeList[index]
//     }
// }
// // 获取在观察者中的索引
// ObserveList.prototype.indexOf = function (obj, startIndex) {  
//     let i = startIndex || 0;
//     while(i < this.observeList.length) {
//         if (this.observeList[i] === obj) {
//             return i
//         }
//         i++
//     }
//     return -1
// }
// // 移除当前的观察者
// ObserveList.prototype.removeAt = function (index) {  
//     this.observeList.splice(index, 1);
// }

// // 观察者的目标， 被观察者
// function Subject() {  
//     this.observes = new ObserveList();
// }
// // 添加一个观察者
// Subject.prototype.addObserve = function (observe) {  
//     this.observes.add(observe)
// }
// //移除一个被观察者中的方法
// Subject.prototype.removeObserve = function (observe) {  
//     this.observes.removeAt(this.observes.indexOf(observe, 0))
// }
// // 如果观察者中的值发生变化，则通知相应的订阅事件的人
// Subject.prototype.notify = function (context) {  
//     let observeCount = this.observes.count();
//     for(let i = 0; i < observeCount; i++) {
//         this.observes.get(i).update(context)
//     }
// }
// // 观察者
// function ObserveGil() {  
//     this.update = function (context) {  
//         console.log('第一个女朋友发现了' + context)
//     }
// }
// function ObserveGil1() {  
//     this.update = function (context) {  
//         console.log('第二个女朋友发现了' + context)
//     }
// }
// function ObserveGil2() {  
//     this.update = function (context) {  
//         console.log('第三个女朋友发现了' + context)
//     }
// }

// // 具体使用
// let mySubject = new Subject();
// mySubject.addObserve(new ObserveGil());
// mySubject.addObserve(new ObserveGil1());
// mySubject.addObserve(new ObserveGil2());
// mySubject.notify('我今天去嫖娼')



// 发布订阅者
let publish = {};
(function (myObject) {  
    // 定义发布的消息队列
    let topics = {};

    // 给每个添加的订阅者增加唯一标识
    let subUid = -1;

    // 发布指定订阅
    myObject.publish = function (topic, args) {  
        if (!topics[topic]) {
            return false
        }
        let subscribers = topics[topic];
        let len = subscribers ? subscribers.length : 0;
        while (len--) {
            subscribers[len].func(topic, args)
        } 
        return this;
    }

    // 向订阅中心添加订阅
    myObject.subscribe = function (topic, func) {
        // 检测发布的消息是否存在，不存在则创建一个存储的空间
        if (!topics[topic]) {
            topics[topic] = []
        }
        // 生成唯一标识
        let token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        })
        return token;
    }

    // 再订阅中取消订阅
    myObject.unSubscribe = function (token) {  
        for (const key in topics) {
            if (topics.hasOwnProperty(key)) {
                const element = topics[key];
                for(let i = 0; i < element.length; i++) {
                    if (element[i].token === token) {
                        topics[key].splice(i, 1)
                        return token
                    }
                }
            }
        }
        return this
    }
})(publish);
publish.subscribe('test', () => {console.log('注册并执行了发布订阅者中的方法')});
publish.publish('test')