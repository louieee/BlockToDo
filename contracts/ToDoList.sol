pragma solidity ^0.5.0;

contract ToDoList{
//    variable to hold total number of tasks
    uint public taskCount = 0;

//    model and its attributes
    struct Task{
        uint id;
        string content;
        uint priority;
        bool completed;
    }

//    actual database to hold the model created above
    mapping(uint => Task) public tasks;


//    this function is an intializer for the smart contract
    constructor() public{
        createTask('This is My First Task.', 3);
    }

    function createTask(string memory _content,uint _priority) public{
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, _priority, false);
    }

    function updateTask(uint  id, string memory _content, uint _priority, bool completed) public{
        if (id == 0){
            id = tasks[id].id;
        }
        if (_priority > 5 ){
            _priority = 5;
        }

        if (_priority < 0){
            _priority = 0;
        }
        tasks[id] = Task(id, _content, _priority, completed);
    }



}


