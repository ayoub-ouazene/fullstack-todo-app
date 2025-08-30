// Selectors

const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');


// Event Listeners

toDoBtn.addEventListener('click', addToDo);//,getTasks
toDoList.addEventListener('click',EditTask);//,getTasks

let tasks ;
document.addEventListener("DOMContentLoaded", async () => {
    await getTasks();});



async function getTasks()
{
    try
    {
        const res = await fetch('http://localhost:3000/api/tasks',
            {
                method:'GET',  
                credentials: "include"
            }
        );

        if(res.ok)
        {
            const data = await res.json();

            if(!data.tasks || data.tasks.length === 0)
            {
                console.log("no tasks for this user");
                return;
            }

            for(let i = 0 ; i < data.tasks.length ;i++)
            {
                 const taskContainer = document.createElement('li');
                 taskContainer.dataset.taskId = data.tasks[i].id;

                 if(data.tasks[i].done == false )
                 {
                      taskContainer.className = 'task-container';
                 }
                 else
                 {
                      taskContainer.className = 'task-container-done';
                 }
             
     
                 const task = document.createElement('div');
                 task.classList.add('task');

                const task_text = document.createElement('p');
                 task_text.textContent = data.tasks[i].description.trim();
                 task_text.classList.add('task-text');

                 const div_btn = document.createElement('div');

                 const done_btn = document.createElement('button');
                 done_btn.classList.add('task-done');

                 const delete_btn = document.createElement('button');
                delete_btn.classList.add('task-delete');

                    toDoList.appendChild(taskContainer);
                    taskContainer.appendChild(task);
                    task.appendChild(task_text);
                     task.appendChild(div_btn);
                     div_btn.appendChild(done_btn);
                     div_btn.appendChild(delete_btn);
            }

            tasks = data.tasks;
        }
        else
        {
            console.log("no tasks found");
        }

    }
    catch(error)
    {
        console.log(error);
    }
}









async function EditTask(event) {

    //deleting task 

    if (event.target.classList.contains('task-delete')) 
    {  
     try
      {  
         id = event.target.closest("li").dataset.taskId;
         console.log(id);
        const res = await fetch(`http://localhost:3000/api/tasks?taskId=${id}`,
            {
                  method:'DELETE',
                    headers: {'Content-Type': 'application/json', },
                    credentials: 'include'
            }
        );

        if(res.ok)
        {
            console.log("task deleted succefully");
        }
        else
        {
            console.log("failed to delete task");
            return;
        }

        const taskItem = event.target.closest('.task-container, .task-container-done');
            if (taskItem) {
                taskItem.remove();
            } else {
                console.error('Error: Could not find parent task container');
            }

     }
     catch(error)
     {
        console.log(error);
     }

    }

   //make task as done  
    else if(event.target.classList.contains('task-done') || event.target.classList.contains('task-done-done'))
    {
        
    try
    {
     
        const container = event.target.closest('.task-container, .task-container-done');
        if (container) {

            const id = event.target.closest("li").dataset.taskId;

            if (container.classList.contains('task-container-done')) {
                // Task is already done, so mark it as not done
               
                const res = await fetch(`http://localhost:3000/api/tasks?taskId=${id}`,
                    {
                         method:'PATCH',
                    headers: {'Content-Type': 'application/json', },
                    credentials: 'include',
                    body: JSON.stringify({
                        "done":false
                    })  
                    }
                );

                if(res.ok)
                {
                    console.log("edit task succefully");
                }
                else
                {
                    console.log("failed to edit task");
                    return;
                }

                container.classList.remove('task-container-done');
                container.classList.add('task-container');
                event.target.classList.remove('task-done-done');
                event.target.classList.add('task-done');
            } 
            
            else {
                // Task is not done, so mark it as done

                const res = await fetch(`http://localhost:3000/api/tasks?taskId=${id}`,
                    {
                         method:'PATCH',
                    headers: {'Content-Type': 'application/json', },
                    credentials: 'include',
                    body: JSON.stringify({
                        "done":true
                    })  
                    }
                );

                if(res.ok)
                {
                    console.log("edit task succefully");
                }
                else
                {
                    console.log("failed to edit task");
                    return;
                }


                container.classList.remove('task-container');
                event.target.classList.remove('task-done');
                container.classList.add('task-container-done');
                event.target.classList.add('task-done-done');
            }
        }
    }

    catch(error)
    {
        console.log(error);
    }
       
    }
};







async function addToDo(event)
{
    event.preventDefault();


    if(toDoInput.value == "")
    {
        alert("you should enter a description for you task");
        return;
    }
   try
   {
    const res = await fetch("http://localhost:3000/api/tasks",
            {
                 method:'POST',
                    headers: {'Content-Type': 'application/json', },
                    credentials: 'include',
                    body: JSON.stringify({
                        "description":toDoInput.value.trim(),
                        "done":false
                    })    
            }
    )

    if(res.ok)
    {
        console.log("task added succefully !");
        const newTask = await res.json(); 

         const taskContainer = document.createElement('li');
        taskContainer.classList.add('task-container');
        taskContainer.dataset.taskId = newTask.id;
    
     
         const task = document.createElement('div');
        task.classList.add('task');

        const task_text = document.createElement('p');
        task_text.textContent = toDoInput.value.trim();
        task_text.classList.add('task-text');

        const div_btn = document.createElement('div');

        const done_btn = document.createElement('button');
        done_btn.classList.add('task-done');

        const delete_btn = document.createElement('button');
        delete_btn.classList.add('task-delete');
        // delete_btn.textContent = "delete";
    

        toDoList.appendChild(taskContainer);
             taskContainer.appendChild(task);
             task.appendChild(task_text);
            task.appendChild(div_btn);
        div_btn.appendChild(done_btn);
        div_btn.appendChild(delete_btn);
    }
    else
    {
        console.log("failed to add task !");
        return ;
    }



  toDoInput.value = "";
}
catch(error)
{
    console.log(error);
}
  
}











