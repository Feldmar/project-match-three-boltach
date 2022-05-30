'use strict';
let replaceBackground = function () {
  document.body.style.backgroundImage = 'url(../svg/background.svg)';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
};
document.addEventListener('DOMContentLoaded', replaceBackground);






// const nameIn = document.getElementById("email");
// const scoreInp = document.getElementById("password");
// const btn = document.getElementById("btn");

// btn.addEventListener("click", () => {
//   const name = nameIn.value;
//   const score = scoreInp.value;

//   axios.post("http://fe.it-academy.by/AjaxStringStorage2.php", {
//       name: name,
//       score: score
//     })
//     .then((response) => {
//       console.log(response);
//     });
// });


// document.addEventListener('DOMContentLoaded', () =>{
//   function req(){
//     getResourse('https://fe.it-academy.by/AjaxStringStorage2.php')
  
//     .then(data => createLeaderboard(data.data))
//     .catch(err => console.error(err));

//   }
//   req();
  

// async function getResourse(url){
//   const res = await axios(`${url}`);

//   if(res.status!==200){
//     throw new Error(`fetch ${url} failed, status ${res.status}`);

//   }

//   return  res;
// }
//   function createLeaderboard(response){
//     response.forEach(item =>{
//       let card = document.createElement('div');
//       card.innerHTML = `
//       <span id="name">User: ${item.name}</span>,
//       <span id="name">Score: ${item.score}</span>
//       `;
//       document.querySelector('#leaderboard').appendChild(card);
//       });
//   }
// });
