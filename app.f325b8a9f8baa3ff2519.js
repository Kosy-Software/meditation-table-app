(()=>{"use strict";(()=>{function e(e,t){let s=document.querySelector("#viewing"),i=e.youtubeUrl.split("=")[1];if(null!=e.player&&null!=e.youtubeUrl){e.player.setVideoId(i);let t=e.player.getPlayer();return t.classList.add("overlay"),t}return s.cloneNode(!1)}class t{constructor(e){this.kosyClient=window.parent,this.latestMessageNumber=0,this.kosyApp=e}dictionaryToArray(e){let t=[];for(const s in e)e.hasOwnProperty(s)&&t.push([s,e[s]]);return t}startApp(){return this.initialInfoPromise=new Promise(((e,t)=>{window.addEventListener("message",(t=>{let s=t.data;switch(s.type){case"receive-initial-info":this.latestMessageNumber=s.latestMessageNumber,this.clients=s.payload.clients,this.hostClientUuid=s.payload.initializerClientUuid,this.log("Resolving initial info promise with: ",s.payload),e(s.payload);break;case"set-client-info":{let e=s.clients,t=s.hostClientUuid;this.initialInfoPromise.then((s=>{let i=this.dictionaryToArray(e).filter((e=>!this.clients[e[0]])),a=this.dictionaryToArray(this.clients).filter((t=>!e[t[0]])),n=this.latestMessageNumber;this.hostClientUuid!==t&&this._relayMessageToClients(s,{type:"_host-has-changed",clientUuid:t},++n),i.forEach((e=>this._relayMessageToClients(s,{type:"_client-has-joined",clientInfo:e[1]},++n))),a.forEach((e=>this._relayMessageToClients(s,{type:"_client-has-left",clientUuid:e[0]},++n))),this.clients=e,this.hostClientUuid=t}));break}case"get-app-state":{let e=s.clientUuids;this.log("Get app state received -> sending app state");const t=this.kosyApp.onRequestState();this._sendMessageToKosy({type:"receive-app-state",state:t,clientUuids:e,latestMessageNumber:this.latestMessageNumber});break}case"set-app-state":this.latestMessageNumber=s.latestMessageNumber;let t=s.state;this.initialInfoPromise.then((()=>{this.log("Received app state from Kosy -> setting app state"),this.kosyApp.onProvideState(t)}));break;case"receive-message-as-host":this._handleReceiveMessageAsHost(s);break;case"receive-message-as-client":this._handleReceiveMessageAsClient(s)}})),this._sendMessageToKosy({type:"ready-and-listening"})})),this.initialInfoPromise}stopApp(){this._sendMessageToKosy({type:"stop-app"})}relayMessage(e){this.log("Relaying client message to host: ",e),this._sendMessageToKosy({type:"relay-message-to-host",message:e})}_relayMessageToClients(e,t,s){this.log("Relaying host to client message: ",t),this._sendMessageToKosy({type:"relay-message-to-clients",sentByClientUuid:e.currentClientUuid,message:t,messageNumber:s})}_sendMessageToKosy(e){this.kosyClient.postMessage(e,"*")}_handleReceiveMessageAsClientRecursive(e,t,s){var i,a,n,o,l,r;if(this.latestMessageNumber===e.messageNumber-1){switch(e.message.type){case"_host-has-changed":{let t=e.message.clientUuid;this.hostClientUuid=t,null===(a=(i=this.kosyApp).onHostHasChanged)||void 0===a||a.call(i,t);break}case"_client-has-joined":{let t=e.message.clientInfo;this.clients[t.clientUuid]=t,null===(o=(n=this.kosyApp).onClientHasJoined)||void 0===o||o.call(n,t);break}case"_client-has-left":{let t=e.message.clientUuid;this.clients[t]=null,null===(r=(l=this.kosyApp).onClientHasLeft)||void 0===r||r.call(l,t);break}default:this.kosyApp.onReceiveMessageAsClient(e.message)}this.latestMessageNumber=e.messageNumber}else s<50&&this.latestMessageNumber<e.messageNumber?setTimeout((()=>this._handleReceiveMessageAsClientRecursive(e,t,s+1)),100):(this.log("Timeout on processing message as client: ",e.message),this.log("Wait for Kosy to fix this mess..."))}_handleReceiveMessageAsClient(e){this.initialInfoPromise.then((t=>{this.log("Received message as client, processing: ",e.message),this._handleReceiveMessageAsClientRecursive(e,t,0)}))}_handleReceiveMessageAsHost(e){this.initialInfoPromise.then((t=>{this.log("Trying to handle message as host");const s=this.kosyApp.onReceiveMessageAsHost(e.message);s&&this._relayMessageToClients(t,s,this.latestMessageNumber+1)}))}log(...e){"1"===localStorage.getItem("debug-mode")&&console.log("From kosy-app-api: ",...e)}}class s{constructor(e,t,s,i){this.dispatch=s,this.isHost=t,this.origin=origin,this.time=i,this.player=new YT.Player("viewing",{height:"0px",width:"0px",videoId:e,events:{onReady:()=>this.onPlayerReady()},playerVars:{enablejsapi:1,autoplay:1,origin:"https://youtube.com",fs:1,rel:0,modestbranding:1,showinfo:0,autohide:this.isHost?0:1,start:i}})}setVideoId(e){this.videoId=e}getPlayer(){return this.player.getIframe()}getCurrentState(){return null!=this.player&&this.player.getPlayerState?this.player.getPlayerState():null}loadVideo(){null!=this.videoId&&""!=this.videoId&&(this.player.loadVideoById(this.videoId,0,"large"),this.player.setSize(window.innerWidth,window.innerHeight))}handleStateChange(e,t){if(null!=this.player&&this.player.getPlayerState&&this.player.getPlayerState()!=e)switch(null!=t&&this.player.seekTo(t,!0),e){case YT.PlayerState.PLAYING:case YT.PlayerState.CUED:this.player.playVideo();break;case YT.PlayerState.PAUSED:this.player.pauseVideo();break;case YT.PlayerState.ENDED:}}onPlayerReady(){this.player.mute(),this.player.seekTo(this.time,!0),null!=this.videoId&&(this.loadVideo(),this.isHost&&(this.interval=window.setInterval((()=>{this.getCurrentStateAndTime()}),500)))}getCurrentStateAndTime(){let e=this.player.getPlayerState(),t=this.player.getCurrentTime();this.dispatch({type:"youtube-video-state-changed",payload:{state:e,time:t}}),e==YT.PlayerState.ENDED&&null!=this.interval&&clearInterval(this.interval)}}var i;!function(i){var a;(function(i){class a{constructor(){this.state={youtubeUrl:"https://www.youtube.com/embed?v=ENYYb5vIMkU",videoState:null},this.kosyApi=new t({onClientHasJoined:e=>this.onClientHasJoined(e),onClientHasLeft:e=>this.onClientHasLeft(e),onReceiveMessageAsClient:e=>this.processMessage(e),onReceiveMessageAsHost:e=>this.processMessageAsHost(e),onRequestState:()=>this.getState(),onProvideState:e=>this.setState(e)})}start(){var e,t,s,i,a;return t=this,s=void 0,a=function*(){let t=yield this.kosyApi.startApp();this.initializer=t.clients[t.initializerClientUuid],this.currentClient=t.clients[t.currentClientUuid],this.state=null!==(e=t.currentAppState)&&void 0!==e?e:this.state,this.isApiReady=!1,this.setupPlayerScript(),this.renderComponent(),window.addEventListener("message",(e=>{this.processComponentMessage(e.data)}))},new((i=void 0)||(i=Promise))((function(e,n){function o(e){try{r(a.next(e))}catch(e){n(e)}}function l(e){try{r(a.throw(e))}catch(e){n(e)}}function r(t){var s;t.done?e(t.value):(s=t.value,s instanceof i?s:new i((function(e){e(s)}))).then(o,l)}r((a=a.apply(t,s||[])).next())}))}setupPlayerScript(){window.onYouTubeIframeAPIReady=()=>{this.onYouTubeIframeAPIReady()};const e=document.createElement("script");e.src="https://www.youtube.com/iframe_api";const t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}onYouTubeIframeAPIReady(){this.isApiReady=!0,this.player=new s("",this.initializer.clientUuid==this.currentClient.clientUuid,(e=>this.processComponentMessage(e)),this.state.time),this.renderComponent()}setState(e){this.state=e,this.renderComponent()}getState(){return this.state}onClientHasJoined(e){}onClientHasLeft(e){e===this.initializer.clientUuid&&(this.state.youtubeUrl?this.kosyApi.relayMessage({type:"assign-new-host"}):this.kosyApi.stopApp())}processMessageAsHost(e){switch(e.type){case"assign-new-host":this.renderComponent();break;default:return e}return null}processMessage(e){switch(e.type){case"close-integration":this.kosyApi.stopApp();break;case"receive-youtube-video-state":this.isApiReady&&(this.state.videoState=e.payload.state,this.state.time=e.payload.time,this.state.videoState==YT.PlayerState.ENDED&&(console.log("Video ended, clearing youtube url"),this.state.videoState=null,this.kosyApi.stopApp()),this.renderComponent())}}processComponentMessage(e){switch(e.type){case"close-integration":this.kosyApi.relayMessage({type:"close-integration"});break;case"youtube-video-state-changed":this.kosyApi.relayMessage({type:"receive-youtube-video-state",payload:e.payload})}}renderComponent(){!function(t,s){var i;let a,n=document.getElementById("root"),o=n.firstChild;if(a=e,null!=t.videoState&&null!=o&&(o.hidden=!1,t.player.handleStateChange(t.videoState,t.time)),(null==t.videoState||null==(null===(i=t.player)||void 0===i?void 0:i.videoId))&&null!=a){var l=n.cloneNode(!1);n.parentNode.replaceChild(l,n),l.appendChild(a(t,s))}}({videoState:this.state.videoState,time:this.state.time,currentClient:this.currentClient,initializer:this.initializer,player:this.player,youtubeUrl:this.state.youtubeUrl},(e=>this.processComponentMessage(e)))}log(...e){var t,s;console.log(`${null!==(s=null===(t=this.currentClient)||void 0===t?void 0:t.clientName)&&void 0!==s?s:"New user"} logged: `,...e)}}i.App=a,(new a).start()})((a=i.Integration||(i.Integration={})).Meditation||(a.Meditation={}))}(i||(i={}))})()})();