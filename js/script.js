'use strict';
let replaceBackground = function () {
  document.body.style.backgroundImage = 'url(../svg/background.svg)';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
};
document.addEventListener('DOMContentLoaded', replaceBackground);









document.addEventListener('DOMContentLoaded', () =>{
  function req(){
    // const request = new XMLHttpRequest();
    // request.open('GET',' http://localhost:3000/users');
    // request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    // request.send();
    // request.addEventListener('load', function(){
    //   if(request.status == 200){
    //     let data = JSON.parse(request.response);
    //     console.log(data);
    //     createLeaderboard(data);
    //   } else {
    //     console.error('gbplf');
    //   }
    // });
    getResourse('https://fe.it-academy.by/AjaxStringStorage2.php')
  
    .then(data => createLeaderboard(data.data))
    .catch(err => console.error(err));

  }
  req();

//  async function getResourse(url){
//   const res = await fetch(`${url}`);

//   if(!res.ok){
//     throw new Error(`fetch ${url} failed, status ${res.status}`);

//   }

//   return await res.json();
// }

async function getResourse(url){
  const res = await axios(`${url}`);

  if(res.status!==200){
    throw new Error(`fetch ${url} failed, status ${res.status}`);

  }

  return  res;
}
  function createLeaderboard(response){
    response.forEach(item =>{
      let card = document.createElement('div');
      card.innerHTML = `
      <span id="name">User: ${item.name}</span>,
      <span id="name">Score: ${item.score}</span>
      `;
      document.querySelector('#leaderboard').appendChild(card);
      });
  }
});
