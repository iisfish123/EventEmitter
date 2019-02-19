# EventEmitter
node.js的EventEmitter模块的事件模型源码

================================================
### 分析源码

#### 1.外部(function(){})(window)为匿名函数，传入全局的window

#### 2.用var定义局部变量EventEmitter，并且用函数表达式作为构造函数，最后window.EventEmitter = EventEmitter;引到window全局去。
当new EventEmitter()的时候，构造函数的this.events在实例对象上。

#### 3.实际用法是  var e = new EventEmitter();  e.on(evt,callback)或者e.addListener(evt,callback)因为
EventEmitter.prototype.addListener = EventEmitter.prototype.on;所以.off和.removeListener同理

#### 4.this.events用来保存事务，{'eventName1':[{listener:function触发的函数, time:触发的次数}]}

#### 5.on方法，先获取所有的事务，然后在events对象的键值对里面找eventName2对应的value数组，
如果有就返回eventName2的events[evt]。</br>
否则返回一个空的数组，然后新建一个对象var listenerWrapper = {listener:listener,time:time}   并push进去刚刚返回的空数组里面。</br>
最后on方法里面是return this，所以在使用的时候可以是.on().on()的链式操作。</br>

#### 6.trigger方法(重点)</br>
e.emit('click')监听触发click成功。</br>
源码是执行trigger()方法，其内部，真正实现回调函数的执行</br>
一堆for 和if 不解释，就是拿到events对象内部的'click'事件的回调函数，然后listener.listener.apply(this, args || []);</br>
重点分析为什么要apply，如果删除之后会怎么样？</br>
假设.on('click',function(){console.info(this)});</br>
加上apply之后，就是为了让console.info(this)的这个this指向是EventEmitter {events: {…}}</br>
不加的话，按照ES5的语法，函数内部的this永远指向调用这个函数的对象，所以就是{'eventName1':[{listener:function触发的函数, time:触发的次数}]}这个对象(逻辑上不应该是这样的指向)</br>

#### 7.比较es5和es6类
<li>class A{constructor(){this.a=1} }  相当于  function A(){} A.prototype.a = 1    this表示的是实例，this.a的a属性在实例上</li>
<li>class A{b(){}} 相当于  function A(){} var objA =  new A() objA.b = function(){}   b属性方法是定义在A的原型上的</li>
<li>class A{static c = 1}  相当于  function A(){} A.c = 1   c属性是定义在构造函数上的，也就是es6的类上的静态属性</li>
<li>var a = new A()  a.hasOwnProperty(b) 查看b属性是在实例上，还是在原型上。用来检验上面的几点，返回true则属性在实例上，false则在原型上</li>

