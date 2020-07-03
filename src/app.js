App = {
    loading : false,
    contracts : {},
    load_: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask")
        }
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                await ethereum.enable()
                web3.eth.sendTransaction({/* ... */})
            } catch (error) {

            }
        } else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)

            web3.eth.sendTransaction({/* ... */})
        } else {
            console.log('Non-Ethereum browser detected, You should consider try')
        }
    },
    loadAccount: async () => {
        App.account = web3.eth.accounts[0]
        console.log(App.account)
    },
    loadContract: async () => {
        const todoList = await $.getJSON('ToDoList.json')
        App.contracts.ToDoList = TruffleContract(todoList)
        App.contracts.ToDoList.setProvider(App.web3Provider)
        App.todoList = await App.contracts.ToDoList.deployed()
    },
    render: async () => {

        if (App.loading){
            return
        }

        App.set_loading(true)


        // show your address
        const acct = document.getElementById('account')
        const show_acct = document.getElementById("show_address")
        show_acct.classList.replace('d-none', 'd-block')
        acct.innerText = App.account

        // load task list
        await App.renderTasks()


        App.set_loading(false)

    },
    set_loading : (boolean)=>{
        App.loading = boolean
        const loader = document.getElementById('loader')
        const app_ = document.getElementById('app')
        if (boolean){
            loader.classList.replace('d-none', 'd-block')
            app_.classList.replace('d-block', 'd-none')
        }else{
            loader.classList.replace('d-block', 'd-none')
            app_.classList.replace('d-none', 'd-block')
        }
    },
    renderTasks : async () =>{
        const taskCount = await App.todoList.taskCount()
        const new_lists = document.getElementById('new_list')
        const completed_list = document.getElementById('complete_list')
        const complete_title = document.getElementById('complete_title')
        const new_title = document.getElementById('new_title')

        for (let i=1; i <= taskCount; i++){
            let task = await App.todoList.tasks(i)
            console.log(task)
            let task_id = task[0].toNumber()
            let task_content = task[1]
            let task_priority = task[2].toNumber()
            let task_completed = task[3]

            let row_ = document.createElement('div')
            if (task_id % 2 === 0){
                row_.className = 'row p-3 bg-warning mx-2 rounded'
            }else{
                row_.className = 'row p-3 bg-light mx-2 rounded'
            }


            let column_1 = document.createElement('div')
            column_1.className = 'col-12 p-2 mb-1'
            let content_1 = document.createElement('p')
            let title_1 = document.createElement('span')
            title_1.className = 'bg-dark text-white rounded text-center p-2 mr-5'
            title_1.innerText = 'Content'
            content_1.appendChild(title_1)
            content_1.appendChild(document.createTextNode(task_content))
            column_1.appendChild(content_1)

            let column_2 = document.createElement('div')
            column_2.className = 'col-12 p-2 mb-1'
            let content_2 = document.createElement('p')
            let title_2 = document.createElement('span')
            title_2.className = 'bg-dark text-white rounded text-center p-2 mr-5'
            title_2.innerText = 'Priority'
            content_2.appendChild(title_2)
            content_2.appendChild(document.createTextNode(task_priority))
            column_2.appendChild(content_2)

            row_.appendChild(column_1)
            row_.appendChild(column_2)

            if (task_completed){
                completed_list.appendChild(row_)
                if (complete_title.classList.contains('d-none')){
                    complete_title.classList.replace('d-none', 'd-block')
                }
            }else{
                new_lists.appendChild(row_)
                if (new_title.classList.contains('d-none')){
                    new_title.classList.replace('d-none', 'd-block')
                }
            }





        }
    }
}
$(()=>{
    $(window).on('load', ()=>{
        App.load_()
    })

})
