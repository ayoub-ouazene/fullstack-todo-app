// Selectors

const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');


const chatBtn = document.getElementById("chatbot-btn");
const ChatContainer = document.querySelector(".chat-container");

const UserInput = document.getElementById("input-message");
const sendBtn = document.getElementById("send-btn");

const Messages = document.getElementById("messages");


// Event Listeners

toDoBtn.addEventListener('click', addToDo);//,getTasks
toDoList.addEventListener('click',EditTask);//,getTasks
chatBtn.addEventListener('click',chatBotBtn);

sendBtn.addEventListener('click',AddMsg);

UserInput.addEventListener("input", resizeInput);

let tasks ;
document.addEventListener("DOMContentLoaded", async () => {
    await getTasks();});



    
const body = document.getElementById("body");
const title = document.getElementById("title");



const theme1 = document.getElementById("standard-theme");

theme1.addEventListener('click',Theme1);

function Theme1(event)
{
    body.style.backgroundImage = "linear-gradient(to bottom, #062e3f, #f5f5dc)";
    title.style.color = "white";
    localStorage.setItem('theme',"theme1");
}


const theme2 = document.getElementById("light-theme");

theme2.addEventListener('click',Theme2);

function Theme2(event)
{
    body.style.backgroundImage = "linear-gradient(to bottom, #d2b48c, #f5f5dc)";
    title.style.color = "black";
    localStorage.setItem('theme',"theme2");
}


const theme3 = document.getElementById("darker-theme");

theme3.addEventListener('click',Theme3);

function Theme3(event)
{
    body.style.backgroundImage = "linear-gradient(to bottom, #001214, #f5f5dc)";
    title.style.color = "white";
    localStorage.setItem('theme',"theme3");
}

let  standardTheme = localStorage.getItem('theme');

function setTheme()
{
    if(standardTheme == "theme1")
    {
         body.style.backgroundImage = "linear-gradient(to bottom, #062e3f, #f5f5dc)";
         title.style.color = "white";
    }
    else if(standardTheme == "theme2")
    {
         body.style.backgroundImage = "linear-gradient(to bottom, #d2b48c, #f5f5dc)";
         title.style.color = "black";
    }
    else
    {
        body.style.backgroundImage = "linear-gradient(to bottom, #001214, #f5f5dc)";
        title.style.color = "white";
    }
}

setTheme();



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
                 if(data.tasks[i].done == false )
                 {
                    done_btn.classList.add('task-done');
                 }
                 else
                 {
                    done_btn.classList.add('task-done-done');
                 }
                
                 

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





function chatBotBtn(event)
{
    if(ChatContainer.style.visibility == "hidden"  ||  ChatContainer.style.visibility == "" )
    {
        ChatContainer.style.visibility = "visible";
     
     
    }
    else
    {
        ChatContainer.style.visibility = "hidden";
        
    }
}




async function AddMsg(event)

{
    try
    {

    
    if(UserInput.value == "")
    {
        console.log("no valid input");
        return;
    }
 
       const UserMessage = document.createElement("li");
       UserMessage.classList.add("user-message");

       const text1 = document.createElement("p");
       text1.textContent = UserInput.value.trim();
       UserMessage.appendChild(text1);

       Messages.appendChild(UserMessage);

       setTimeout(() => {
            UserMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);

       UserInput.value = "";
       UserInput.style.height = "1.8em";
         
        //  Messages.scrollTo(0,UserMessage.scrollHeight);

       const BotMessage = document.createElement("li");
       BotMessage.classList.add("Bot-message");


       const logo = document.createElement("span");
       logo.classList.add("material-symbols-outlined");
       logo.textContent =  "smart_toy";

       const text2 = document.createElement("p");
       

       setTimeout(() => {
        text2.textContent = "Thinking ..."; 
       }, 600);

       const res = await fetch(
        "http://localhost:3000/api/chatbot",
        {
              method:'POST',
                    headers: {'Content-Type': 'application/json', },
                    credentials: 'include',
                    body: JSON.stringify({
                        "message":text1.textContent
                    })  
        }
       );

       if(res.ok)
       {
         const answer = await res.text();
           setTimeout(() => {
         text2.textContent = answer; 
         BotMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        //   Messages.scrollTo(0,BotMessage.scrollHeight);
         }, 600);

       }
       else
       {
             setTimeout(() => {
         text2.textContent = "Ooops! Something went wrong. Please try again";
         
         }, 600);
       }


          BotMessage.appendChild(logo);
          BotMessage.appendChild(text2);  
         Messages.appendChild(BotMessage); 

          setTimeout(() => {
            BotMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);

    }
    catch(error)
    {
        console.log(error);
    }



}



function resizeInput() {
  this.style.height = 'auto'; 
  this.style.height = this.scrollHeight + 'px';
}

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener('click',LogOut);

async function LogOut(event)
{
    try
    {
        const res = await fetch('http://localhost:3000/api/users/logout',
             {
              method:'POST',
                    headers: {'Content-Type': 'application/json', },
                    credentials: 'include',
            }

        )

        if (res.status === 200)
        {
            window.location.href = "http://localhost:3000/";
        } 
        else 
        {
            console.log(`Failed to logout with status: ${res.status}`);
            const errorText = await res.text();
            console.log("Server response:", errorText);
        }
    }
    catch(error)
    {
        console.log(error);
    }
}
