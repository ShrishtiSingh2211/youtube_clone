const apiKey='AIzaSyD0R5mSYnh7wh7D87mhefCAxtzjHDqhgZE';

localStorage.setItem("apiKey" , apiKey)
let searchQuery;
let searchBtn;


window.addEventListener("DOMContentLoaded" , async function(){
    const headerContainer=document.querySelector("header");

    try{
     const response=await fetch('header.html');
     const data=await response.text();
     headerContainer.innerHTML=data;
  
  
      searchQuery=document.getElementById('search-query');
      searchBtn=document.getElementById('search-btn');
      
     console.log(searchQuery , searchBtn)

      searchBtn.addEventListener('click',()=>{
        
      console.log("first")
      console.log(searchQuery.value)
      searchResults(searchQuery.value);
     });
    
    }
    catch(error){
        console.log("error fetching header.html ",error);
    }
})
inputBtn.addEventListener(click,()=> {
    let searchString = userInput.value;
    document.getElementById("loader").style.display = "block";
    fetchUserSerach(searchString);
})
/*const toggle_btn = document.querySelector('#checkbox');
toggle_btn.addEventListener('change',()=> {
  
    if(toggle_btn.checked){
        document.body.classList.add('dark-mode')
    }else{
        document.body.classList.remove('light-mode')
    }
    
} )*/
const themeSwitcher = document.getElementById('theme-switcher');

themeSwitcher.addEventListener('click', () => {
    if(body.classlist.contains(dark-theme))
     document.body.classList.remove('dark-theme');
else
    document.body.classList.add('dark-theme');
});



//    function fetchVideos(searchQuery){
//     const search = (searchQuery.value)
   
//    searchResults(search);

// }

