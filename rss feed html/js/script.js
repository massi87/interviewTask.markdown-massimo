var listSaved = new Array();
var url_feed= '';

/* Here you can add more inputs to set value. if it's saved */

/*if list urls saved, insert list inside content */


if (!(localStorage.getItem("listUrls") === null)) {
    listSaved= JSON.parse(getSavedValue("listUrls"));
    if(listSaved.length > 0){
        url_feed=listSaved[0];
        // console.log(url_feed);
        if(document.getElementById('boxUrls').innerHTML.trim() == ""){
            var ul = document.createElement('ul');
            for (var index = 0; index < listSaved.length; ++index) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.setAttribute('href', listSaved[index]);
                a.innerHTML=listSaved[index];
                li.appendChild(a);
                li.innerHTML += '<i class="fa fa-times" aria-hidden="true" onclick="remove(this)"></i>';
                ul.appendChild(li);
            }
            document.getElementById('boxUrls').appendChild(ul);
        }
    }
}



//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e){
    var id = e.id;  // get the sender's id to save it . 
    var val = e.value; // get the value. 
    localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

//get the saved value function - return the value of "v" from localStorage. 
function getSavedValue  (v){
    if (localStorage.getItem(v) === null) {
        return "";// You can change this to your defualt value. 
    }
    return localStorage.getItem(v);
}

function formatDate(date){
    var format = new Date(date);
    var dateString = format.getDay() + '/' + (format.getMonth() + 1) + '/' + format.getFullYear();
    return dateString;
}

function enterUrl(){
    var input = document.getElementById('txt_1').value;
    
    if(input != ""){
        
        if(document.getElementById('boxUrls').innerHTML.trim() == ""){
            //console.log(input);
            var ul = document.createElement('ul');
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.setAttribute('href', input);
            a.innerHTML=input;
            li.appendChild(a);
            li.innerHTML += '<i class="fa fa-times" aria-hidden="true"  onclick="remove(this)"></i>';
            ul.appendChild(li);
            document.getElementById('boxUrls').appendChild(ul);

            listSaved.unshift(input);
            localStorage.setItem("listUrls", JSON.stringify(listSaved));

            if(listSaved.length>0){
                url_feed=listSaved[0];
                xhr.open('GET','https://api.rss2json.com/v1/api.json?count=50&rss_url='+url_feed,true);
                xhr.send();
            }
        }
        else{
            //console.log(listSaved);
            var indexControl = listSaved.indexOf(input);
            if(indexControl > -1){
                alert("you already insert url: "+ input);
            }
            else{
                var list = document.getElementById('boxUrls').getElementsByTagName('ul')[0];         
                var newItem = document.createElement("li");       // Create a <li> node
                var linkItem = document.createElement("a");       // Create a <a> node
                linkItem.setAttribute('href', input);
                var textnode = document.createTextNode(input);  // Create a text node
                linkItem.appendChild(textnode);
                newItem.appendChild(linkItem);
                newItem.innerHTML += '<i class="fa fa-times" aria-hidden="true" onclick="remove(this)"></i>';
                list.insertBefore(newItem, list.childNodes[0]); 

                listSaved.unshift(input);
                localStorage.setItem("listUrls", JSON.stringify(listSaved));

                if(listSaved.length>0){
                    url_feed=listSaved[0];
                    xhr.open('GET','https://api.rss2json.com/v1/api.json?count=50&rss_url='+url_feed,true);
                    xhr.send();
                }
            }
        }
        document.getElementById('txt_1').value="";
    }
}

var content = document.getElementById('content');
var loader = document.getElementById('loader');

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
    // console.log(xhr);
    if(url_feed!=''){
        if (xhr.readyState==4 && xhr.status==200)
        {
            var data = JSON.parse(xhr.responseText);
            if(data.status == 'ok'){
                //console.log(data);
                var output = '<h1 class="titleFeed">'+data.feed.title+'</h1>';
                for(var i=0;i<data.items.length;++i){
    
                    output += '<div class="boxFeedItem"><div><span><a href="' +
                    data.items[i].link + '" >' +
                    data.items[i].title + '</span></a> - '+
                    '<span>'+ formatDate(data.items[i].pubDate) +'</span>'
                    +'</div>';
                    output+= '<div>'+data.items[i].content+'</div></div>';
    
                }
    
    
                content.innerHTML = output;
    
            }
        }
        else{
            //  console.log(url_feed);
            //  console.log(xhr.readyState);
            if(url_feed != ''){
                // document.getElementById('content').innerHTML='<h1 class="error">There is a problem with the url and/or the response</h1>';
                document.getElementById('content').innerHTML='';
            }
        }
    }
};


//xhr.open('GET','https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.ycombinator.com%2Frss',true);
xhr.open('GET','https://api.rss2json.com/v1/api.json?count=50&rss_url='+url_feed,true);
xhr.send();

// Get the input field
var input = document.getElementById("txt_1");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode == 13) {
    // Trigger the button element with a click
    document.getElementById("buttInput").click();
  }
});

function remove(e){
    var linkToRemove=e.parentNode.childNodes[0].innerHTML;
    e.parentNode.parentNode.removeChild(e.parentNode);
    var index = listSaved.indexOf(linkToRemove);
    if (index > -1) {
        listSaved.splice(index, 1);
    }
    localStorage.setItem("listUrls", JSON.stringify(listSaved));
    if(listSaved.length>0){
        xhr.open('GET','https://api.rss2json.com/v1/api.json?count=50&rss_url='+listSaved[0],true);
        xhr.send();
    }
    else{
        document.getElementById('content').innerHTML="";
    }
    //console.log(listSaved);
}

