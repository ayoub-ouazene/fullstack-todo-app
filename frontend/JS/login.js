const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () =>{
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () =>{
    container.classList.remove("sign-up-mode");
});


const loginEmail = document.getElementById("login-email-input");
const loginPassword = document.getElementById("login-password-input");


const loginBtn = document.getElementById("login");
loginBtn.addEventListener('click', Login);

async function Login(event)
{
   try
   {
        event.preventDefault();
      const res = await fetch('http://localhost:3000/api/users/login',
                {
                    method:'POST',
                    headers: {'Content-Type': 'application/json', },
                    credentials: 'include',
                    body: JSON.stringify({
                        "email":loginEmail.value,
                        "password":loginPassword.value
                    })                          
                }
      )

      if(res.ok)
      {
        console.log("valid password");
        // window.location.href = '/frontend/todoapp.html';
         window.location.href = 'http://localhost:3000/app';
      }
      else
      {
        alert("	Invalid email or password");
      }

   }
   catch(error)
   {
    console.log(error);
    alert(error);
   }
}



const SignUpName = document.getElementById("SignupName");
const SignUpEmail = document.getElementById("SignupEmail");
const SignupPassword = document.getElementById("SignupPassword");


const SignUpBtn = document.getElementById("signup");

SignUpBtn.addEventListener("click",SignUp);

async function SignUp(event)
{
    event.preventDefault();
    try
    {
        const res = await fetch('http://localhost:3000/api/users',
                       {
                            method:'POST',
                             headers: {'Content-Type': 'application/json', },
                              credentials: 'include',
                                 body: JSON.stringify({
                                     "name":SignUpName.value,
                                     "email":SignUpEmail.value,
                                     "password":SignupPassword.value
                                  })  
                       })

                       if(res.ok)
                       {
                          console.log("succefull sign in");

                          // window.location.href = "/frontend/todoapp.html";
                            window.location.href = 'http://localhost:3000/app';
                       }
                       else
                       {
                         alert("Wrong or invalid data provided.");
                       }
    }

    catch(error)
    {
        console.log(error);
        alert(error);
    }
}