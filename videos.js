
let channelIdOftheRederedVideo ;

window.addEventListener("DOMContentLoaded" , async function(){
    const headerContainer=document.querySelector("header");

    try{
     const response=await fetch('header.html');
     const data=await response.text();
     headerContainer.innerHTML=data;
  
  
    }
    catch(error){
        console.log("error fetching header.html ",error);
    }
})

    let apiKey = localStorage.getItem("apiKey");
    let videoId;
    // console.log(apiKey)

    let cookie = document.cookie.split(";");
    
    cookie.forEach(Element => {                             
    
        if(Element.split("=")[0].trim() == 'videoId'){
            videoId = Element.split("=")[1].trim()

        }
        
    }) 

    // console.log(videoId)

    
    let firstScript = document.getElementsByTagName("script")[0] ;

    firstScript.addEventListener("load", onLoadScript)
    
    // console.log(firstScript)

    function onLoadScript() {
        if (YT){
          new YT.Player("video", {
            height: "360px",
            width: "700px",
            videoId,
            events: {
              onReady: (event) => {
                  document.title = event.target.videoTitle ;
                  fetchStats(videoId)
                  fetchComment(videoId)
              }
            }
          });
        }
      }




   async function  fetchStats(videoId){
      
      let endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=${apiKey}&id=${videoId}`;
      try{
         
        let response = await fetch(endpoint);
        let data = await response.json()
        // console.log(data)

        let item = data.items[0]
        // console.log(item)
        channelIdOftheRederedVideo = item.snippet.channelId
           await fetchSuggestion(channelIdOftheRederedVideo)
     
        let subscribers = await  getSubscriber(item.snippet.channelId)
       

        let stats = document.getElementById("stats")
        
       
        stats.innerHTML = ""

        stats.innerHTML = 
                    ` 
                    <h3 class="title">
                   ${item.snippet.title}
                </h3>
                <div class="stats">
                   <div class="left-stats">
                    <div class="img">
                        <img src=${item.snippet.thumbnails.default.url} alt="">
                    </div>
                    <div class="channel-desc">
                        <h3 class="channel-name">${item.snippet.channelTitle}</h3>
                        <span class="subscriber">${subscribers} subscribers</span>
                    </div>
                    <div class="btn">
                        subscribe
                    </div>
                   </div>
                   <div class="right-stats">
                    <div class="like-unlike">
                        <div class="like">
                            <i class=" fa fa-light fa-thumbs-up"></i>
                            <span>${item.statistics.likeCount}</span>
                        </div>
                        <div class="line"></div>
                        <div class="unlike">
                            <i class=" fa fa-light fa-thumbs-down"></i>
                            <span></span>
                        </div>
    
                    </div>
                    <div class="share">
                        <i class=" fa fa-thin fa-share"></i>
                        <span>share</span>
                    </div>
                    <div class="ellipsis">
                        <i class=" fa fa-solid fa-ellipsis"></i>
                    </div>
                   </div>
                </div>
                    `
       
    
      }
      catch(error){
        console.log("the error is ---> " ,  error)
      }

      }




     async function getSubscriber(channelId){
        let endpoint = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;

        try{
           let response = await fetch(endpoint)
           let data = await response.json()
         return(data.items[0].statistics.subscriberCount) 
        }

        catch(error){
            console.log("error in the getSubsciber --> ", error)
        }
      }
    


      async function fetchComment(videoId){
        let endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`;  
        try{
            let response = await fetch(endpoint)
            let data = await response.json();
            // console.log(data)
            let items = data.items;
            //  console.log(items)

           let commentSection =  document.getElementById("comment-section");
           

         for(let i=0; i<items.length; i++){
             
            let item= items[i]
            let id = item.snippet.topLevelComment.id;
            let imgUrl = item.snippet.topLevelComment.snippet.authorProfileImageUrl;
            let commentText = item.snippet.topLevelComment.snippet.textDisplay;
            let time = item.snippet.topLevelComment.snippet.publishedAt
            let authorName = item.snippet.topLevelComment.snippet.authorDisplayName
            let likes = item.snippet.topLevelComment.snippet.likeCount
            let replyCount = item.snippet.totalReplyCount
            // console.log(imgUrl , commentText , time, authorName , likes)

            let comment = document.createElement("div")
            // comment.setAttribute("id" ,  id)
            comment.setAttribute("class" , "comment")

            comment.innerHTML = 
                            ` 
                           
                            <div class="img">
                              <img src="${imgUrl}" alt="" />
                            </div>
                            <div class="right-comment">
                              <div class="owner-name">
                                <span class="name">${authorName}</span>
                                <span class="time">${formatPublishTime(time)}</span>
                              </div>
                              <p class="comment-title">
                                ${commentText}
                              </p>
                              <div class="like-unlike">
                                <div class="like">
                                  <i class="fa fa-thin fa-thumbs-up"></i>
                                  <span class="like-count">${likes}</span>
                                </div>
                                <div class="unlike">
                                  <i class="fa fa-thin fa-thumbs-down"></i>
                                  <span class="unlike-count"></span>
                                </div>
                                <span class="reply">Reply</span>
                              </div>
                              <div class="btn" onclick="loadReplies(this )" data-id = ${id}>
                                <i class="fa fa-solid fa-angle-down"></i>
                                <span> ${replyCount} replies</span>
                              </div>
                              <div id="${id}" class="reply-container">
                
                              </div>

                            `
        commentSection.appendChild(comment)
          console.log(id)
         }
        

       


        }
        catch(error){ 
            console.log("the error is in fetch comment -->" , error)
        }
      }

    async function loadReplies(element ){
         console.log("first")
         let commentId = (element.getAttribute("data-id"))
         console.log(commentId)
      //  console.log(divId)
      // let  commentId = divId.id   
      // console.log(commentId)


     let endpoint = `https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${commentId}&key=${apiKey}`;

     try{
           let response = await fetch(endpoint)
           let data = await response.json()

           let items = data.items;
           let repliesContainer = document.getElementById(commentId);
           repliesContainer.innerHTML = ""
          
          //  console.log(items)

           for(let i=0; i<items.length; i++){
            let item = items[i];
            let newReply = document.createElement("div")
            
            newReply.setAttribute("class" , "replies")
            
            let imageUrl = item.snippet.authorProfileImageUrl;
            let id = item.id;
           
            let commentText = item.snippet.textDisplay;
            let time = item.snippet.publishedAt
            let authorName = item.snippet.authorDisplayName
            let likes = item.snippet.likeCount


            
           
            newReply.innerHTML = 
                                 ` 
                                
                                 <div class="img">
                                   <img src="${imageUrl}" alt="" />
                                 </div>
                                 <div class="right-comment">
                                   <div class="owner-name">
                                     <span class="name">${authorName}</span>
                                     <span class="time">${formatPublishTime(time)}</span>
                                   </div>
                                   <p class="comment-title">
                                     ${commentText}
                                   </p>
                                   <div class="like-unlike">
                                     <div class="like">
                                       <i class="fa fa-thin fa-thumbs-up"></i>
                                       <span class="like-count">${likes}</span>
                                     </div>
                                     <div class="unlike">
                                       <i class="fa fa-thin fa-thumbs-down"></i>
                                       <span class="like-count"></span>
                                     </div>
                                     <span class="reply">Reply</span>
                                   </div>
                                 </div>
                            
                                 
                  
               
                                 `

             repliesContainer.appendChild(newReply)
            //  repliesContainer.style.display = "flex"
            
            
          }
          repliesContainer.classList.toggle("show")
     }catch(error){
        console.log("error is in loadReplies --> " , error)
     }

      }

       async   function fetchSuggestion(channelId){

          let endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&maxResults=50&key=${apiKey}`
         
          // console.log("second")
          try{
            let response = await fetch(endpoint)
            let data = await  response.json()
            // console.log(data)
            let items = data.items
            // console.log(items)


            let rightSection = document.getElementById("right-section-comment")
              // console.log(rightSection)

            for(let i=0; i<items.length; i++){
              let item = items[i];
             

              let stats = await fetchStatistic(item.id.videoId)
              item.statistics = stats.items[0].statistics
              
              let videoSuggestion = document.createElement("div")
              videoSuggestion.setAttribute("class" , "videoSuggestion")
              videoSuggestion.setAttribute("id" , item.id.videoId)

              videoSuggestion.innerHTML = 
                                          `
                                          <div class="img">
                                          <img src="${item.snippet.thumbnails.default.url}" alt="">
                                        </div>
                                        <div class="content">
                                          <h2 class="title">${item.snippet.title}</h2>
                                          <div class="channel-name">
                                            ${item.snippet.channelTitle}
                                          </div>
                                          <div class="stats">
                                            <div class="views">${item.statistics.viewCount} views</div>
                                            <span class="dot" style="height: 5px ;width: 5px; border-radius: 50% ; transform: translateY(6px); background-color: gray; margin: 0 5px;"></span>
                                            <div class="time">${item.snippet.publishedAt ? formatPublishTime(item.snippet.publishedAt): ""}</div>
                                          </div>
                                        </div>
                                          `

             rightSection.append(videoSuggestion) 

            }
            // console.log(items)
          }
          catch(error){
            console.log("the error is in the fetchSuggestion -->" , error)
          }
        }


        async function fetchStatistic(videoId){
          // console.log("first")

          if(!videoId)  return;

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

        function formatPublishTime(inputDateTime){
          let date=new Date().getTime();
          // console.log(date);
          let target=new Date(inputDateTime).getTime();
          // console.log(target);
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

      //   {
      //     "kind": "youtube#searchResult",
      //     "etag": "HOqvy6YIODBiAXezncMIykmOZWY",
      //     "id": {
      //         "kind": "youtube#video",
      //         "videoId": "lZE6_I5YkV8"
      //     },
      //     "snippet": {
      //         "publishedAt": "2022-12-20T05:41:39Z",
      //         "channelId": "UCc5FkTYiWH5L3Gk5IyW6Rmw",
      //         "title": "Change VS Code Cursor Style and Animation",
      //         "description": "Change VS Code Cursor Style and Animation Vue JS: ...",
      //         "thumbnails": {
      //             "default": {
      //                 "url": "https://i.ytimg.com/vi/lZE6_I5YkV8/default.jpg",
      //                 "width": 120,
      //                 "height": 90
      //             },
      //             "medium": {
      //                 "url": "https://i.ytimg.com/vi/lZE6_I5YkV8/mqdefault.jpg",
      //                 "width": 320,
      //                 "height": 180
      //             },
      //             "high": {
      //                 "url": "https://i.ytimg.com/vi/lZE6_I5YkV8/hqdefault.jpg",
      //                 "width": 480,
      //                 "height": 360
      //             }
      //         },
      //         "channelTitle": "Geeky Shows",
      //         "liveBroadcastContent": "none",
      //         "publishTime": "2022-12-20T05:41:39Z"
      //     },
      //     "statistics": {
      //         "viewCount": "9355",
      //         "likeCount": "413",
      //         "favoriteCount": "0",
      //         "commentCount": "6"
      //     }
      // }
     
    


   
    
    
     

    