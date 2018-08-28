//存取localStorage中的数据
var store={
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key))||[];
	}
}

//取出所有的值
var list = store.fetch("miaov-new-class");
//过滤有三种情况   all finished unfinished
var filter = {
	all: function(list) {
		return list;
	},
	finished: function(list) {
		return list.filter(function(item) {
			return item.isChecked;
		})
	},
	unfinished: function(list) {
		return list.filter(function(item) {
			return !item.isChecked;
		})
	}
}
var vm=new Vue({
	el:".main",
	data:{
		list:list,
		todo:"",
		edtorTodos:'',  //记录正在编辑的数据
		beforeTitle:'',  //记录正在编辑的数据的title
		visibility:"all" //通过这个属性值的变化对数据进行筛选
	},
	watch:{
		list:{    //监控list这个属性，当这个属性对应的值发生变化就会执行函数,深度监控
			handler:function(){
				store.save("miaov-new-class",this.list);
			},
			deep:true
		}
	},
	computed:{
		noCheckedLength:function(){
			return this.list.filter(function(item){
						return !item.isChecked
					}).length
		},
		filteredList:function(){
			//返回过滤后的数据，如果没有就返回所有数据
			return filter[this.visibility]?filter[this.visibility](list):list;
		}
	},
	methods:{
		addTodo(){  //添加任务
			//向list中添加一项任务
			this.list.push({
				title:this.todo,
				isChecked:false
			});
			this.todo='';
		},
		deleteTodo(todo){  //删除任务
			var index = this.list.indexOf(todo);
			this.list.splice(index,1);
		},
		edtorTodo(todo){   //编辑任务
			this.beforeTitle=todo.title;
			this.edtorTodos=todo;
		},
		edtorTodoed(todo){   //编辑任务成功
			this.edtorTodos='';
		},
		cancelTodo(todo){    //取消编辑任务
			todo.title=this.beforeTitle;
			this.beforeTitle='';
			this.edtorTodos='';
		}
	},
	directives:{
		"focus":{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
});

function watchHashChange(){
	var hash=window.location.hash.slice(1);
	vm.visibility=hash;
}
watchHashChange();
window.addEventListener("hashchange",watchHashChange);

$('a').click(function(){
	$('a').attr('class','');
	$(this).attr('class','active');
})