async function searchResults(searchvalue){
    try{
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchvalue}&maxResults=21&key=${apiKey}`)
    

    const data = await response.json();
    console.log(data)

    let items = data.items;
    console.log(items)

    for(let i=0; i<items.length; i++){
        let item = items[i]
        let videoId = item.id.videoId ? item.id.videoId : ""
        console.log(videoId)
        let videoStats = await fetchStats(videoId);
        
        if(videoStats.items.length>0)    
       item.videoStats=videoStats.items[0].statistics; 
       item.duration=videoStats.items[0] && videoStats.items[0].contentDetails.duration;
     }
      
      showItems(items)
    }

    catch(error){
        console.log('something went wrong',error);
    }
    }


    window.addEventListener("load" , () => {
         searchResults()
    })


    function showItems(items){
    // console.log(items.id.videoId)

    let videoContainer = document.querySelector(".video-container")
    videoContainer.innerHTML = ""

    
    for(let i=0; i<items.length; i++){
        
        let item =  document.createElement("div")
        item.setAttribute("id" , items[i].id.videoId ? items[i].id.videoId : "undefined")
        item.setAttribute("class" , "item")

        item.addEventListener("click" , () => {
           navigateToVideo(items[i].id.videoId )
        })
        console.log()
        

       item.innerHTML = 
        `
      
        <div class="thumbnail">
          <img src=${items[i].snippet.thumbnails.medium.url} alt="">
          <div class="time">${items[i].duration ? formatDuration(items[i].duration) : "NA"}</div>
        </div>
         <div class="description">
            <div class="channel-icon">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/YouTube_social_white_square_%282017%29.svg/300px-YouTube_social_white_square_%282017%29.svg.png?20220808215424" alt="icon">
            </div>
            <div class="channel-description">
              <div class="title">${items[i].snippet.title}</div>
              <div class="channel-name">
                  ${items[i].snippet.channelTitle}
              </div>
              <div class="stats">
                  <div class="views">
                      ${items[i].videoStats ? formatViews(items[i].videoStats.viewCount) : "NA"}
                  </div>
                  <div>
                     ${items[i].snippet.publishTime ? formatPublishTime(items[i].snippet.publishTime) : "NA"}
                  </div>
              </div>
            </div>

         </div>
    
        
        `
      videoContainer.append(item)

       }
    }

    function formatPublishTime(inputDateTime){
        let date=new Date().getTime();
        console.log(date);
        let target=new Date(inputDateTime).getTime();
        console.log(target);
        let timeDiff=Math.abs(date-target);
        // console.log(timeDiff)
        let daysDiff=Math.ceil(timeDiff/(1000*3600*24));
        // console.log(daysDiff);
        
        if(daysDiff===0){
            const today= new Date(Date.now()-target).getHours();
            return today+'ago';
        }
        else if(daysDiff===1){
            return 'yesterday';
        }
        else if(daysDiff>1 && daysDiff<=7){
            return `${daysDiff} days ago`;
        }
        else if(daysDiff>7 && daysDiff<=14){
            return `last week `;
        }
        else if(daysDiff>14 && daysDiff<=30){
            return `${Math.floor(daysDiff/7)} weeks ago`;
        }
        else if(daysDiff>30 && daysDiff<=365){
            return `${Math.floor(daysDiff/30)} months ago`
        }
        else {
            return `${Math.floor(daysDiff/365)} years ago`
        }
        
        }
    function formatViews(count){
        if(count<1000){
          return count;
        }
        else if(count<=999999 && count>=1000){
        const thousand=parseInt(count/1000);
        return thousand+"K";
        }
        else if(count>=1000000){
          const millions=parseInt(count/10000);
          return millions+"M";
        }
        }

    function formatDuration(duration){
        if(duration || duration!==undefined){
        let p=duration.indexOf('P');
        let d=duration.indexOf('D');
        let t=duration.indexOf('T');
        let h=duration.indexOf('H');
        let m=duration.indexOf('M');
        let s=duration.indexOf('S');

        let day=0,hour=0,min=0,sec=0;
        if(p!==-1 && d!==-1 && t!==-1 && h!==-1 && m!==-1 && s!==-1){
            day=duration.substring(p+1,d);
            hour=duration.substring(t+1,h);
            min=duration.substring(h+1,m);
            sec=duration.substring(m+1,s);
            return `${day}:${hour}:${min}:${sec}`;
        }
        else if(p!==-1 && d===-1 && t!==-1 && h!==-1 && m!==-1 && s!==-1){
            hour=duration.substring(t+1,h);
            min=duration.substring(h+1,m);
            sec=duration.substring(m+1,s);
            return `${hour}:${min}:${sec}`;
        }
        else if(p!==-1 && d===-1 && t!==-1 && h===-1 && m!==-1 && s!==-1){
            min=duration.substring(t+1,m);
            sec=duration.substring(m+1,s);
            return `${min}:${sec}`;
        }
        else if(p!==-1 && d===-1 && t!==-1 && h===-1 && m===-1 && s!==-1){
            sec=duration.substring(t+1,s);
            return `${min}:${sec}`;
        }
        }
        else{
        return '';
        }
        // console.log(day,hour,min,sec);
}



    

   async function fetchStats(videoId){

        try{
            const endpoint=`https://youtube.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=${apiKey}`
            
            let response=await fetch(endpoint);
            let result= await response.json();
            // console.log(result);
        return result;
        }
        catch (error){
            console.error(error , "not able to recorganised")
        }
      } 





  function navigateToVideo(videoId){
    if(videoId){
       
        document.cookie = `videoId = ${videoId} ; path = ${"./videos.html"}`

        let linkItem = document.createElement("a");
        linkItem.href = "videos.html"
        linkItem.target = "_blank"
        linkItem.click();

    }
    else{
        alert("Owner wants to view the video  in youtube")  
    }

  }
/*  const switchTheme=() =>{
     const rootElm=document.documentElement;
     let dataTheme=rootElm.getAttribute('data-theme');
     const newTheme=(dataTheme==='light')?'dark':'light';
     rootElm.setAttribute('data-theme',newTheme)
     document.querySelector('#theme-switch').addEventListener('click',switchTheme);
  }*/