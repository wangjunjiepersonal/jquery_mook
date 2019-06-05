
/*
 * 开发注意点
 * localStorage只能存储字符串类型 所有的对象数组在通过localStorage.setItem 存储时都要通过JSON进行转移 当然getItem()也一样
 * es6的箭头函数不要乱用 否则会获取到执行环境上下作用域的$(this) 就是window下的this
 * */ 


$(function(){
	
	let $inputOne = $('.add_task')
	let $btn = $('.btn')
	let $task_detail = $('.task_detail')
	let $task_mask = $('.task_detail_mask')
	
	let task_list = []
	
	init()
	$btn.on('click',(e) => {
		e.preventDefault()
		let new_task = {}
		new_task.content = $(this).find('input[name=content]').val()
		if (!new_task.content) {return}
		if (add_task(new_task)) {
			render()
			$(this).find('input[name=content]').val('')
		}
	})
	
	$task_mask.on('click',(e) => {
		$task_mask.css('display','none')
		$task_detail.css('display','none')
	})
	
	

	function init(){
//		task_list = JSON.parse(localStorage.getItem("task_list") || '[]')
		task_list = JSON.parse(localStorage.getItem("task_list")) || []
		if(task_list.length){
			render()
		}
		
	}
	
	function add_task(msg){
		task_list.push(msg)
		localStorage.setItem('task_list',JSON.stringify(task_list))
		return true
	}
	
	function render(){
		refs()
		let $detele = $('.detele')
		let $detail = $('.detail')
		let $checks = $('.checks')
		let $task_content = $('.task_content')
		let $task_item = $('.task_item')
		
		$detail.on('click',function(){
			let info = $(this).parent().data('index')
			$task_mask.css('display','block')
			$task_detail.css('display','block')
			localStorage.setItem('task_list',JSON.stringify(task_list))
			render_defail(task_list,info)
		})
		
		$detele.on('click',function(){
			let info = $(this).parent().data('index')
			confirm('确认删除') ? task_list.splice(info-1,1) : null
			localStorage.setItem('task_list',JSON.stringify(task_list))
			window.location.reload()
		})
		
		$checks.on('click',function(){
			let ischeck = $(this).is(':checked')
			console.log(ischeck)
			let index = $(this).parent().parent().data('index')
			task_list = JSON.parse(localStorage.getItem("task_list"))
			if (!task_list[index-1].ischeck) {
				task_list[index-1] = $.extend({},task_list[index-1],{ischeck:ischeck})
				console.log(task_list[index-1])
				inits()	
			} else {
				task_list[index-1] = $.extend({},task_list[index-1],{ischeck:ischeck})
				console.log(task_list[index-1])
				inits()
			}
		})
		
		function inits(){
			
			task_list.forEach(function (item){
				if (item.ischeck) {
					console.log(item)
					$task_item.eq(item.content-1).css('background','#F08080')
				}else{
					$task_item.eq(item.content-1).css('background','#FFF')
				}
			})
			localStorage.setItem('task_list',JSON.stringify(task_list))
		}
		
		inits()
	}
	
	function refs(){
		let list = $('.task_list')
		list.html('')
		for(var i=0;i<task_list.length;i++){
			let task = render_temp(task_list[i],i+1)
			list.append(task)
		}
	}
	
	function render_temp(data,index){
		if (!data || !index) {
			return
		}
		let task_temp = `<div class="task_item" data-index="${index}">
			 <span><input class="checks" ${data.ischeck?'checked':''} type="checkbox" /></span>
			 <span class="task_content">${data.content}</span>
			 <span class="detele">删除</span>
			 <span class="detail">详情</span>
		</div>`
		return $(task_temp)
	}
	
	function render_defail(task_list,index){
		
		if (!index) {
			return
		}
		let item = task_list[index-1]
		
		let tmp = `<form><div class="content">${item.content}</div>
				<div class="desc">
					<textarea value="${item.desc}">${item.desc || ''}</textarea>
				</div>
				<div class="remind">
					<input type="date" placeholder="今天要做的事情" value="${item.detes}" />
					<button type="submit">提交</button>
				</div></form>`
		$task_detail.html(null)
		$task_detail.html(tmp)
		$form = $task_detail.find('form')
		$form.on('submit',function(e){
			e.preventDefault()
			let data = {}
			data.content = $(this).find('.content').html()
			data.desc = $(this).find('textarea').val()
			data.detes = $(this).find('[type=date]').val()
			task_list[index-1] = data
			localStorage.setItem('task_list',JSON.stringify(task_list))
			$task_mask.css('display','none')
			$task_detail.css('display','none')
		})
	}
})